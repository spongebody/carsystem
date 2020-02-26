import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  getUserList: function (req) {
    // 获取用户列表
    req.method = 'post'
    let queryUrl = api.getUserList
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getVerifyCode: function (req) {
    req.method = 'get'
    let queryUrl = api.getVerifyCode
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getInviteUser: function (req) {
    req.method = 'get'
    let queryUrl = api.getInviteUser
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  inviteUser: function (req) {
    req.method = 'post'
    let queryUrl = api.createUser
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getRole: function (req) {
    req.method = 'post'
    let queryUrl = api.getRole
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  bindRole: function (req) {
    req.method = 'post'
    let queryUrl = api.bindRole
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
