import api from './apiUrl'
import utils from '../../utils'
import { getDriverPerformance, getPerformance } from '../../../../mock/data/common'

let apiObj = {
  getUsers: function (req) {
    req.method = 'get'
    let queryUrl = api.getUsers
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getTrips: function (req) {
    req.method = 'get'
    let queryUrl = api.getTrips
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getCars: function (req) {
    req.method = 'get'
    let queryUrl = api.getCars
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getPerformance: function (req) {
    req.method = 'get'
    let queryUrl = api.getPerformance
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getRider: function (req) {
    req.method = 'get'
    let queryUrl = api.getRider
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getCards: function (req) {
    req.method = 'get'
    let queryUrl = api.getCards
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  },
  getDriverPerformance: function (req) {
    req.method = 'get'
    let queryUrl = api.getDriverPerformance
    utils.sendReq({
      queryUrl: queryUrl,
      req: req
    })
  }
}

export default apiObj
