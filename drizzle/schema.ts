import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "staff", "admin"]).default("user").notNull(),
  /** Customer preference: receive order milestone updates by email. */
  emailNotifications: varchar("emailNotifications", { length: 8 }).default("yes").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Customer orders. Each order belongs to a user and moves through a
 * milestone pipeline: pending_purchase → purchased → in_warehouse →
 * shipped → arrived → local_dispatch → delivered.
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  /** User-facing reference, e.g. UKS-84201 */
  ref: varchar("ref", { length: 32 }).notNull().unique(),
  userId: int("userId").notNull(),
  store: varchar("store", { length: 128 }).notNull(),
  item: varchar("item", { length: 512 }).notNull(),
  destination: varchar("destination", { length: 128 }).notNull(),
  /** Customer-provided address, intentionally excluded from the staff queue list projection. */
  deliveryAddress: varchar("deliveryAddress", { length: 512 }),
  /** How the customer supplied the shopping request. */
  requestType: mysqlEnum("requestType", ["product_link", "cart_screenshot"]).default("product_link").notNull(),
  /** Storage object key for a customer-uploaded cart screenshot. */
  screenshotKey: varchar("screenshotKey", { length: 256 }),
  screenshotFileName: varchar("screenshotFileName", { length: 256 }),
  amountGbp: varchar("amountGbp", { length: 32 }).notNull(),
  amountLocal: varchar("amountLocal", { length: 64 }),
  currencyCode: varchar("currencyCode", { length: 8 }).default("GBP"),
  weightKg: varchar("weightKg", { length: 16 }),
  status: mysqlEnum("status", [
    "pending_purchase",
    "purchased",
    "in_warehouse",
    "shipped",
    "arrived",
    "local_dispatch",
    "delivered",
  ]).default("pending_purchase").notNull(),
  /** Milestone events as compact JSON, appended on each status change. */
  timeline: text("timeline"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Payment transactions. Each transaction belongs to a user and records the
 * gateway, currency, amount, and settlement status.
 */
export const payments = mysqlTable("payments", {
  id: int("id").autoincrement().primaryKey(),
  ref: varchar("ref", { length: 64 }).notNull().unique(),
  userId: int("userId").notNull(),
  orderId: int("orderId"),
  gateway: varchar("gateway", { length: 64 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "failed"]).default("pending").notNull(),
  amount: varchar("amount", { length: 32 }).notNull(),
  currencyCode: varchar("currencyCode", { length: 8 }).default("GBP").notNull(),
  destination: varchar("destination", { length: 128 }),
  /** Provider transaction ID is only saved after server-side verification. */
  providerTransactionId: varchar("providerTransactionId", { length: 128 }),
  /** UTC timestamp at which a verified provider event settled this payment. */
  settledAt: timestamp("settledAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Immutable audit trail for signed provider webhooks. providerEventId is unique
 * per gateway so retries cannot settle a payment twice.
 */
export const paymentEvents = mysqlTable("payment_events", {
  id: int("id").autoincrement().primaryKey(),
  paymentId: int("paymentId"),
  provider: varchar("provider", { length: 64 }).notNull(),
  providerEventId: varchar("providerEventId", { length: 160 }).notNull().unique(),
  eventType: varchar("eventType", { length: 96 }).notNull(),
  verificationStatus: mysqlEnum("verificationStatus", ["verified", "rejected"]).notNull(),
  payload: text("payload"),
  receivedAt: timestamp("receivedAt").defaultNow().notNull(),
});

export type PaymentEvent = typeof paymentEvents.$inferSelect;
export type InsertPaymentEvent = typeof paymentEvents.$inferInsert;

/**
 * Order milestone notifications for Queen's badge and email updates.
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  orderId: int("orderId").notNull(),
  type: varchar("type", { length: 64 }).default("order_status").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  body: varchar("body", { length: 1024 }).notNull(),
  statusFrom: varchar("statusFrom", { length: 32 }),
  statusTo: varchar("statusTo", { length: 32 }),
  read: mysqlEnum("read", ["no", "yes"]).default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

/** Staff-facing alerts that are shared across approved operations users. */
export const operationAlerts = mysqlTable("operation_alerts", {
  id: int("id").autoincrement().primaryKey(),
  kind: varchar("kind", { length: 64 }).default("cart_screenshot").notNull(),
  orderId: int("orderId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  body: varchar("body", { length: 1024 }).notNull(),
  read: mysqlEnum("read", ["no", "yes"]).default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type OperationAlert = typeof operationAlerts.$inferSelect;
export type InsertOperationAlert = typeof operationAlerts.$inferInsert;
