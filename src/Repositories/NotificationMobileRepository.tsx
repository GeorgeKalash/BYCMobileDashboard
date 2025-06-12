const service = "/api/Dashboard/";

export const NotificationMobileRepository = {
  Notification: {
    getAll: service + "pageNotificationAlerts",
    get: service + "getNotifications",
    create: service + "createNotification",
    createPack: service + "createBrodcast",
  },
};
