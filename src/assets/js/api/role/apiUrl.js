import config from '../../config'

let apiHost = config.apiHost

export default {
  roleAdd: apiHost + '/usercenter/role/add',
  roleGet: apiHost + '/usercenter/role/search',
  roleDel: apiHost + '/usercenter/role/del',
  roleUpdate: apiHost + '/usercenter/role/update',
  roleAuthorize: apiHost + '/usercenter/role/authorize'
}
