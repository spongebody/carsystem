import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  toRegister: function (req) {
    // 注册
    req.method = 'post'
    let queryUrl = api.register
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
  }
}

export default apiObj
