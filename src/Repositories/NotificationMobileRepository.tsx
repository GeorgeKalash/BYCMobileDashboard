const service = "/api/NotificationAlert/";

export const NotificationMobileRepository = {
  Notification: {
    getAll: service + "getAllNotifications",
    get: service + "getNotifications",
    create: service + "createNotification",
    createPack: service + "createPackNotification",
  },
};
