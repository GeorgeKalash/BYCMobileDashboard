const service = "/api/NotificationAlert/";

export const NotificationAlertRepository = {
  NotificationTypes: {
    getAll: service + "NotificationTypes/getAllTypes",
    update: service + "NotificationTypes/updateType",
    set: service + "NotificationTypes/setTypes",
  },
  NotificationTemplate: {
    getAll: service + "NotificationTemplate/page",
    get: service + "NotificationTemplate/getAll",

    update: service + "NotificationTemplate/update",
    set: service + "NotificationTemplate/create",
    setPack: service + "NotificationTemplate/createPack",
    getPack: service + "NotificationTemplate/getPack",
    delete: service + "NotificationTemplate/delete",
  },
};
