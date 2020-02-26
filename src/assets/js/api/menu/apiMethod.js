import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addMenu: function (req) {
    req.method = 'post'
    let queryUrl = api.menuAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delMenu: function (req) {
    req.method = 'post'
    let queryUrl = api.menuDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getMenu: function (req) {
    req.method = 'post'
    let queryUrl = api.menuGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateMenu: function (req) {
    req.method = 'post'
    let queryUrl = api.menuUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getMenuBySystemId: function (req) {
    req.method = 'get'
    let queryUrl = api.menuGetBySystemId
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getMenuByRoleId: function (req) {
    req.method = 'get'
    let queryUrl = api.menuGetByRoleId
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
