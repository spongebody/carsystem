import config from '../../config'

let apiHost = config.apiHost

export default {
  menuAdd: apiHost + '/usercenter/menu/add',
  menuGet: apiHost + '/usercenter/menu/search',
  menuDel: apiHost + '/usercenter/menu/del',
  menuUpdate: apiHost + '/usercenter/menu/update',
  menuGetBySystemId: apiHost + '/usercenter/menu/getBySystemId',
  menuGetByRoleId: apiHost + '/usercenter/menu/getByRoleId'
}
