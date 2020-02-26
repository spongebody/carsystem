import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addEnterprise: function (req) {
    req.method = 'post'
    let queryUrl = api.EnterpriseAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delEnterprise: function (req) {
    req.method = 'post'
    let queryUrl = api.EnterpriseDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getEnterprise: function (req) {
    req.method = 'post'
    let queryUrl = api.EnterpriseGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateEnterprise: function (req) {
    req.method = 'post'
    let queryUrl = api.EnterpriseUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  createTpl: function (req) {
    req.method = 'post'
    let queryUrl = api.enterpriseTplCreate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  moveRecord: function (req) {
    req.method = 'post'
    let queryUrl = api.enterpriseTplMove
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateTpl: function (req) {
    req.method = 'post'
    let queryUrl = api.enterpriseTplUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  deleteTpl: function (req) {
    req.method = 'post'
    let queryUrl = api.enterpriseTplDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  submitAuth: function (req) {
    req.method = 'post'
    let queryUrl = api.enterpriseAuthSubmit
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  queryAuth: function (req) {
    req.method = 'post'
    let queryUrl = api.enterpriseAuthQuery
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  authEnterprise: function (req) {
    req.method = 'post'
    let queryUrl = api.enterpriseAuthConfirm
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
