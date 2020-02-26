import Vue from 'vue'
import App from './App'
import axios from 'axios'
import router from './router/manage'
import utils from '../../assets/js/utils'
import ElementUI from 'element-ui'
import store from '../../store/index'
import plugins from '../../assets/js/plugins'
import i18n from '../../assets/js/lang'
import VueCodemirror from 'vue-codemirror'
import VueQuillEditor from 'vue-quill-editor'
import directives from '../../assets/js/directives'
import MavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import config from '../../assets/js/config'
import AsyncComputed from 'vue-async-computed'
import echarts from 'echarts'

if (config.isMock) {
  let mockPlugin = require('../../mock/index')
  Vue.use(mockPlugin)
}

let i18nObj = i18n.i18n

Vue.use(ElementUI, {
  i18n: (key, value) => i18nObj.t(key, value),
  size: 'mini'
})
Vue.use(plugins)
Vue.use(VueCodemirror)
Vue.use(VueQuillEditor)
Vue.use(MavonEditor)
Vue.use(AsyncComputed)

/* 使用axios插件 */
axios.defaults.withCredentials = true // 开启全局携带cookie信息
Vue.prototype.$echarts = echarts

// 注册全局指令
Object.keys(directives).forEach(function (item) {
  Vue.directive(item, directives[item])
})

// 进入路由前的处理
router.beforeEach((to, from, next) => {
  let title = to.meta.title

  if (to.meta.title) {
    utils.setPageTitle(title)
  } else {
    utils.setPageTitle('')
  }
  // 获取参数并设置token
  /*  let token = utils.getQueryParams('token')
  let tokenExpire = utils.getQueryParams('token_expire')
  let refreshToken = utils.getQueryParams('refresh_token')
  if (token) {
    // 缓存token
    utils.setCookie('token', token, {
      path: `/${buildConfig.publicPath}`
    })
    // 缓存token过期时间
    utils.setCookie('tokenExpire', tokenExpire, {
      path: `/${buildConfig.publicPath}`
    })
    // 缓存refreshtoken
    utils.setCookie('refreshToken', refreshToken, {
      path: `/${buildConfig.publicPath}`
    })
    window.location.href = window.location.origin + window.location.pathname
  } */
  next()
})

const manage = new Vue({
  router,
  store,
  i18n: i18nObj,
  axios,
  el: '#app',
  template: '<App/>',
  components: { App }
})

export default manage
