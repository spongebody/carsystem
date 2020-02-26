import config from '../../config'
import { getDriverPerformance, getPerformance } from '../../../../mock/data/common'

let apiHost = config.apiHost

export default {
  // 客户列表获取
  getUsers: apiHost + '/getUsers',
  getTrips: apiHost + '/getTrips',
  getCars: apiHost + '/getCars',
  getPerformance: apiHost + '/getPerformance',
  getRider: apiHost + '/getRider',
  getCards: apiHost + '/getCards',
  getDriverPerformance: apiHost + '/getDriverPerformance'
}
