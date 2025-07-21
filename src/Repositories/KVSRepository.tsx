const service = "/api/kvs/";

export const KVSRepository = {
  DashboardKVS: {
    getDashboardKVS: service + "Dashboard/getAllKVS",
  },
  KVS: {
    getKVS: service + "getAllKVS",
  },
};
