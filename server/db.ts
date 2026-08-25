import { and, desc, eq, gt, isNotNull, isNull, like, or, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertNotification,
  InsertOrder,
  InsertPayment,
  InsertPaymentEvent,
  InsertOperationAlert,
  InsertSeasonalOffer,
  InsertStaffInvite,
  notifications,
  operationAlerts,
  orders,
  paymentEvents,
  payments,
  seasonalOffers,
  staffInvites,
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

export type OperationsQueueInput = {
  status?: string;
  search?: string;
  limit?: number;
};

/** A restricted, staff-facing queue projection with server-side search/filtering. */
export async function listOperationsOrders(input: OperationsQueueInput = {}) {
  const db = await getDb();
  if (!db) return [];

  const filters = [];
  if (input.status && (orders.status.enumValues as readonly string[]).includes(input.status)) {
    filters.push(eq(orders.status, input.status as (typeof orders.status.enumValues)[number]));
  }
  if (input.search?.trim()) {
    const needle = `%${input.search.trim().replace(/[%_]/g, "\\$&")}%`;
    filters.push(
      or(
        like(orders.ref, needle),
        like(orders.store, needle),
        like(orders.item, needle),
        like(orders.destination, needle),
        like(users.name, needle),
      ),
    );
  }

  const base = db
    .select({
      id: orders.id,
      ref: orders.ref,
      customerName: users.name,
      destination: orders.destination,
      store: orders.store,
      item: orders.item,
      amountGbp: orders.amountGbp,
      requestType: orders.requestType,
      screenshotKey: orders.screenshotKey,
      screenshotFileName: orders.screenshotFileName,
      status: orders.status,
      timeline: orders.timeline,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .innerJoin(users, eq(orders.userId, users.id));

  const filtered = filters.length ? base.where(and(...filters)) : base;
  return filtered.orderBy(desc(orders.createdAt)).limit(Math.min(Math.max(input.limit ?? 50, 1), 100));
}

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(data);
  return { ref: data.ref, id: Number((result as unknown as { insertId?: number }).insertId ?? 0) };
}

export async function createOperationAlert(data: InsertOperationAlert) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(operationAlerts).values(data);
}

export async function listUnreadOperationAlerts(limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(operationAlerts)
    .where(eq(operationAlerts.read, "no"))
    .orderBy(desc(operationAlerts.createdAt))
    .limit(Math.min(Math.max(limit, 1), 50));
}

export async function countUnreadOperationAlerts() {
  const db = await getDb();
  if (!db) return 0;
  const rows = await db
    .select({ c: sql<number>`count(*)` })
    .from(operationAlerts)
    .where(eq(operationAlerts.read, "no"));
  return Number(rows[0]?.c ?? 0);
}

export async function markOperationAlertsRead() {
  const db = await getDb();
  if (!db) return;
  await db.update(operationAlerts).set({ read: "yes" } as never).where(eq(operationAlerts.read, "no"));
}

// ---------------------------------------------------------------------------
// Seasonal offers
// ---------------------------------------------------------------------------

export async function listPublicSeasonalOffers() {
  const db = await getDb();
  if (!db) return [];
  const now = new Date();
  return db
    .select()
    .from(seasonalOffers)
    .where(and(eq(seasonalOffers.status, "published"), or(isNull(seasonalOffers.validUntil), gt(seasonalOffers.validUntil, now))))
    .orderBy(desc(seasonalOffers.createdAt))
    .limit(12);
}

export async function listSeasonalOffersForOperations() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(seasonalOffers).orderBy(desc(seasonalOffers.updatedAt)).limit(100);
}

export async function createSeasonalOffer(data: InsertSeasonalOffer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(seasonalOffers).values(data);
  const id = Number((result as unknown as { insertId?: number }).insertId ?? 0);
  const rows = await db.select().from(seasonalOffers).where(eq(seasonalOffers.id, id)).limit(1);
  return rows[0];
}

