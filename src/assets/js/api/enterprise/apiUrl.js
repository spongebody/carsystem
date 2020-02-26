import config from '../../config'

let apiHost = config.apiHost

export default {
  enterpriseAdd: apiHost + '/usercenter/enterprise/add',
  enterpriseGet: apiHost + '/usercenter/enterprise/search',
  enterpriseDel: apiHost + '/usercenter/enterprise/del',
  enterpriseUpdate: apiHost + '/usercenter/enterprise/update',
  enterpriseTplCreate: apiHost + '/usercenter/enterpriseAuthTemplate/add',
  enterpriseTplMove: apiHost + '/usercenter/enterpriseAuthTemplate/switchSort',
  enterpriseTplUpdate: apiHost + '/usercenter/enterpriseAuthTemplate/update',
  enterpriseTplDel: apiHost + '/usercenter/enterpriseAuthTemplate/del',
  enterpriseAuthSubmit: apiHost + '/usercenter/exposed/addEnterprise',
  enterpriseAuthQuery: apiHost + '/usercenter/enterpriseSysAuth/search',
  enterpriseAuthConfirm: apiHost + '/usercenter/enterpriseSysAuth/audit'
}
