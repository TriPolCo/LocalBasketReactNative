export const productEndpoints = {
  list: "/products/",
  create: "/products/create/",
  detail: (productId: string) => `/products/${productId}/`,
  update: (productId: string) => `/products/${productId}/update/`,
  delete: (productId: string) => `/products/${productId}/delete/`,
};