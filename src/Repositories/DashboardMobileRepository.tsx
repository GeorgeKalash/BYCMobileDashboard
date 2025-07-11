const service = "/api/Dashboard/";

export const DashboardMobileRepository = {
  Requests: {
    get: service + "requestLogs",
  },
  OTP: {
    getPack: service + "Otp/OtpLimit/getAll",
    setPack: service + "Otp/OtpLimit/setPack",
  },
  FAQ: {
    page: service + "FAQ/page",
    getById: service + "FAQ/getById",
    add: service + "FAQ/add",
    update: service + "FAQ/update",
    delete: service + "FAQ/delete",
    setpack: service + "FAQ/setPack",
    getpack: service + "FAQ/getPack",
  },
  CarouselImages: {
    add: service + "Carousel/setPack",
    get: service + "Carousel/GetCarouselImages",
  },
  MobileUser: {
    page: service + "MobileUser/page",
    getById: service + "MobileUser/getById",
    changeUserStatus: service + "MobileUser/changeUserStatus",
  },
  TransactionLog: {
    getAll: service + "System/TransactionLog/getAll",
  },
};
