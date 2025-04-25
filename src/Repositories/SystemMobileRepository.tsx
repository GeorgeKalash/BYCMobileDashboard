const service = '/api/System/'

export const SystemMobileRepository = {
  Default: {
    get: service + 'getAllDE',
    set: service + 'setPackMobileDE',
  },
  Languages: {
    get: service + 'Languages/getAllLanguages',
    update: service + 'Languages/updateLanguages',
  },
}