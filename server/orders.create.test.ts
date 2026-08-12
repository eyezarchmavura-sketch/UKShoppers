import { describe, expect, it, beforeEach, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { mockCreateOrder } = vi.hoisted(() => ({
  mockCreateOrder: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, createOrder: mockCreateOrder };
});

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 9191,
    openId: "purchase-request-test-user",
    email: "test@example.com",
    name: "Purchase Request Test",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as unknown as TrpcContext["res"],
  };
}

describe("orders.create purchase-request intake", () => {
  beforeEach(() => {
    mockCreateOrder.mockReset();
    mockCreateOrder.mockResolvedValue("UKSA-INTAKE-001");
  });

  it("keeps the delivery address with the authenticated customer request and marks it pending staff review", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.orders.create({
        store: "amazon.co.uk",
        item: "Nike Air Max 90, UK size 9 — https://www.amazon.co.uk/dp/example",
        destination: "Dar es Salaam, Tanzania",
        deliveryAddress: "Kariakoo, Ilala, Dar es Salaam",
        amountGbp: "Pending staff review",
        currencyCode: "GBP",
      }),
    ).resolves.toEqual({ ref: expect.stringMatching(/^UKS-\d{5}$/) });

    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 9191,
        deliveryAddress: "Kariakoo, Ilala, Dar es Salaam",
        amountGbp: "Pending staff review",
        status: "pending_purchase",
      }),
    );
  });

  it("rejects an incomplete delivery address before an order can be created", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.orders.create({
        store: "amazon.co.uk",
        item: "Example item",
        destination: "Dar es Salaam, Tanzania",
        deliveryAddress: "abc",
        amountGbp: "Pending staff review",
      }),
    ).rejects.toThrow();

    expect(mockCreateOrder).not.toHaveBeenCalled();
  });
});
