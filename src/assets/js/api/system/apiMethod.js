import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addSystem: function (req) {
    req.method = 'post'
    let queryUrl = api.systemAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delSystem: function (req) {
    req.method = 'post'
    let queryUrl = api.systemDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getSystem: function (req) {
    req.method = 'post'
    let queryUrl = api.systemGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateSystem: function (req) {
    req.method = 'post'
    let queryUrl = api.systemUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
