import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { mockCreateOrder, mockCreateOperationAlert, mockStoragePut } = vi.hoisted(() => ({
  mockCreateOrder: vi.fn(),
  mockCreateOperationAlert: vi.fn(),
  mockStoragePut: vi.fn(),
}));

vi.mock("./db", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./db")>();
  return { ...actual, createOrder: mockCreateOrder, createOperationAlert: mockCreateOperationAlert };
});

vi.mock("./storage", () => ({ storagePut: mockStoragePut }));

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
    mockCreateOperationAlert.mockReset();
    mockStoragePut.mockReset();
    mockCreateOrder.mockResolvedValue({ ref: "UKSA-INTAKE-001", id: 42 });
    mockStoragePut.mockResolvedValue({ key: "order-screenshots/9191/cart_abc.png", url: "/manus-storage/order-screenshots/9191/cart_abc.png" });
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
    ).resolves.toEqual({ ref: expect.stringMatching(/^UKS-/), screenshotUploaded: false });

    expect(mockCreateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 9191,
        deliveryAddress: "Kariakoo, Ilala, Dar es Salaam",
        amountGbp: "Pending staff review",
        requestType: "product_link",
        status: "pending_purchase",
      }),
    );
    expect(mockCreateOperationAlert).not.toHaveBeenCalled();
  });

  it("stores a cart screenshot and creates a shared staff alert", async () => {
    const caller = appRouter.createCaller(createContext());
    const screenshot = "data:image/png;base64," + "a".repeat(80);

    await expect(
      caller.orders.create({
        store: "Manual cart screenshot review",
        item: "ASOS basket — Manual cart screenshot review",
        destination: "Nairobi, Kenya",
        deliveryAddress: "Westlands, Nairobi",
        amountGbp: "Pending staff review",
        requestType: "cart_screenshot",
        screenshot: { fileName: "cart.png", contentType: "image/png", dataBase64: screenshot },
      }),
    ).resolves.toEqual({ ref: expect.stringMatching(/^UKS-/), screenshotUploaded: true });

    expect(mockStoragePut).toHaveBeenCalledWith(
      expect.stringContaining("order-screenshots/9191/"),
      expect.any(Buffer),
      "image/png",
    );
    expect(mockCreateOrder).toHaveBeenCalledWith(expect.objectContaining({
      requestType: "cart_screenshot",
      screenshotKey: "order-screenshots/9191/cart_abc.png",
      screenshotFileName: "cart.png",
    }));
    expect(mockCreateOperationAlert).toHaveBeenCalledWith(expect.objectContaining({
      kind: "cart_screenshot",
      orderId: 42,
      read: "no",
    }));
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

  it("rejects a screenshot request without screenshot data", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(
      caller.orders.create({
        store: "Manual cart screenshot review",
        item: "Cart review",
        destination: "Kampala, Uganda",
        deliveryAddress: "Kololo, Kampala",
        amountGbp: "Pending staff review",
        requestType: "cart_screenshot",
      }),
    ).rejects.toThrow(/screenshot is required/i);

    expect(mockCreateOrder).not.toHaveBeenCalled();
  });
});
