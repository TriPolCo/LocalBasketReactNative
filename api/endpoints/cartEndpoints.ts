export const cartEndpoints = {
  getCart: "/cart/",
  add: "/cart/add/",
  updateQuantity: (itemId: string) => `/cart/items/${itemId}/quantity/`,
  increaseQuantity: (itemId: string) => `/cart/items/${itemId}/increase/`,
  decreaseQuantity: (itemId: string) => `/cart/items/${itemId}/decrease/`,
  removeItem: (itemId: string) => `/cart/items/${itemId}/`,
  clear: "/cart/clear/",
};