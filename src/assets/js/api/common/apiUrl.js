import config from '../../config'

let apiHost = config.apiHost
let publicServiceList = config.publicServerHostList

export default {
  // 获取用户信息和菜单权限
  // getMenuInfo: apiHost + '/func/menu',
  getAdminMenuInfo: apiHost + '/getAdminMenuInfo',
  getUserMenuInfo: apiHost + '/getUserMenuInfo',
  getDriverMenuInfo: apiHost + '/getDriverMenuInfo',
  getUserInfo: apiHost + '/getUserInfo',
  // getUserInfo: apiHost + '/centersso/user',
  refreshToken: apiHost + '/centersso/oauth/token',
  queryCompany: apiHost + '/usercenter/exposed/searchCompany',
  querySystem: apiHost + '/usercenter/exposed/searchSystem',
  queryRole: apiHost + '/usercenter/exposed/searchUserType',
  queryTpl: apiHost + '/usercenter/exposed/getTemplateBySysIdAndUserType',
  queryTrade: apiHost + '/usercenter/exposed/getBusinessType',
  queryAddress: apiHost + '/usercenter/exposed/getAddressByParentId',
  queryCompanyByUser: apiHost + '/usercenter/company/getCompanyByCurrentUser',
  querySystemByUser: apiHost + '/usercenter/system/getByCurrentUser',
  // 单个文件上传
  upLoadImgList: publicServiceList.imgHost + '/objectstorecloud/files/v2',
  // 上传图片
  // upLoadImgList: publicServiceList.imgHost + '/objectstorecloud/files/batch/v2',
  // 查询图片
  queryImgList: publicServiceList.imgHost + '/objectstorecloud/files/v2',
  //  获取PDF文件ID
  queryPDFList: 'http://172.30.254.157:8080' + '/transform/openoffice/server',
  // 图片上传
  uploadImg: apiHost + '/admin-uat/portalSiteAPI/images/picture'
}
