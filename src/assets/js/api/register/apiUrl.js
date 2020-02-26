import config from '../../config'

let apiHost = config.apiHost

export default {
  register: apiHost + '/usercenter/exposed/regist',
  smsGet: apiHost + '/usercenter/exposed/getVerifyCode'
}
