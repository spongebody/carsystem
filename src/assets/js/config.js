
// 项目配置文件

let apiConfig = require('apiConfig') || {}

let sysInfo = {
  name: '用车管理系统 ',
  appId: apiConfig.appId || '',
  appSecret: apiConfig.appSecret || '',
  defaultModule: 0,
  unCheckPath: ['HomePage', 'setting/Setting', 'logline/Logline'], // 无需校验权限的路径（默认为一些系统自带组件）
  clientSecret: 123456,
  clientId: 'sinotrans-user-center'
}

// 公共服务
let defaultPublicServiceHostList = {
  imgHost: 'https://sc-portal-1252602947.file.myqcloud.com',
  visualHost: 'http://sc.y2t.com',
  wxConnectHost: 'https://open.weixin.qq.com/connect',
  portalHost: 'http://172.28.30.175:8001/centerportal',
  userSsoHost: 'http://172.28.31.129:8003/centersso'
}

let config = {
  sysInfo: sysInfo,
  hasBread: true, // 是否显示面包屑
  apiHost: apiConfig.apiHost || `/${buildConfig.publicPath}`,
  apiLoclHost: apiConfig.apiLoclHost || `/${buildConfig.publicPath}`,
  publicServerHostList: apiConfig.publicServerHostList || defaultPublicServiceHostList,
  isMock: true,
  axiosFormDataConfig: {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    timeout: 20000
  },
  axiosMultiFormData: {
    headers: {},
    timeout: 20000
  },
  axiosJsonConfig: {
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 20000
  }
}

export default config
