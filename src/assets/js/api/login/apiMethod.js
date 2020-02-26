import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  toLogin: function (req) {
    // 注册
    req.method = 'post'
    req.ctxType = 'formdata'
    let queryUrl = api.login
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getCodeImg: function (req) {
    // 获取验证码
    req.method = 'post'
    let queryUrl = api.codeImgGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getToken: function (req) {
    req.method = 'get'
    let queryUrl = api.tokenGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  wxLongQuery: function (req) {
    req.method = 'get'
    let queryUrl = api.wxLoginLongQuery
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  wxQueryQrcode: function (req) {
    req.method = 'get'
    let queryUrl = api.wxGetQrcode
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
