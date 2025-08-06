const service = "/api/Dashboard/";

export const DashboardMobileRepository = {
  Requests: {
    get: service + "requestLogs",
  },

  mobileUser: {
    get: service + "MobileUser/getById",
    snapshot: service + "MobileUser/snapshot",
  },
  OTP: {
    getPack: service + "Otp/OtpLimit/getAll",
    setPack: service + "Otp/OtpLimit/setPack",
    getCounter: service + "Otp/OtpCounter/getAll",
    getById: service + "Otp/OtpCounter/getById",
    reset: service + "Otp/OtpCounter/reset",
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
    SearchEngine: service + "MobileUser/SearchEngine/page",
  },
  TransactionLog: {
    getAll: service + "System/TransactionLog/getAll",
  },
  AdditionalInfo: {
    getAll: service + "AdditionalInfo/getAll",
  },
  ExtraInfo: {
    getAll: service + "ClientExtraInfo/getAll",
    update: service + "ClientExtraInfo/update",
    validate: service + "ClientExtraInfo/validate",
  },
  country: {
    getall: service + "System/Country/getAll",
  },
  city: {
    getall: service + "System/City/getAll",
  },
  TermsAndConditions: {
    page: service + "TermsAndConditions/page",
    delete: service + "TermsAndConditions/delete",
    setpack: service + "TermsAndConditions/setPack",
    getpack: service + "TermsAndConditions/getPack",
  },
};
