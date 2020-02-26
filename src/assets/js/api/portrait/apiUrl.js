import config from '../../config'

let apiHost = config.apiHost

export default {
  // 客户列表获取
  getUsers: apiHost + '/getUsers'
}
