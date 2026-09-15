export const addressEndpoints = {
  getAddresses: "/address/",
  create: "/address/create/",
  getAddress: (addressId: string) => `/address/${addressId}/`,
  update: (addressId: string) => `/address/${addressId}/update/`,
  setDefault: (addressId: string) => `/address/${addressId}/set-default/`,
  delete: (addressId: string) => `/address/${addressId}/delete/`,
};