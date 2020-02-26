import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addRole: function (req) {
    req.method = 'post'
    let queryUrl = api.roleAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delRole: function (req) {
    req.method = 'post'
    let queryUrl = api.roleDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getRole: function (req) {
    req.method = 'post'
    let queryUrl = api.roleGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateRole: function (req) {
    req.method = 'post'
    let queryUrl = api.roleUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  authorizeRole: function (req) {
    req.method = 'post'
    let queryUrl = api.roleAuthorize
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
