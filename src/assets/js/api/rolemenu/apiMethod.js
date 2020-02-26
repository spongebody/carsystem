import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addRoleMenu: function (req) {
    req.method = 'post'
    let queryUrl = api.roleMenuAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delRoleMenu: function (req) {
    req.method = 'post'
    let queryUrl = api.roleMenuDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getRoleMenu: function (req) {
    req.method = 'post'
    let queryUrl = api.roleMenuGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateRoleMenu: function (req) {
    req.method = 'post'
    let queryUrl = api.roleMenuUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
