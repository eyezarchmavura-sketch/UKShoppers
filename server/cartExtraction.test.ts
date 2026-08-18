import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const { mockInvokeLLM } = vi.hoisted(() => ({ mockInvokeLLM: vi.fn() }));

vi.mock("./_core/llm", () => ({ invokeLLM: mockInvokeLLM }));

import { appRouter } from "./routers";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 321,
    openId: "cart-extraction-test-user",
    email: "customer@example.com",
    name: "Cart Extraction Test",
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

const screenshot = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADElEQVR42mNk+M/wHwAF/gL+0QX1TgAAAABJRU5ErkJggg==";

describe("orders.analyzeCartScreenshot", () => {
  beforeEach(() => {
    mockInvokeLLM.mockReset();
    mockInvokeLLM.mockResolvedValue({
      choices: [{
        message: {
          content: JSON.stringify({
            retailerName: "ASOS",
            currency: "GBP",
            items: [{ name: "Nike Air Max 90", quantity: 1, unitPriceGbp: 95, lineTotalGbp: 95 }],
            subtotalGbp: 95,
            shippingGbp: 4.5,
            totalGbp: 99.5,
            confidence: "high",
            notes: "Price and total were clearly visible.",
          }),
        },
      }],
    });
  });

  it("extracts structured visible cart details with the configured vision model", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.orders.analyzeCartScreenshot({
      fileName: "asos-cart.png",
      contentType: "image/png",
      dataBase64: screenshot,
    })).resolves.toEqual(expect.objectContaining({
      retailerName: "ASOS",
      totalGbp: 99.5,
      items: [expect.objectContaining({ name: "Nike Air Max 90", lineTotalGbp: 95 })],
    }));

    expect(mockInvokeLLM).toHaveBeenCalledWith(expect.objectContaining({
      model: "gemini-3-flash-preview",
      outputSchema: expect.objectContaining({ name: "uk_cart_extraction", strict: true }),
    }));
  });

  it("rejects data URLs whose declared content type does not match the upload metadata", async () => {
    const caller = appRouter.createCaller(createContext());

    await expect(caller.orders.analyzeCartScreenshot({
      fileName: "cart.png",
      contentType: "image/jpeg",
      dataBase64: screenshot,
    })).rejects.toThrow(/valid PNG, JPG, or WEBP/i);

    expect(mockInvokeLLM).not.toHaveBeenCalled();
  });

  it("returns a safe manual-entry fallback when the vision response is malformed", async () => {
    mockInvokeLLM.mockResolvedValueOnce({ choices: [{ message: { content: "not valid JSON" } }] });
    const caller = appRouter.createCaller(createContext());

    await expect(caller.orders.analyzeCartScreenshot({
      fileName: "cart.png",
      contentType: "image/png",
      dataBase64: screenshot,
    })).rejects.toThrow(/could not read the cart screenshot automatically/i);
  });
});
