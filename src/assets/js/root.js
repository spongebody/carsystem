import api from './api/common/apiMethod'
import config from './config'
import utils from './utils'

export default {
  name: 'Root',
  data () {
    return {}
  },
  created: function () {
    let self = this
    self.getMenuInfo()
    self.getUserInfo()
    self.getAppLang()
    self.getObjConfig()
    // self.initRefreshToken()
  },
  watch: {
    '$route': function (to, from) {
      // let self = this
      // 检测路由更新后，获取路由meta属性判断页面是否需要登录
      // self.getUserInfo()
    }
  },
  methods: {
    getMenuInfo: function () {
      let self = this
      let getMenuInfo = ''
      // 暂时获取Mock数据。菜单信息
      let userName = JSON.parse(localStorage.getItem('user')).user.username
      if (userName === 'admin') {
        getMenuInfo = 'getAdminMenuInfo'
      } else if (userName === 'driver') {
        getMenuInfo = 'getDriverMenuInfo'
      } else {
        getMenuInfo = 'getUserMenuInfo'
      }
      console.log(getMenuInfo)
      api[getMenuInfo]({
        data: {
        },
        success: function (res) {
          // 获取当前的用户信息
          let ablePick = []
          /*          let menuList = [
            {
              'id': '00001',
              'seq': 1,
              'parent': '0',
              'name': '系统功能',
              'title': '系统功能',
              'type': 'MODULE',
              'active': 1,
              'readOnly': 0,
              'level': 1,
              children: []
            }
          ] */
          /*   res.data.data.permission.menuList.forEach(pMenu => {
            pMenu.name = pMenu.menuName
            pMenu.title = pMenu.menuName
            if (pMenu.children) {
              pMenu.children.forEach(secondMenu => {
                secondMenu.name = secondMenu.menuName
                secondMenu.title = secondMenu.menuName
                if (secondMenu.children) {
                  secondMenu.children.forEach(thridMenu => {
                    thridMenu.name = thridMenu.menuName
                    thridMenu.title = thridMenu.menuName
                  })
                }
              })
            }
          }) */
          // menuList[0].children = res.data.data.permission.menuList.slice()
          let menuList = res.data.data.menuList
          for (let i = 0; i < menuList.length; i++) {
            let thisModule = menuList[i]
            for (let m = 0; m < thisModule.children.length; m++) {
              let thisItem = thisModule.children[m]
              if (thisItem.router) {
                ablePick.push(thisItem.router)
                continue
              } else {
                for (let j = 0; j < thisItem.children.length; j++) {
                  let thisSubItem = thisItem.children[j]
                  if (thisSubItem.type !== 'wnode') {
                    if (thisSubItem.router) {
                      ablePick.push(thisSubItem.router)
                      continue
                    } else {
                      for (let l = 0; l < thisSubItem.children.length; l++) {
                        let thisSubSubItem = thisSubItem.children[l]
                        ablePick.push(thisSubSubItem.router)
                      }
                    }
                  } else {
                    for (let k = 0; k < thisSubItem.children.length; k++) {
                      let thisSubSubItem = thisSubItem.children[k]
                      if (thisSubSubItem.router) {
                        ablePick.push(thisSubSubItem.router)
                        continue
                      } else {
                        for (let l = 0; l < thisSubSubItem.children.length; l++) {
                          let thisSubSubSubItem = thisSubSubItem.children[l]
                          ablePick.push(thisSubSubSubItem.router)
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          self.$store.commit('setMenuInfo', res.data.data)
          self.$store.commit('setRightPathInfo', ablePick)
        }
      })
    },
    getUserInfo: function () {
      let self = this
      api.getUserInfo({
        data: {},
        success: function (res) {
          let result = res.data.data
          let defaultUserInfo = window.localStorage.getItem('defaultUserInfo')
          defaultUserInfo = defaultUserInfo ? JSON.parse(defaultUserInfo) : {}
          let sex = result.sex ? result.sex : 1
          let avatar
          if (sex === 0) {
            avatar = result.headImgUrl ? result.headImgUrl : `/${buildConfig.publicPath}/static/image/manage/default_beauty.jpg`
          } else if (sex === 1) {
            avatar = result.headImgUrl ? result.headImgUrl : `/${buildConfig.publicPath}/static/image/manage/default_handsome.jpg`
          }
          self.$store.commit('setUserInfo', {
            avatar: avatar,
            isPlatform: result.isPlatform,
            username: result.userName,
            loginType: result.loginType,
            sex: sex
          })
          // 如果有登出状态，对状态进行移除
          localStorage.removeItem('hadLogout')
        }
      })
    },
    getAppLang: function () {
      let self = this
      let lang = localStorage.getItem('lang') ? localStorage.getItem('lang') : 'zh'
      // 获取当前选择系统语言
      self.$store.commit('setAppLang', lang)
    },
    getObjConfig: function () {
      let self = this
      self.$store.commit('setObjConfig', config)
    },
    initRefreshToken: function () {
      let self = this
      // 获取token过期时间
      let tokenExpire = utils.getCookie('tokenExpire')
      // 获取refreshtoken
      let refreshToken = utils.getCookie('refreshToken')
      // 获取当前时间
      let timer = setTimeout(function () {
        clearTimeout(timer)
        self.refreshToken(refreshToken)
      }, parseInt(tokenExpire) * 1000)
    },
    refreshToken: function (refreshToken) {
      let self = this
      // 换取新token
      api.refreshToken({
        data: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: config.sysInfo.clientId,
          client_secret: config.sysInfo.clientSecret
        },
        fail: function (err) {
          if (err.status === 200) {
            // 缓存token
            utils.setCookie('token', err.data.value, {
              path: `/${buildConfig.publicPath}`
            })
            // 缓存token过期时间
            utils.setCookie('tokenExpire', err.data.expiresIn, {
              path: `/${buildConfig.publicPath}`
            })
            // 缓存refreshtoken
            utils.setCookie('refreshToken', err.data.refreshToken.value, {
              path: `/${buildConfig.publicPath}`
            })
            self.initRefreshToken()
          }
        }
      })
    }
  }
}
