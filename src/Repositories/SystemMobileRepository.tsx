const service = '/api/System/'

export const SystemMobileRepository = {
  Default: {
    get: service + 'getAllMobileDE',
    set: service + 'setPackMobileDE',
  },
  Languages: {
    get: service + 'Languages/getAllLanguages',
    update: service + 'Languages/updateLanguage',
    getAllKeyValuePairs: service + 'Languages/getAllKeyValuePairs',
    getKeyValueByKey: service + 'Languages/getKeyValueByKey',
    setKeyValuePairs: service + 'Languages/setKeyValuePairs',
    updateKeyValuePairs: service + 'Languages/updateKeyValuePairs',
  },
}