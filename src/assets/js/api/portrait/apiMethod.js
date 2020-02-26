import api from './apiUrl'
import utils from '../../utils'

let apiObj = {
  getUsers: function (req) {
    req.method = 'get'
    let queryUrl = api.getUsers
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
