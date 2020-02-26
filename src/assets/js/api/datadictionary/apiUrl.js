import config from '../../config'

let apiHost = config.apiHost

export default {
  dataDictAdd: apiHost + '/usercenter/baseDict/add',
  dataDictGet: apiHost + '/usercenter/baseDict/search',
  dataDictDel: apiHost + '/usercenter/baseDict/del',
  dataDictUpdate: apiHost + '/usercenter/baseDict/update',
  dataDictGetPDict: apiHost + '/usercenter//baseDict/head'
}
