/**
 * 此文件将通过docker volumes自动替换实际接口环境地址
 * add by dream.chen
 */

var apiConfig = {
  apiHost: '/centeruser',
  apiLoclHost: '/centeruser',
  // 公共服务
  publicServerHostList: {
    imgHost: 'https://sc-portal-1252602947.file.myqcloud.com',
    visualHost: 'http://sc.y2t.com',
    wxConnectHost: 'https://open.weixin.qq.com/connect',
    portalHost: 'http://sc.y2t.com/centerportal',
    userSsoHost: 'http://sc.y2t.com/centersso'
  }
}

if (typeof window !== 'undefined') {
  window['apiConfig'] = apiConfig
}
