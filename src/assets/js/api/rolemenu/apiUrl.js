import config from '../../config'

let apiHost = config.apiHost

export default {
  roleMenuAdd: apiHost + '/usercenter/roleMenu/add',
  roleMenuGet: apiHost + '/usercenter/roleMenu/search',
  roleMenuDel: apiHost + '/usercenter/roleMenu/del',
  roleMenuUpdate: apiHost + '/usercenter/roleMenu/update'
}