export async function updateSeasonalOffer(id: number, data: Partial<Pick<InsertSeasonalOffer, "storeName" | "title" | "details" | "offerUrl" | "couponCode" | "validFrom" | "validUntil" | "status">>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(seasonalOffers).set(data).where(eq(seasonalOffers.id, id));
  const rows = await db.select().from(seasonalOffers).where(eq(seasonalOffers.id, id)).limit(1);
  return rows[0];
}

export async function deleteSeasonalOffer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(seasonalOffers).where(eq(seasonalOffers.id, id));
}

// ---------------------------------------------------------------------------
// External staff invitations
// ---------------------------------------------------------------------------

export async function createStaffInvite(data: InsertStaffInvite) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(staffInvites).values(data);
  const id = Number((result as unknown as { insertId?: number }).insertId ?? 0);
  const rows = await db.select().from(staffInvites).where(eq(staffInvites.id, id)).limit(1);
  return rows[0];
}

export async function listStaffInvites() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(staffInvites).orderBy(desc(staffInvites.createdAt)).limit(50);
}

export async function getActiveStaffInviteByTokenHash(tokenHash: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(staffInvites)
    .where(and(eq(staffInvites.tokenHash, tokenHash), isNull(staffInvites.revokedAt), gt(staffInvites.expiresAt, new Date())))
    .limit(1);
  return rows[0];
}

export async function getActiveStaffInviteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db
    .select()
    .from(staffInvites)
    .where(and(eq(staffInvites.id, id), isNull(staffInvites.revokedAt), gt(staffInvites.expiresAt, new Date())))
    .limit(1);
  return rows[0];
}

export async function markStaffInviteAccepted(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(staffInvites).set({ acceptedAt: new Date() } as never).where(eq(staffInvites.id, id));
}

export async function revokeStaffInvite(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(staffInvites)
    .set({ revokedAt: new Date() } as never)
    .where(and(eq(staffInvites.id, id), isNull(staffInvites.revokedAt)));
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
 * Staff may advance an order exactly one milestone at a time. Final delivery
 * confirmation remains administrator-only because it is the terminal state.
 */
export async function advanceOrderStatusForOperations(
  orderId: number,
  status: string,
  note: string,
  actorRole: "staff" | "admin",
): Promise<string | undefined> {
  const current = await getOrderById(orderId);
  if (!current) return undefined;

  const pipeline = Object.keys(ORDER_STATUS_LABELS);
  const fromIndex = pipeline.indexOf(current.status);
  const toIndex = pipeline.indexOf(status);
  if (toIndex !== fromIndex + 1) {
    throw new Error("Orders can only advance to their next milestone in the operations queue.");
  }
  if (actorRole === "staff" && status === "delivered") {
    throw new Error("Only an administrator can record final delivery confirmation.");
  }
  return advanceOrderStatus(orderId, status, note);
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

export async function getPaymentByRef(ref: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(payments).where(eq(payments.ref, ref)).limit(1);
  return rows[0];
}

/**
 * Stores an already verified gateway event. The database unique constraint on
 * providerEventId is the idempotency barrier for provider retry deliveries.
 */
export async function recordVerifiedPaymentEvent(data: InsertPaymentEvent): Promise<boolean> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(paymentEvents).values(data);
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message.toLowerCase() : "";
    if (message.includes("duplicate") || message.includes("unique")) return false;
    throw error;
  }
}

/**
 * Performs a monotonic transition from pending to paid only after the caller
 * has verified the event signature and independently reconciled the gateway.
 */
export async function settleVerifiedPayment(input: {
  ref: string;
  provider: string;
  providerTransactionId: string;
}): Promise<"settled" | "already_settled" | "not_found" | "provider_mismatch"> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const payment = await getPaymentByRef(input.ref);
  if (!payment) return "not_found";
  if (payment.gateway.toLowerCase() !== input.provider.toLowerCase()) return "provider_mismatch";
  if (payment.status === "paid") return "already_settled";

  await db
    .update(payments)
    .set({ status: "paid", providerTransactionId: input.providerTransactionId, settledAt: new Date() } as never)
    .where(and(eq(payments.id, payment.id), eq(payments.status, "pending")));
  return "settled";
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
