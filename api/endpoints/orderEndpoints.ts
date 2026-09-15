export const orderEndpoints = {
  getOrders: "/orders/",
  placeOrder: "/orders/place/",
  getOrder: (orderId: string) => `/orders/${orderId}/`,
  cancelOrder: (orderId: string) => `/orders/${orderId}/cancel/`,
};