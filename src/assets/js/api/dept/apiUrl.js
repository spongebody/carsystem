import config from '../../config'

let apiHost = config.apiHost

export default {
  deptAdd: apiHost + '/usercenter/dept/add',
  deptGet: apiHost + '/usercenter/dept/search',
  deptDel: apiHost + '/usercenter/dept/del',
  deptUpdate: apiHost + '/usercenter/dept/update',
  pDeptGet: apiHost + '/usercenter/dept/getByCurrentUser',
  deptUserAdd: apiHost + '/usercenter/dept/addDeptUser'
}
