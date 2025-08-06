const service = "/api/Dashboard/PaymentGateway/";

export const PaymentGatewayRepository = {
  Transactions: {
    GetAll: service + "getAllTransactions",
  },
  PaymentBrand: {
    getAll: service + "PaymentBrands/getAllPaymentBrands",
    update: service + "PaymentBrands/updatePaymentBrands",
  },
  PaymentSupport: {
    getAll: service + "PaymentSupport/getAll",
    setPack: service + "PaymentSupport/setPack",
  },
  status: {
    getAll: service + "status/getAll",
  },
};
