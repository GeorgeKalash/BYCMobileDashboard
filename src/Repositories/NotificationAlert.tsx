const service = "/api/NotificationAlert/";

export const NotificationAlertRepository = {
  NotificationTypes: {
    getAll: service + "NotificationTypes/getAllTypes",
    update: service + "NotificationTypes/updateType",
    set: service + "NotificationTypes/setTypes",
  },
};
