import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(user: Partial<AuthenticatedUser> = {}): TrpcContext {
  const userBase: AuthenticatedUser = {
    id: 9001,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user: { ...userBase, ...user },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("profile.update", () => {
  it("accepts emailNotifications yes/no and returns success", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      caller.profile.update({ emailNotifications: "no" }),
    ).resolves.toEqual({ success: true });
    await expect(
      caller.profile.update({ emailNotifications: "yes" }),
    ).resolves.toEqual({ success: true });
  });

  it("rejects values outside the yes/no enum", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(
      // @ts-expect-error intentionally invalid enum value
      caller.profile.update({ emailNotifications: "spam" }),
    ).rejects.toThrow();
  });
});

describe("notifications badge", () => {
  it("returns a numeric unread count for an authenticated user", async () => {
    const caller = appRouter.createCaller(createContext());
    const count = await caller.notifications.unreadCount();
    expect(typeof count).toBe("number");
    expect(count).toBeGreaterThanOrEqual(0);
  });

  it("marks all unread notifications as read", async () => {
    const caller = appRouter.createCaller(createContext());
    await caller.notifications.markRead();
    const count = await caller.notifications.unreadCount();
    expect(count).toBe(0);
  });
});

describe("production customer onboarding", () => {
  it("does not fabricate orders, payments, or notifications for a new account", async () => {
    const caller = appRouter.createCaller(
      createContext({ id: 99001, openId: "production-empty-account" }),
    );

    await expect(caller.orders.list()).resolves.toEqual([]);
    await expect(caller.payments.list()).resolves.toEqual([]);
    await expect(caller.notifications.unreadCount()).resolves.toBe(0);
  });
});

describe("admin.advanceStatus access control", () => {
  it("rejects non-admin users", async () => {
    const caller = appRouter.createCaller(createContext({ role: "user" }));
    await expect(
      caller.admin.advanceStatus({ orderId: 1, status: "purchased", note: "test" }),
    ).rejects.toThrow(/permission/);
  });
});

describe("operations queue access control", () => {
  it("rejects customers from the restricted cross-customer queue", async () => {
    const caller = appRouter.createCaller(createContext({ role: "user" }));
    await expect(caller.operations.queue({ limit: 10 })).rejects.toThrow(/Staff access/);
  });

  it("allows staff to read the restricted queue projection", async () => {
    const caller = appRouter.createCaller(createContext({ role: "staff" }));
    await expect(caller.operations.queue({ limit: 10 })).resolves.toEqual(expect.any(Array));
  });

  it("allows administrators to read the restricted queue projection", async () => {
    const caller = appRouter.createCaller(createContext({ role: "admin" }));
    await expect(caller.operations.queue({ limit: 10 })).resolves.toEqual(expect.any(Array));
  });
});
