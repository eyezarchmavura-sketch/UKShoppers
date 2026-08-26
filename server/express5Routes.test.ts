import express from "express";
import { type AddressInfo } from "net";
import { type Server } from "http";
import { afterEach, describe, expect, it } from "vitest";

const openServers: Server[] = [];

async function withServer(app: ReturnType<typeof express>) {
  const server = await new Promise<Server>((resolve) => {
    const listeningServer = app.listen(0, () => resolve(listeningServer));
  });
  openServers.push(server);
  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
}

afterEach(async () => {
  await Promise.all(
    openServers.splice(0).map(
      (server) =>
        new Promise<void>((resolve, reject) =>
          server.close((error) => (error ? reject(error) : resolve())),
        ),
    ),
  );
});

describe("Express 5 named wildcard routing", () => {
  it("captures nested storage keys without accepting an unnamed wildcard", async () => {
    const app = express();
    app.get("/manus-storage/{*key}", (req, res) => {
      const key = req.params.key?.join("/") ?? null;
      res.json({ key });
    });

    const baseUrl = await withServer(app);
    const response = await fetch(`${baseUrl}/manus-storage/orders/2026/receipt.pdf`);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      key: "orders/2026/receipt.pdf",
    });
  });

  it("allows the SPA fallback to cover both root and nested customer routes", async () => {
    const app = express();
    app.use("/{*splat}", (req, res) => {
      res.json({ splat: req.params.splat ?? [] });
    });

    const baseUrl = await withServer(app);
    const [rootResponse, nestedResponse] = await Promise.all([
      fetch(`${baseUrl}/`),
      fetch(`${baseUrl}/portal/orders`),
    ]);

    await expect(rootResponse.json()).resolves.toEqual({ splat: [] });
    await expect(nestedResponse.json()).resolves.toEqual({
      splat: ["portal", "orders"],
    });
  });
});
