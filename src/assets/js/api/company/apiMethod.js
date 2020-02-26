import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addCompany: function (req) {
    req.method = 'post'
    let queryUrl = api.companyAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delCompany: function (req) {
    req.method = 'post'
    let queryUrl = api.companyDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getCompany: function (req) {
    req.method = 'post'
    let queryUrl = api.companyGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateCompany: function (req) {
    req.method = 'post'
    let queryUrl = api.companyUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getCompanyByCurrentUser: function (req) {
    req.method = 'get'
    let queryUrl = api.companyGetByCurrentUser
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getSystemByCurrentUser: function (req) {
    req.method = 'get'
    let queryUrl = api.systemGetByCurrentUser
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
