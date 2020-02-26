/**
 * 此文件将通过docker volumes自动替换实际接口环境地址
 * add by dream.chen
 */

var apiConfig = {
  apiHost: '/userportrait',
  apiLoclHost: '/userportrait',
  // 公共服务
  publicServerHostList: {
    imgHost: 'https://sc-portal-1252602947.file.myqcloud.com',
    visualHost: 'http://sc.y2t.com',
    wxConnectHost: 'https://open.weixin.qq.com/connect',
    portalHost: 'http://172.28.31.129:8001/centerportal',
    userSsoHost: 'http://172.28.31.129:8003/centersso'
  }
}

if (typeof window !== 'undefined') {
  window['apiConfig'] = apiConfig
}
