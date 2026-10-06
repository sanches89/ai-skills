export function cancelOrder(order) {
  return { ...order, status: "cancelled" };
}
