import config from '../../config'

let apiHost = config.apiHost

export default {
  getUserList: apiHost + '/usercenter/user/search',
  getVerifyCode: apiHost + '/usercenter/exposed/getVerifyCode',
  getInviteUser: apiHost + '/usercenter/user/inviteSearch',
  createUser: apiHost + '/usercenter/user/invite',
  getRole: apiHost + '/usercenter/user/getRoles',
  bindRole: apiHost + '/usercenter/user/bindUserRole'
}
