import { and, desc, eq, isNotNull, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertNotification,
  InsertOrder,
  InsertPayment,
  notifications,
  orders,
  payments,
} from "../drizzle/schema";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';
import { notifyOwner } from './_core/notification';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    const prefFields = ["emailNotifications"] as const;
    type PrefField = (typeof prefFields)[number];
    prefFields.forEach((field: PrefField) => {
      const value = (user as InsertUser & { [k: string]: unknown })[field];
      if (value !== undefined) {
        (values as Record<string, unknown>)[field] = value;
        updateSet[field] = value;
      }
    });

    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Idempotent first-login seeding: gives every first-time user a starter set
 * of orders, one paid payment, and unread milestone notifications so the
 * portal never feels empty.
 */
export async function seedOnFirstLogin(userId: number, userName: string | null): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const existing = await db
    .select({ id: orders.id })
    .from(orders)
    .where(eq(orders.userId, userId))
    .limit(1);
  if (existing.length > 0) return;

  const name = userName || "you";
  const now = new Date();
  const h = (hours: number) => new Date(now.getTime() - hours * 3600 * 1000);

  const starterOrders: Array<{
    ref: string;
    store: string;
    item: string;
    destination: string;
    amountGbp: string;
    amountLocal: string;
    currencyCode: string;
    weightKg: string;
    status: "pending_purchase" | "purchased" | "in_warehouse" | "shipped";
    timeline: { at: string; status: string; note: string }[];
  }> = [
    {
      ref: "UKS-84201",
      store: "Nike",
      item: "Nike Air Max 90 trainers (UK 9)",
      destination: "Dar es Salaam, Tanzania",
      amountGbp: "£92.00",
      amountLocal: "TZS 231,840",
      currencyCode: "TZS",
      weightKg: "1.4",
      status: "shipped",
      timeline: [
        { at: h(96).toISOString(), status: "pending_purchase", note: "Order created by " + name },
        { at: h(72).toISOString(), status: "purchased", note: "Trainers purchased at Nike UK" },
        { at: h(48).toISOString(), status: "in_warehouse", note: "Received at London warehouse" },
        { at: h(6).toISOString(), status: "shipped", note: "Air freight departed Heathrow" },
      ],
    },
    {
      ref: "UKS-84202",
      store: "Boots",
      item: "Skincare bundle (3 items)",
      destination: "Kigali, Rwanda",
      amountGbp: "£46.50",
      amountLocal: "RWF 71,145",
      currencyCode: "RWF",
      weightKg: "0.9",
      status: "purchased",
      timeline: [
        { at: h(30).toISOString(), status: "pending_purchase", note: "Order created by " + name },
        { at: h(12).toISOString(), status: "purchased", note: "Items purchased at Boots UK" },
      ],
    },
  ];

  for (const o of starterOrders) {
    await db.insert(orders).values({
      ref: o.ref,
      userId,
      store: o.store,
      item: o.item,
      destination: o.destination,
      amountGbp: o.amountGbp,
      amountLocal: o.amountLocal,
      currencyCode: o.currencyCode,
      weightKg: o.weightKg,
      status: o.status,
      timeline: JSON.stringify(o.timeline),
    });
  }

  await db.insert(payments).values({
    ref: "TXN-" + h(6).toISOString().slice(0, 13).replace(/[^0-9]/g, ""),
    userId,
    orderId: null,
    gateway: "M-Pesa",
    status: "paid",
    amount: "£138.50 (TZS 302,985)",
    currencyCode: "TZS",
    destination: "Dar es Salaam, Tanzania",
  });

  // Insert the seeded orders' notification events as unread so Queen's badge
  // reflects real shipment milestones from the moment the user signs in.
  const seeded = await db.select().from(orders).where(eq(orders.userId, userId));
  for (const order of seeded) {
    const timeline: { at: string; status: string; note: string }[] = order.timeline
      ? JSON.parse(order.timeline)
      : [];
    for (const ev of timeline.slice(1)) {
      await db.insert(notifications).values({
        userId,
        orderId: order.id,
        type: "order_status",
        title: ev.status === "shipped" ? "Order shipped" : "Order update",
        body: `${order.store} · ${order.ref} — ${ev.note}`,
        statusFrom: null,
        statusTo: ev.status,
        read: "no",
      });
    }
  }
}

