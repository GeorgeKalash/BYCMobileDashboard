const service = '/api/PaymentGateway/PaymentBrands/'

export const PaymentGatewayRepository = {
  PaymentBrand: {
    getAll: service + 'getAllPaymentBrands',
    update: service + 'updatePaymentBrands',
  },
}