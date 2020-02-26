import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addDataDict: function (req) {
    req.method = 'post'
    let queryUrl = api.dataDictAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delDataDict: function (req) {
    req.method = 'post'
    let queryUrl = api.dataDictDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getDataDict: function (req) {
    req.method = 'post'
    let queryUrl = api.dataDictGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateDataDict: function (req) {
    req.method = 'post'
    let queryUrl = api.dataDictUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getDataPDict: function (req) {
    req.method = 'get'
    let queryUrl = api.dataDictGetPDict
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