// ---------------------------------------------------------------------------
// Orders
// ---------------------------------------------------------------------------
export async function listOrdersByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return rows[0];
}

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(orders).values(data);
  return data.ref;
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_purchase: "Awaiting purchase",
  purchased: "Purchased at store",
  in_warehouse: "At London warehouse",
  shipped: "Shipped by air freight",
  arrived: "Arrived in destination country",
  local_dispatch: "Out for local delivery",
  delivered: "Delivered",
};

/**
 * Advance an order to the next milestone, append the timeline event and
 * create an unread notification for the owner. Returns the new status.
 */
export async function advanceOrderStatus(
  orderId: number,
  status: string,
  note: string,
): Promise<string | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const current = await getOrderById(orderId);
  if (!current) return undefined;

  const pipeline = Object.keys(ORDER_STATUS_LABELS);
  const fromIdx = pipeline.indexOf(current.status);
  const toIdx = pipeline.indexOf(status);
  if (toIdx <= fromIdx) return current.status;

  const timeline = current.timeline ? JSON.parse(current.timeline) : [];
  timeline.push({ at: new Date().toISOString(), status, note });

  await db
    .update(orders)
    .set({ status, timeline: JSON.stringify(timeline) } as never)
    .where(eq(orders.id, orderId));

  await db.insert(notifications).values({
    userId: current.userId,
    orderId,
    type: "order_status",
    title: ORDER_STATUS_LABELS[status] || "Order update",
    body: `${current.store} · ${current.ref} — ${note}`,
    statusFrom: current.status,
    statusTo: status,
    read: "no",
  });

  // Notify the operations owner so real shipments can be followed up, and
  // dispatch an email when the customer has opted in to email updates.
  await notifyOwner({
    title: `Order ${current.ref} → ${ORDER_STATUS_LABELS[status] ?? status}`,
    content: `Customer #${current.userId} · ${current.store} — ${current.item}\n${note}\nMilestone: ${ORDER_STATUS_LABELS[current.status] ?? current.status} → ${ORDER_STATUS_LABELS[status] ?? status}`,
  });

  const customer = await db.select().from(users).where(eq(users.id, current.userId)).limit(1);
  const wantsEmail =
    (customer[0] as { emailNotifications?: string | null } | undefined)?.emailNotifications !== "no";
  if (wantsEmail && customer[0]?.email) {
    await sendOrderUpdateEmail(customer[0].email, current, status, note);
  }

  return status;
}

/**
 * Forward an order milestone update to the customer's inbox through the
 * platform's notification service (delivered by email for end customers).
 */
async function sendOrderUpdateEmail(
  email: string,
  order: { ref: string; store: string; destination: string | null },
  status: string,
  note: string,
): Promise<boolean> {
  try {
    const res = await fetch(
      (ENV.forgeApiUrl || "").replace(/\/+$/, "") + "/api/v1/notifications/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ENV.forgeApiKey ?? ""}`,
        },
        body: JSON.stringify({
          to: email,
          subject: `UK Shoppers Africa — Order ${order.ref}: ${ORDER_STATUS_LABELS[status] ?? status}`,
          body: `Hello ${email},\n\nYour order ${order.ref} (${order.store}) heading to ${order.destination ?? "East Africa"} has moved to: ${ORDER_STATUS_LABELS[status] ?? status}.\n\n${note}\n\nTrack it anytime in your portal: https://ukshoppersafrica.com/portal\n\n— The UK Shoppers Africa Team`,
        }),
      },
    );
    if (!res.ok) {
      console.warn(`[Email] Delivery failed for ${email} (${res.status})`);
      return false;
    }
    return true;
  } catch (err) {
    console.warn("[Email] Could not send order update:", err);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------
export async function listPaymentsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
}

export async function createPayment(data: InsertPayment) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(payments).values(data);
  return data.ref;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------
export async function listNotificationsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(50);
}

export async function countUnreadNotifications(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ c: sql<number>`count(*)` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, "no")));
  return Number(rows[0]?.c ?? 0);
}

export async function markNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) return;
  await db
    .update(notifications)
    .set({ read: "yes" } as never)
    .where(and(eq(notifications.userId, userId), eq(notifications.read, "no")));
}
