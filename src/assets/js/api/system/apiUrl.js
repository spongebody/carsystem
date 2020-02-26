import config from '../../config'

let apiHost = config.apiHost

export default {
  systemAdd: apiHost + '/usercenter/system/add',
  systemGet: apiHost + '/usercenter/system/search',
  systemDel: apiHost + '/usercenter/system/del',
  systemUpdate: apiHost + '/usercenter/system/update'
}
