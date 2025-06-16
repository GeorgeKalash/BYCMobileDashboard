const service = "/api/Dashboard/";

export const DashboardMobileRepository = {
  Requests: {
    get: service + "requestLogs",
  },
  CarouselImages: {
    add: service + "Carousel/setPack",
    get: service + "Carousel/GetCarouselImages",
  },
};
