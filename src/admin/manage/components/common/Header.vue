<template>
  <el-header height="50px">
    <el-row type="flex" class="row-bg">
      <div :class="['left-part', isMobile ? 'no-left' : '']">
        <!-- 设备不是mobile时 -->
        <template v-if="!isMobile">
          <!--<div class="header-logo">
            <span class="icon icon-logo"></span>
          </div>-->
          <div class="system-name">
            {{ objConfig.sysInfo.name }}
          </div>
          <!-- 拼接一级菜单 -->
          <ul class="child-app">
            <li v-for="(item, index) in menuInfo.menuList"
                :key="index"
                :class="['mobile-module', childSysCurIndex === index ? 'cur' : '']"
                @click="changeChildSysIndex(index)"
            >
              {{ item.name }}
            </li>
          </ul>
        </template>
        <!-- 设备为mobile时 -->
        <template v-else>
          <div class="hamburger-item" @click="changeCollapse">
            <span :class="['iconfont', isCollapse ? 'fros-icon-HAMBURGERMENU rotate' : 'fros-icon-HAMBURGERMENU']"></span>
          </div>
          <el-dropdown size="medium">
            <div class="sys-module">
              <span class="iconfont fros-icon-yingyongchengxu-xianxing"></span>
            </div>
            <el-dropdown-menu slot="dropdown">
              <!-- 生成菜单 -->
              <el-dropdown-item v-for="(item, index) in menuInfo.menuList"
                                :key="index"
                                :class="[childSysCurIndex === index ? 'cur' : '']"
                                @click.native="changeChildSysIndex(index)">
                {{ item.name }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </div>
      <div class="right-part">
        <div class="head-item msg-tip el-dropdown">
          <div class="btn-fullscreen" @click="handleFullScreen">
            <el-tooltip effect="dark" :content="fullscreen ? `取消全屏`:`全屏`" placement="bottom">
            <span class="icon iconfont">&#xe963;</span>
          </el-tooltip>
          </div>
        </div>
        <div class="el-dropdown" :title="$t('manage.header.changeLang')">
          <el-popover
            placement="bottom-end"
            width="58"
            trigger="hover"
            size="medium"
            :visible-arrow="false"
            popper-class="lang-popper"
          >
            <el-row class="lang-ctl">
              <el-col class="lang-ctl-child" :class="[curLang === index ? 'cur' : '']" v-for="(item, index) in langIconDict" :lang-name="index" @click.native="changeLang" :key="index">{{ item.text }}</el-col>
            </el-row>
            <div class="lang-change" slot="reference">
              <div :class="['iconfont', 'fros-icon-language']">
                <span class="lang-text">{{ langIconDict[curLang].name }}</span>
              </div>
            </div>
          </el-popover>
        </div>
        <!-- 当有消息时 -->
        <template v-if="newMsgList.length">
          <el-popover
            placement="bottom-end"
            width="300"
            trigger="hover"
            size="medium"
            :visible-arrow="false"
            popper-class="msg-popper"
          >
            <div :class="['msg-item', index === newMsgList.length -1 ? 'no-bd' : '']" v-for="(item, index) in newMsgList" :key="index">
              <a :href="item.url">
                <div class="msg-item-title">{{ item.msg }}</div>
                <div class="msg-item-time">{{ item.time }}</div>
              </a>
            </div>
            <div class="view-more">
              <a href="">查看更多</a>
            </div>
            <div class="head-item msg-tip" slot="reference">
              <el-badge :value="newMsgList.length" class="item" :max="5">
                <span class="iconfont fros-icon-xin-xianxing"></span>
              </el-badge>
            </div>
          </el-popover>
        </template>
        <!-- 当没有消息时 -->
        <template v-else>
          <el-popover
            placement="bottom-end"
            width="300"
            trigger="hover"
            size="medium"
            :visible-arrow="false"
            popper-class="msg-popper"
          >
            <div :class="['msg-item', 'no-bd']">
              <a>
                <div class="msg-item-title">暂无更多消息</div>
                <div class="msg-item-time">-</div>
              </a>
            </div>
            <div class="view-more">
              <a href="">查看更多</a>
            </div>
            <div class="head-item msg-tip" slot="reference">
              <span class="iconfont fros-icon-xin-xianxing"></span>
            </div>
          </el-popover>
        </template>
        <el-popover
          placement="bottom-end"
          width="280"
          trigger="hover"
          size="medium"
          :visible-arrow="false"
          popper-class="header-popper"
        >
          <div class="user-avatar head-item" slot="reference">
            <img :src="userInfo.avatar" alt="">
          </div>
          <div class="user-info-box">
            <el-row class="user-info-avatar">
              <el-col>
                <img class="avatar-img" :src="userInfo.avatar" alt="">
              </el-col>
              <el-col class="user-info-wrp">
                <div class="user-info-role">
                  <template v-if="userInfo.roleList && userInfo.roleList.length > 0">
                    <template v-if="userInfo.isPlatform === 0">普通用户 {{ userInfo.roleList[userInfo.roleIndex].roleName }}</template>
                    <template v-if="userInfo.isPlatform === 1">平台内部用户 {{ userInfo.roleList[userInfo.roleIndex].roleName }}</template>
                    <template v-if="userInfo.isPlatform === 2">平台外部用户 {{ userInfo.roleList[userInfo.roleIndex].roleName }}</template>
                  </template>
                  <template v-else>
                    <template v-if="userInfo.isPlatform === 0">普通用户 暂无角色</template>
                    <template v-if="userInfo.isPlatform === 1">平台内部用户 暂无角色</template>
                    <template v-if="userInfo.isPlatform === 2">平台外部用户 暂无角色</template>
                  </template>
                </div>
                <div class="user-info-name">{{ userInfo.username }}</div>
              </el-col>
            </el-row>
            <el-row class="base-setting">
              <el-col :span="8" class="setting-url br" @click.native="toProfile">
                <a href="">基本资料</a>
              </el-col>
              <el-col :span="8" class="setting-url br">
                <a class="setting-url" href="">实名认证</a>
              </el-col>
<!--              <el-col :span="8" class="setting-url">
                <a class="setting-url" href="">切换角色</a>
              </el-col>-->
            </el-row>
            <el-row class="user-func">
              <el-col @click.native="toLog">
                <span class="iconfont fros-icon-rili"></span>
                <span class="user-func-text">前端日志</span>
              </el-col>
              <el-col @click.native="toSetting">
                <span class="iconfont fros-icon-sheji-xianxing"></span>
                <span class="user-func-text">个性化设置</span>
              </el-col>
            </el-row>
            <el-row class="log-out-btn" @click.native="toLogout">
              <el-col>退出登录</el-col>
            </el-row>
          </div>
        </el-popover>
      </div>
    </el-row>
  </el-header>
</template>

<script>
import { mapGetters } from 'vuex'
import utils from '@js/utils'
import config from '@js/config'
import Bus from '@js/bus'
import i18n from '@/assets/js/lang'
export default {
  name: 'Header',
  props: {
    userInfo: {
      type: Object
    }
  },
  data () {
    return {
      langIconDict: i18n.options.messages,
      isCollapse: true,
      newMsgList: [],
      childSysCurIndex: null,
      fullscreen: false
    }
  },
  computed: {
    ...mapGetters([
      'curLang',
      'childSysIndex',
      'defaultIndex',
      'menuInfo',
      'objConfig',
      'isMobile'
    ])
  },
  created: function () {
    let self = this
    self.getCurChildSys()
    Bus.$off('collapseChange').$on('collapseChange', function (res) {
      if (res.forCp === 'header') {
        self.isCollapse = res.value
      }
    })
  },
  methods: {
    handleFullScreen: function () {
      let element = document.documentElement
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen()
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen()
        }
      }
      this.fullscreen = !this.fullscreen
    },
    changeLang: function (e) {
      let self = this
      let lang = e.currentTarget.getAttribute('lang-name')
      localStorage.setItem('lang', lang)
      self.$i18n.locale = lang
      self.$store.commit('setAppLang', lang)
    },
    getCurChildSys: function () {
      // 获取子系统模块信息
      let self = this
      // 从localStorge中获取
      let childSysIndex = parseInt(localStorage.getItem('childSysIndex') || self.objConfig.sysInfo.defaultModule)
      self.childSysCurIndex = childSysIndex
      self.$store.commit('changeChildSysIndex', childSysIndex)
    },
    changeChildSysIndex: function (index) {
      // 切换子系统模块
      let self = this
      if (index !== self.childSysCurIndex) {
        self.childSysCurIndex = index
        // 清空所有模块
        // self.$store.commit('cleanCachePage')
        // self.$store.commit('cleanDefaultIndex')
        self.$store.commit('changeChildSysIndex', index)
        localStorage.setItem('childSysIndex', index)
        self.$nextTick(function () {
          self.$nextTick(function () {
            // 左侧导航栏颜色
            let hadCurItem = document.querySelector('.el-menu-vertical li[nav-index].is-active')
            if (hadCurItem) {
              hadCurItem.setAttribute('class', hadCurItem.getAttribute('class').replace(/ is-active/g, ''))
              hadCurItem.style.color = '#ffffff'
            }
            // 当前选中项
            let curItem = document.querySelector('.el-menu-vertical li[nav-index="' + self.defaultIndex + '"]')
            if (curItem) {
              curItem.setAttribute('class', curItem.getAttribute('class') + ' is-active')
            }
          })
        })
      }
    },
    toSetting: function () {
      // 跳转到个性化设置
      let self = this
      self.$newpage({
        title: '个性化设置',
        path: 'setting/Setting'
      })
    },
    toLogout: function () {
      // 保留首页快捷方式
      let homeQuickList = localStorage.getItem('homeQuickList')
      localStorage.clear()
      if (homeQuickList) {
        localStorage.setItem('homeQuickList', homeQuickList)
      }
      localStorage.setItem('hadLogout', 1)
      utils.delCookie('token', {
        path: `/${buildConfig.publicPath}`
      })
      utils.delCookie('tokenExpire', {
        path: `/${buildConfig.publicPath}`
      })
      utils.delCookie('refreshToken', {
        path: `/${buildConfig.publicPath}`
      })
      window.location.href = `${config.publicServerHostList.userSsoHost}/auth/login?from_url=${window.location.href}&client_id=${config.sysInfo.clientId}&client_secret=${utils.toBase64(config.sysInfo.clientSecret)}&had_logout=${localStorage.getItem('hadLogout') ? 1 : 0}`
    },
    toLog: function () {
      // 调整到日志页
      let self = this
      self.$newpage({
        title: '前端日志',
        path: 'logline/Logline',
        params: {
          checkSave: true
        }
      })
    },
    toProfile: function () {
      // 调整到个人信息页
      let self = this
      self.$newpage({
        title: '基本资料',
        path: 'profile/Profile',
        params: {
          checkSave: true
        }
      })
    },
    changeCollapse () {
      let self = this
      self.isCollapse = !self.isCollapse
      Bus.$emit('collapseChange', {
        forCp: 'aside',
        value: self.isCollapse
      })
    }
  }
}
</script>

