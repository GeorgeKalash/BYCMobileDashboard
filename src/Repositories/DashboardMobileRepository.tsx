const service = "/api/Dashboard/";

export const DashboardMobileRepository = {
  Requests: {
    get: service + "requestLogs",
  },
  FAQ: {
    page: service + "FAQ/page",
    getById: service + "FAQ/getById",
    add: service + "FAQ/add",
    update: service + "FAQ/update",
    delete: service + "FAQ/delete",
  },
};
