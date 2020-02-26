import config from '../../config'

let apiHost = config.apiHost

export default {
  userInfoGet: apiHost + '/usercenter/userParent/getCurrentUser',
  userInfoUpdate: apiHost + '/usercenter/userParent/update',
  smsGet: apiHost + '/usercenter/exposed/getVerifyCode',
  emailCodeGet: apiHost + '/usercenter/exposed/sendEmailVerifyCode',
  passwordUpdate: apiHost + '/usercenter/userParent/updatePwd'
}
