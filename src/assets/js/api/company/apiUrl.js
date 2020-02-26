import config from '../../config'

let apiHost = config.apiHost

export default {
  companyAdd: apiHost + '/usercenter/company/add',
  companyGet: apiHost + '/usercenter/company/search',
  companyDel: apiHost + '/usercenter/company/del',
  companyUpdate: apiHost + '/usercenter/company/update',
  companyGetByCurrentUser: apiHost + '/usercenter/company/getCompanyByCurrentUser',
  systemGetByCurrentUser: apiHost + '/usercenter/system/getByCurrentUser'
}
