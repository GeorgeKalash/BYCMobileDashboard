const service = "/api/Dashboard/";

export const DashboardMobileRepository = {
  Requests: {
    get: service + "requestLogs",
  },
  OTP: {
    getPack: service + "Otp/OtpLimit/getAll",
    setPack: service + "Otp/OtpLimit/setPack",
  },
};
