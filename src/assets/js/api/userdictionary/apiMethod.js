import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  addUserDict: function (req) {
    req.method = 'post'
    let queryUrl = api.userDictAdd
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  delUserDict: function (req) {
    req.method = 'post'
    let queryUrl = api.userDictDel
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  updateUserDict: function (req) {
    req.method = 'post'
    let queryUrl = api.userDictUpdate
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getUserDict: function (req) {
    req.method = 'post'
    let queryUrl = api.userDictGet
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
