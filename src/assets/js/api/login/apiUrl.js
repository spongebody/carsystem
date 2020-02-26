import config from '../../config'

let apiHost = config.apiHost

export default {
  login: apiHost + '/centersso/login',
  codeImgGet: apiHost + '/centersso/system/getVerifyCode',
  tokenGet: apiHost + '/centersso/oauth/token',
  wxLoginLongQuery: apiHost + '/connect/l/qrconnect',
  wxGetQrcode: apiHost + '/centersso/system/getQrCode'
}
