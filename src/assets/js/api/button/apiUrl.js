import config from '../../config'

let apiHost = config.apiHost

export default {
  buttonAdd: apiHost + '/usercenter/button/add',
  buttonGet: apiHost + '/usercenter/button/search',
  buttonDel: apiHost + '/usercenter/button/del',
  buttonUpdate: apiHost + '/usercenter/button/update'
}
