const service = "/api/Dashboard/";

export const DashboardMobileRepository = {
  Requests: {
    get: service + "requestLogs",
  },
  mobileUser: {
    get: service + "MobileUser/getById",
    snapshot: service + "MobileUser/snapshot",
  },
};
