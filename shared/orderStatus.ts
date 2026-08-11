/**
 * Client-safe order milestone pipeline shared across portal pages.
 * Kept in sync with server/db.ts ORDER_STATUS_LABELS — do not import
 * anything from server/* or drizzle in client code.
 */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending_purchase: "Awaiting purchase",
  purchased: "Purchased at store",
  in_warehouse: "At London warehouse",
  shipped: "Shipped by air freight",
  arrived: "Arrived in destination country",
  local_dispatch: "Out for local delivery",
  delivered: "Delivered",
};

export const ORDER_STATUS_PIPELINE = Object.keys(ORDER_STATUS_LABELS);
