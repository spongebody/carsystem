import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addButton: function (req) {
    req.method = 'post'
    let queryUrl = api.buttonAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delButton: function (req) {
    req.method = 'post'
    let queryUrl = api.buttonDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getButton: function (req) {
    req.method = 'post'
    let queryUrl = api.buttonGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateButton: function (req) {
    req.method = 'post'
    let queryUrl = api.buttonUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
