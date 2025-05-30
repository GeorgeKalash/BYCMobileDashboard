const service = "/api/NotificationAlert/";

export const NotificationAlertRepository = {
  NotificationTypes: {
    getAll: service + "NotificationTypes/getAllTypes",
    update: service + "NotificationTypes/updateType",
    set: service + "NotificationTypes/setTypes",
  },
  NotificationTemplate: {
    getAll: service + "NotificationTemplate/page",

    update: service + "NotificationTemplate/update",
    set: service + "NotificationTemplate/create",
    delete: service + "NotificationTemplate/delete",
  },
};
