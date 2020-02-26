
import api from '../common/apiUrl'
import utils from '../../utils'

let common = {
  getAdminMenuInfo: function (req) {
    // 请求方式
    req.method = 'get'
    // req.headers = { Authorization: utils.getCookie('token') }
    // 获取用户信息和菜单权限
    let queryUrl = api.getAdminMenuInfo
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getUserMenuInfo: function (req) {
    // 请求方式
    req.method = 'get'
    req.headers = { Authorization: utils.getCookie('token') }
    // 获取用户信息和菜单权限
    let queryUrl = api.getUserMenuInfo
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getDriverMenuInfo: function (req) {
    // 请求方式
    req.method = 'get'
    req.headers = { Authorization: utils.getCookie('token') }
    // 获取用户信息和菜单权限
    let queryUrl = api.getDriverMenuInfo
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },

  getUserInfo: function (req) {
    // 请求方式
    req.method = 'post'
    // 获取用户信息和菜单权限
    let queryUrl = api.getUserInfo
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  upLoadImgList: function (req) {
    req.method = 'post'
    req.ctxType = 'file'
    let queryUrl = api.uploadImg
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  queryImgByCode: function (req) {
    req.method = 'get'
    req.ctxType = 'flie'
    let queryUrl = api.queryImgList
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  convertPDF: function (req) {
    req.method = 'post'
    req.ctxType = 'file'
    let queryUrl = api.queryPDFList
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  refreshToken: function (req) {
    req.method = 'get'
    let queryUrl = api.refreshToken
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getCompanyByUser: function (req) {
    req.method = 'get'
    let queryUrl = api.queryCompanyByUser
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getCompany: function (req) {
    req.method = 'post'
    let queryUrl = api.queryCompany
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getSystemByUser: function (req) {
    req.method = 'get'
    let queryUrl = api.querySystemByUser
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getSystem: function (req) {
    req.method = 'post'
    let queryUrl = api.querySystem
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getRole: function (req) {
    req.method = 'post'
    let queryUrl = api.queryRole
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getTpl: function (req) {
    req.method = 'get'
    let queryUrl = api.queryTpl
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default common
