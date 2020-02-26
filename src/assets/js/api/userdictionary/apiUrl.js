import config from '../../config'

let apiHost = config.apiHost

export default {
  userDictAdd: apiHost + '/usercenter/baseUserType/add',
  userDictGet: apiHost + '/usercenter/baseUserType/search',
  userDictDel: apiHost + '/usercenter/baseUserType/del',
  userDictUpdate: apiHost + '/usercenter/baseUserType/update'
}
