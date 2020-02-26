import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  getUserInfo: function (req) {
    // 注册
    req.method = 'get'
    let queryUrl = api.userInfoGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  editUserInfo: function (req) {
    // 注册
    req.method = 'post'
    let queryUrl = api.userInfoUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getSms: function (req) {
    // 获取验证码
    req.method = 'get'
    let queryUrl = api.smsGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getEmailCode: function (req) {
    // 获取邮箱验证码
    req.method = 'post'
    let queryUrl = api.emailCodeGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updatePassword: function (req) {
    // 获取邮箱验证码
    req.method = 'post'
    let queryUrl = api.passwordUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
