import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addDept: function (req) {
    req.method = 'post'
    let queryUrl = api.deptAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delDept: function (req) {
    req.method = 'post'
    let queryUrl = api.deptDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getDept: function (req) {
    req.method = 'post'
    let queryUrl = api.deptGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateDept: function (req) {
    req.method = 'post'
    let queryUrl = api.deptUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getPDept: function (req) {
    req.method = 'get'
    let queryUrl = api.pDeptGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  addUserToDept: function (req) {
    req.method = 'post'
    let queryUrl = api.deptUserAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
