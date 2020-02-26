<template>
  <div class="login-ctx">
    <el-container class="login-wrp">
      <el-header height="100px" class="login-banner">
        <span class="icon icon-logo"></span>
        <div class="lang-pick">
          <el-dropdown>
            <span :class="['iconfont', 'fros-icon-language']">
              <span class="lang-text">{{ langIconDict[curLang].name }}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :class="[curLang === index ? 'cur' : '']" v-for="(item, index) in langIconDict" :lang-name="index" @click.native="changeLang" :key="index">{{ item.text }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="login-pannel-wrp">
        <div class="login-main">
          <div class="login-pannel">
            <!-- 切换 -->
            <div class="float-box" @click="changeLoginWay" :title="loginWay === 0 ? '微信扫码登录' : '账号密码登录'">
              <div class="half-cover"></div>
              <div class="main-change-icon">
                <span class="iconfont fros-icon-diannao" v-if="loginWay === 1"></span>
                <span class="iconfont fros-icon-erweima" v-if="loginWay === 0"></span>
              </div>
            </div>

            <!-- 手机号码登录 -->
            <template v-if="loginWay === 0">
              <div class="login-title">{{ $t('login.loginTitle') }}</div>
              <el-form label-position="left" ref="loginForm" :model="loginForm" :rules="loginForm.rules"  size="medium">
                <el-form-item prop="username.value">
                  <span class="icon icon-user"></span>
                  <el-input @keyup.enter.native="toLogin()" v-model="usernameValue" :placeholder="$t(loginForm.username.placeholder)">
                  </el-input>
                </el-form-item>
                <el-form-item  prop="pwd.value">
                  <span class="icon icon-password"></span>
                  <el-input @keyup.enter.native="toLogin()" type="password" v-model="loginForm.pwd.value" :placeholder="$t(loginForm.pwd.placeholder)">
                  </el-input>
                </el-form-item>

<!--                验证码-->
               <!-- <el-form-item >
                  <el-col :span="11">
                    <el-form-item prop="vcode.value">
                      <el-input @keyup.enter.native="toLogin(true)" class="no-pd" v-model="loginForm.vcode.value" :placeholder="$t(loginForm.vcode.placeholder)">
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">&nbsp;</el-col>
                  <el-col :span="11">
                    <el-image
                      :src="loginForm.vcode.codeImgUrl"
                      alt="验证码图片"
                      class="verify-image"
                      @click.prevent="changeCode"
                    />
                  </el-col>
                  <el-col :span="24" style="text-align: right; font-size: 10px; text-decoration: underline">
                  </el-col>
                </el-form-item>-->

              </el-form>
              <el-checkbox-group v-model="loginForm.isRemeber">
                <el-checkbox :label="$t('login.keepLogin')" name="isRemeber"></el-checkbox>
              </el-checkbox-group>
              <el-button type="primary" class="login-button" @click="toLogin(true)" :disabled="false" size="medium">{{ $t('login.loginBtn') }}</el-button>
              <div class="login-op">
                <!--!loginForm.isAble-->
                <a class="to-reg-btn" @click="toRegister">{{ $t('login.registerBtn') }}</a>
                <a href="#">{{ $t('login.forgotPwd') }}</a>
              </div>
            </template>

            <!-- 扫码登录 -->
            <template v-if="loginWay === 1">
              <div class="login-title">{{ $t('login.loginTitle') }}</div>
              <div class="qrcode-wrp">
                <div class="white-cover" v-if="hadScan">
                  <span class="el-icon-success" v-if="isSuccess"></span>
                  <span class="el-icon-success" v-else></span>
                  <div class="scan-success">{{ loginText }}</div>
                </div>
                <img :src="qrcodeUrl" alt="">
              </div>
              <div class="qrcode-tip">
                <div class="iconfont fros-icon-saomiao"></div>
                <div class="qrcode-text">
                  <div>打开<span>手机微信</span></div>
                  <div>扫一扫登录</div>
                </div>
              </div>
            </template>
          </div>
        </div>
      </el-main>
      <div class="login-footer">
        <div class="login-friend-link">
          <a :href="item.url" v-for="(item, index) in footData.friendLink" :key="index">
            {{ item.text }}
          </a>
        </div>
      </div>
      <div class="company-info" v-html="footData.companyInfo">
      </div>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import i18n from '@/assets/js/lang'
import api from '@api/login/apiMethod'
import utils from '@js/utils'
import config from '@js/config'

export default {
  name: 'Login',
  data () {
    return {
      loginWay: 0, // 0为手机号码登录，1为二维码扫描登录
      qrcodeUrl: '',
      hadScan: false,
      isSuccess: true,
      loginText: '',
      qrcodeUuid: '',
      langIconDict: i18n.options.messages,
      loginForm: {
        username: {
          placeholder: 'login.userName',
          value: ''
        },
        pwd: {
          placeholder: 'login.userPwd',
          value: ''
        },
        vcode: {
          placeholder: 'login.vcode',
          value: '',
          codeImgUrl: '',
          codeId: ''
        },
        isRemeber: false,
        isAble: true,
        rules: {
          'username.value': [
            { required: true, message: '请输入用户名', trigger: 'blur' }
          ],
          'pwd.value': [
            { required: true, message: '请输入密码', trigger: 'blur' }
          ],
          'vcode.value': [
            { required: true, message: '请输入验证码', trigger: 'blur' }
          ]
        }
      },
      footData: {
        friendLink: [
          {
            text: '关于我们',
            url: ''
          },
          {
            text: '联系我们',
            url: ''
          },
          {
            text: '免责条款',
            url: ''
          }
        ],
        companyInfo: '版权所用©2018 <a href="#">FrosUI</a> All Rights Reserved FrosUI'
      }
    }
  },
  computed: {
    ...mapGetters(['curLang']),
    usernameValue: {
      get: function () {
        let self = this
        return self.loginForm.username.value
      },
      set: function (value) {
        let self = this
        // self.loginForm.username.value = (value || '').toUpperCase()
        self.loginForm.username.value = (value || '')
      }
    }
  },
  created () {
    // let self = this
    // let loginToken = utils.getCookie('token')
    // if (loginToken) {
    //   self.toLogin(false, loginToken)
    // }
  },
  methods: {
    // toLogin: function (isCheck, loginToken, isWx, wxCode) {
    //   let self = this
    //   if (isCheck && !isWx && (!self.validateFormData() || !self.loginForm.isAble)) {
    //     return false
    //   } else if (!isCheck && !loginToken) {
    //     return false
    //   }
    //   let data = self.loginForm
    //
    //   self.loginForm.isAble = false
    //   let password = utils.toBase64(data.pwd.value)
    //
    //   let clientId = utils.getQueryParams('client_id')
    //   let clientSecret = utils.getQueryParams('client_secret')
    //   let fromUrl = utils.getQueryParams('from_url')
    //   let headers = isWx ? {
    //     Authorization: 'wx ' + wxCode
    //   } : null
    //   api.toLogin({
    //     withoutAuth: isCheck,
    //     headers: headers,
    //     data: {
    //       username: data.username.value,
    //       password: password,
    //       captchaId: data.vcode.codeId,
    //       captchaValue: data.vcode.value,
    //       clientId: clientId || config.sysInfo.clientId,
    //       responseType: 'code',
    //       redirectUri: fromUrl || config.publicServerHostList.portalHost + '/portal'
    //     },
    //     success: function (res) {
    //       api.getToken({
    //         data: {
    //           grant_type: 'authorization_code',
    //           code: res.data.data,
    //           client_id: clientId || config.sysInfo.clientId,
    //           client_secret: clientSecret ? utils.fromBase64(clientSecret) : config.sysInfo.clientSecret,
    //           redirect_uri: fromUrl || config.publicServerHostList.portalHost + '/portal'
    //         },
    //         success: function (res) {
    //           self.loginForm.isAble = true
    //         },
    //         fail: function (err) {
    //           self.loginForm.isAble = true
    //           if (err.status === 200) {
    //             // 缓存token
    //             utils.setCookie('token', err.data.value, {
    //               path: `/${buildConfig.publicPath}`
    //             })
    //             // 缓存token过期时间
    //             utils.setCookie('tokenExpire', err.data.expiresIn, {
    //               path: `/${buildConfig.publicPath}`
    //             })
    //             // 缓存refreshtoken
    //             utils.setCookie('refreshToken', err.data.refreshToken.value, {
    //               path: `/${buildConfig.publicPath}`
    //             })
    //             if (!fromUrl) {
    //               window.location.href = utils.concatQueryParams(config.publicServerHostList.portalHost + '/portal', `token=${err.data.value}&token_expire=${err.data.expiresIn}&refresh_token=${err.data.refreshToken.value}`)
    //             } else {
    //               window.location.href = utils.concatQueryParams(fromUrl, `token=${err.data.value}&token_expire=${err.data.expiresIn}&refresh_token=${err.data.refreshToken.value}`)
    //             }
    //           }
    //         },
    //         error: function (e) {
    //           self.loginForm.isAble = true
    //           if (e.response && e.response.status === 400) {
    //             self.$message.error('非法URI，请联系管理员进行URI配置')
    //           } else {
    //             self.$message.error('请求接口失败，请检查网络')
    //           }
    //         }
    //       })
    //     },
    //     // res.code === 0才执行success,这里返回的是200，故执行fail
    //     fail: function (err) {
    //       self.loginForm.isAble = true
    //       let code = err.data.code
    //       if (code === 1) {
    //         self.$message.error(err.data.message)
    //         self.getCodeImg()
    //       } else if (code === 1004) {
    //         // 往store里面存用户信息
    //         self.$store.commit('setWechatUserInfo', err.data.data)
    //         // 未绑定微信用户，跳转到绑定页
    //         self.$router.push({
    //           name: 'BindUser',
    //           query: {
    //             from_url: fromUrl,
    //             client_id: clientId || config.sysInfo.clientId,
    //             client_secret: clientSecret || utils.toBase64(config.sysInfo.clientSecret)
    //           }
    //         })
    //       } else {
    //         self.$message.error(err.data.message)
    //       }
    //     },
    //     error: function () {
    //       self.loginForm.isAble = true
    //     }
    //   })
    // },
    toLogin: function () {
      let self = this
      let data = self.loginForm
      // let pwd = data.pwd.value
      let username = data.username.value
      if ((!self.validateFormData() || !self.loginForm.isAble)) {
        return false
      } else if (username === 'admin' || username === 'driver' || username === 'user') {
        localStorage.setItem('user', JSON.stringify({ user: { username: username } }))
        window.location.href = '/usecar/manage'
        console.log(222)
      } else {
        self.$message.error('用户名错误，请重新输入！')
      }
    },
    changeLang: function (e) {
      let self = this
      let lang = e.currentTarget.getAttribute('lang-name')
      localStorage.setItem('lang', lang)
      self.$i18n.locale = lang
      self.$store.commit('setAppLang', lang)
    },
    validateFormData: function () {
      let self = this
      let result = false

      self.$refs['loginForm'].validate((valid) => {
        if (!valid) {
          self.$message.error('请完善登录信息')
        }
        result = valid
      })

      return result
    },
    toRegister: function () {
      let self = this
      self.$router.push({
        name: 'Register'
      })
    },
    changeCode: function () {
      let self = this
      self.getCodeImg()
    },
    getCodeImg: function () {
      let self = this
      api.getCodeImg({
        success: function (res) {
          self.loginForm.vcode.codeImgUrl = 'data:image/jpg;base64,' + res.data.data.img
          self.loginForm.vcode.codeId = res.data.data.captchaId
        },
        fail: function (err) {
          console.log('fail')
          console.log(err)
        }
      })
    },
    wxLongQuery: function () {
      let self = this
      api.wxLongQuery({
        data: {
          uuid: self.qrcodeUuid,
          _: new Date().getTime(),
          last: self.hadScan ? 404 : null
        },
        success: function (res) {
          console.log(res)
        },
        fail: function (res) {
          let result = res.data
          // 获取当前code状态
          let codeStatus = parseInt(utils.getQueryParams('window.wx_errcode', result, ';'))
          let codeStr = utils.getQueryParams('window.wx_code', result, ';').replace(/'/g, '')
          switch (codeStatus) {
            case 408:
              self.wxLongQuery()
              break
            case 404:
              // 用户扫码成功
              self.hadScan = true
              self.loginText = '扫码成功'
              self.wxLongQuery()
              break
            case 405:
              // 登录成功
              self.loginText = '登录成功'
              // 请求登录接口
              self.toLogin(true, '', true, codeStr)
          }
        },
        err: function (e) {
          console.log(e)
        }
      })
    },
    changeLoginWay: function () {
      let self = this
      self.hadScan = false
      self.loginText = ''
      if (self.loginWay === 0) {
        self.loginWay = 1
        // 获取最新的二维码
        api.wxQueryQrcode({
          data: {},
          success: function (res) {
            self.qrcodeUrl = config.publicServerHostList.wxConnectHost + res.data.data
            self.qrcodeUuid = res.data.data.split('/')[3]
            self.wxLongQuery()
          }
        })
      } else {
        self.loginWay = 0
      }
    }
  },
  mounted: function () {
    let self = this
    // self.getCodeImg()
  }
}
</script>

<style lang="scss">
  @import "../../../assets/scss/login/login.scss";
</style>
