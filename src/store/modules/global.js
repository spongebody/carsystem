let state = {
  userInfo: {},
  wechatUserInfo: {},
  menuInfo: [],
  defaultIndex: '',
  cachePage: [],
  lang: 'zh',
  loadingShow: false,
  // 子模块索引
  childSysIndex: null,
  // 首页快捷模块
  homeQuickList: { homeQuickList: [], homeQuickIndex: [] },
  objConfig: {},
  isMobile: false,
  rightPathList: [],
  webSiteInfo: {
    code: 'V851538',
    name: '广州'
  }
}

let mutations = {
  setUserInfo (state, userInfo) {
    state.userInfo = userInfo
  },
  setMenuInfo (state, menuInfo) {
    state.menuInfo = menuInfo
  },
  setDefaultIndex (state, defaultIndex) {
    state.defaultIndex = defaultIndex
  },
  setCachePage (state, cpPath) {
    let cpPathIndex = state.cachePage.indexOf(cpPath)
    if (cpPathIndex === -1) {
      state.cachePage.push(cpPath)
    }
  },
  cleanCachePage (state) {
    state.cachePage = []
  },
  cleanDefaultIndex (state) {
    state.defaultIndex = ''
  },
  moveCachePage (state, cpPath) {
    let cpPathIndex = state.cachePage.indexOf(cpPath)
    if (cpPathIndex !== -1) {
      delete state.cachePage[cpPathIndex]
      let newCachePage = []
      state.cachePage.forEach(function (item) {
        if (item) {
          newCachePage.push(item)
        }
      })
      state.cachePage = newCachePage
    }
  },
  setAppLang (state, lang) {
    state.lang = lang
  },
  setLoading (state, status) {
    state.loadingShow = status
  },
  changeChildSysIndex (state, index) {
    state.childSysIndex = index
  },
  updateHomeQuickList (state, homeQuickList) {
    state.homeQuickList = homeQuickList
  },
  setObjConfig (state, objConfig) {
    state.objConfig = objConfig
  },
  setIsMobile (state, isMobile) {
    state.isMobile = isMobile
  },
  setRightPathInfo (state, rightPathList) {
    state.rightPathList = rightPathList
  },
  setWebSiteInfo (state, webSiteInfo) {
    state.webSiteInfo = webSiteInfo
  },
  setWechatUserInfo (state, wechatUserInfo) {
    state.wechatUserInfo = wechatUserInfo
  }
}

let actions = {}

let getters = {
  defaultIndex: state => {
    return state.defaultIndex
  },
  cachePage: state => {
    return state.cachePage
  },
  curLang: state => {
    return state.lang
  },
  loadingShow: state => {
    return state.loadingShow
  },
  userInfo: state => {
    return state.userInfo
  },
  childSysIndex: state => {
    return state.childSysIndex
  },
  homeQuickList: state => {
    return state.homeQuickList
  },
  menuInfo: state => {
    return state.menuInfo
  },
  objConfig: state => {
    return state.objConfig
  },
  isMobile: state => {
    return state.isMobile
  },
  rightPathList: state => {
    return state.rightPathList
  },
  webSiteInfo: state => {
    return state.webSiteInfo
  },
  wechatUserInfo: state => {
    return state.wechatUserInfo
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