<style scoped>
  .manage-wrp .msg-tip .iconfont {
    font-size: 24px;
    color: #fff;
  }
</style>

<style lang="scss">
  @import "../../../../assets/scss/base/params";
  .header-popper{
    border-radius: 0;
    margin-top: 0!important;
    border: 0;
    padding: 0;
    min-width: auto;
    margin-right: -4px;
  }
  .msg-popper{
    border-radius: 0;
    margin-top: 0!important;
    border: 0;
    min-width: auto;
    padding: 6px 0;
  }
  .lang-popper {
    border-radius: 0;
    margin-top: 0!important;
    border: 0;
    min-width: auto;
    padding: 6px 0;
    .lang-ctl{
      .lang-ctl-child{
        height: 32px;
        line-height: 32px;
        text-align: center;
        cursor: pointer;
        &:hover{
          background-color: $main-ltcolor;
          color: $main-blue;
        }
      }
    }
  }
  .user-info-box{
    .user-info-avatar{
      padding: 0px 12px;
      display: flex;
      height: 30px;
      line-height: 15px;
      margin-bottom: 4px;
      margin-top: 10px;
      text-align: left;
      .el-col{
        height: 30px;
        width: auto;
      }
      .avatar-img{
        width: 30px;
        border-radius: 50%;
        display: block;
      }
    }
    .user-info-wrp{
      padding-top: 2px;
    }
    .user-info-name{
      margin-left: 10px;
      font-size: 12px;
      text-align: left;
      color: $main-blue;
      font-weight: bold;
    }
    .user-info-role{
      margin-left: 10px;
      font-size: 12px;
      font-weight: bold;
      text-align: left;
    }
    .base-setting{
      padding: 8px 0;
      border-bottom: 1px solid $color-e4;
      .setting-url{
        text-align: center;
        &.br{
          border-right: 1px solid $color-e4;
        }
        a{
          font-size: 12px;
          text-align: center;
        }
      }
    }
    .user-func{
      padding: 4px 0;
      span{
        vertical-align: middle;
      }
      .el-col{
        font-size: 12px;
        padding: 0 10px;
        height: 28px;
        line-height: 28px;
        cursor: pointer;
        &:hover{
          color: $main-blue;
          background-color: $main-ltcolor;
        }
      }
      .iconfont{
        line-height: 28px;
      }
      .user-func-text{
        padding-left: 2px;
      }
    }
    .log-out-btn{
      height: 36px;
      line-height: 36px;
      text-align: center;
      border-top: 1px solid $color-e4;
      cursor: pointer;
      &:hover{
        color: $main-blue;
        background-color: $main-ltcolor;
      }
    }
  }
</style>
