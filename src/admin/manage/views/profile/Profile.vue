<template>
    <div class="com-page">
      <div class="com-table">
        <div class="table-header clear">
        </div>
        <div class="user-profile">
          <div class="basic-info">
            <h3 class="basic-title">基本信息</h3>
            <el-form ref="profileInfo" :model="profileInfo" label-width="80px" class="com-form">
              <el-form-item label="头像">
                <div class="user-avatar head-item">
                  <img :src="userInfo.avatar" alt="">
                </div>
              </el-form-item>
              <el-form-item label="用户名">
                <el-col :span="3">
             <span v-if="!profileInfo.isUsernameEdit">
               {{ profileInfo.userName }}
             </span>
                </el-col>
                <el-col :span="6">
                  <div v-if="profileInfo.isUsernameEdit">
                    <el-input class="inline-input" v-model="profileInfo.userName" ></el-input>
                    <el-button type="primary" @click="completeEditUsername">确定</el-button>
                    <el-button @click="cancelEdit">取消</el-button>
                  </div>
                </el-col>
                <el-col :span="2">
                  <el-button icon="el-icon-edit" plain @click="editUsername" v-if="!profileInfo.isUsernameEdit">修改</el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="微信">
                <span>{{ profileInfo.weChat || '无' }}</span>
              </el-form-item>
              <el-form-item label="QQ">
                <span>{{ profileInfo.qq || '无' }}</span>
              </el-form-item>
              <el-form-item label="所属公司">
                <span>{{ profileInfo.companyName || '无'}}</span>
              </el-form-item>
              <el-form-item label="所属企业">
                <span>{{ profileInfo.enterpriseName || '无'}}</span>
              </el-form-item>
              <el-form-item label="所属部门">
                <span>{{ profileInfo.deptName || '无' }}</span>
              </el-form-item>
              <el-form-item label="关联系统">
                <span>{{ profileInfo.systemName|| '无' }}</span>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="user-profile">
          <div class="basic-info">
            <h3 class="basic-title">账号设置</h3>
            <el-form ref="profileInfo" :model="profileInfo" label-width="80px" class="com-form">
              <el-form-item label="手机号码">
                <el-col :span="3">
             <span v-if="!profileInfo.isTelMod">
               {{ profileInfo.telephone }}
             </span>
                </el-col>
                <el-col :span="6">
                  <div v-if="profileInfo.isTelMod">
                    <el-input class="block-input marginBottom8" placeholder="请输入手机号" v-model="profileInfo.newTel"></el-input>
                    <el-input class="block-input marginBottom8" placeholder="请输入验证码" v-model="profileInfo.telConfirmCode">
                      <el-button slot="append" @click="getSms" :disabled="verifyBtn.isable" class="verify-btn">
                        {{ verifyBtn.isable ? verifyBtn.lastSecond + 's' : '获取验证码'}}
                      </el-button>
                    </el-input>
                    <div>
                      <el-button type="primary" @click="completeModTelephone">确定</el-button>
                      <el-button @click="cancelModTelephone">取消</el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :span="2">
                  <el-button icon="el-icon-edit" plain @click="modTelephoe" v-if="!profileInfo.isTelMod">修改</el-button>
                </el-col>
              </el-form-item>
              <el-form-item label="邮箱">
                <el-col :span="3">
             <span v-if="!profileInfo.isEmailMod">
               {{ profileInfo.email }}
             </span>
                </el-col>
                <el-col :span="6">
                  <div v-if="profileInfo.isEmailMod">
                    <el-input class="block-input marginBottom8" placeholder="请输入邮箱" v-model="profileInfo.newEmail"></el-input>
                    <el-input class="block-input marginBottom8" placeholder="请输入验证码" v-model="profileInfo.emailConfirmCode">
                      <el-button slot="append" @click="getEmailConfirmCode">获取验证码</el-button>
                    </el-input>
                    <div>
                      <el-button type="primary" @click="completeModEmail">确定</el-button>
                      <el-button @click="cancelModEmail">取消</el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :span="2">
                  <el-button icon="el-icon-edit" plain @click="modEmail" v-if="!profileInfo.isEmailMod">修改</el-button>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div class="user-profile">
          <div class="basic-info">
            <h3 class="basic-title">密码设置</h3>
            <el-form ref="profileInfo" :model="profileInfo" label-width="80px" class="com-form">
              <el-form-item label="密码">
                <el-col :span="6">
                  <div v-if="profileInfo.isPwdMod">
                    <el-input class="block-input marginBottom8" placeholder="原始密码" v-model="profileInfo.oldPwd" @blur.native="checkOldPwd" show-password></el-input>
                    <el-input class="block-input marginBottom8" placeholder="新的密码" v-model="profileInfo.newPwd" show-password></el-input>
                    <el-input class="block-input marginBottom8" placeholder="确认密码" v-model="profileInfo.confirmPwd" show-password></el-input>
                    <div>
                      <el-button type="primary" @click="completeModPassword">确定</el-button>
                      <el-button @click="cancelModPassword">取消</el-button>
                    </div>
                  </div>
                </el-col>
                <el-col :span="2">
                  <el-button icon="el-icon-edit" plain @click="modPassword" v-if="!profileInfo.isPwdMod">修改</el-button>
                </el-col>
              </el-form-item>
            </el-form>
          </div>
        </div>
    </div>
    </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@js/utils'
import config from '@js/config'
import api from '@api/profile/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'DataDictionary',
  extends: Base,
  data () {
    return {
      profileInfo: {
        isTelMod: false,
        isPwdMod: false,
        isEmailMod: false,
        isUsernameEdit: false,
        oldTel: '',
        newTel: '',
        telConfirmCode: '',
        oldEmail: '',
        newEmail: '',
        emailConfirmCode: '',
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      },
      verifyBtn: {
        lastSecond: 60,
        isable: false
      }
    }
  },
  created: function () {
    let self = this
    self.getUserInfo()
  },
  mounted: function () {
  },
  computed: {
    ...mapGetters(['isMobile', 'userInfo'])
  },
  methods: {
    getUserInfo: function () {
      let self = this
      api.getUserInfo({
        data: {
        },
        success: function (res) {
          console.log(res.data)
          self.profileInfo = { ...self.profileInfo, ...res.data.data }
          console.log(self.profileInfo)
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        }
      })
    },
    /* editUserInfo: function (updateData) {
      let self = this
      return new Promise((resolve, reject) => {
        debugger
        api.editUserInfo({
          data: {
            ...updateData
          },
          success: function (res) {
            console.log(res.data)
            resolve('修改成功')
            // self.$message.success('修改成功')
          },
          fail: function (err) {
            self.$message.error(err.data.message)
          }
        })
      })
    }, */
    editUsername: function () {
      let self = this
      self.profileInfo.isUsernameEdit = true
      self.profileInfo.oldName = self.profileInfo.userName
    },
    cancelEdit: function () {
      let self = this
      self.profileInfo.isUsernameEdit = false
      self.profileInfo.userName = self.profileInfo.oldName
    },
    modTelephoe: function () {
      let self = this
      self.profileInfo.isTelMod = true
    },
    cancelModTelephone: function () {
      let self = this
      self.profileInfo.isTelMod = false
      self.profileInfo.newTel = ''
      self.profileInfo.telConfirmCode = ''
      self.verifyBtn.isable = false
    },
    modPassword: function () {
      let self = this
      self.profileInfo.isPwdMod = true
    },
    cancelModPassword: function () {
      let self = this
      self.profileInfo.isPwdMod = false
      self.profileInfo.oldPwd = ''
      self.profileInfo.newPwd = ''
      self.profileInfo.confirmPwd = ''
    },
    modEmail: function () {
      let self = this
      self.profileInfo.isEmailMod = true
    },
    cancelModEmail: function () {
      let self = this
      self.profileInfo.isEmailMod = false
      self.profileInfo.newEmail = ''
      self.profileInfo.emailConfirmCode = ''
    },
    completeEditUsername: function () {
      let self = this
      let userName = self.profileInfo.userName
      api.editUserInfo({
        data: {
          userName,
          id: self.profileInfo.id,
          recVer: self.profileInfo.recVer
        },
        success: function (res) {
          self.$message.success('修改成功')
          self.profileInfo.recVer = res.data.data.recVer
          self.profileInfo.isUsernameEdit = false
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    validatePhone: function (value) {
      // 去除空格
      var phone = value.replace(/\s/g, '')
      // 校验手机号，号段主要有(不包括上网卡)：130~139、150~153，155~159，180~189、170~171、176~178。14号段为上网卡专属号段
      let regs = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/
      return regs.test(phone)
    },
    getSms: function () {
      let self = this
      if (!self.validatePhone(self.profileInfo.newTel)) {
        self.$message.error('请输入正确的手机号')
      } else {
        api.getSms({
          data: {
            phone: self.profileInfo.newTel
          },
          success: function (res) {
            self.$message.success('验证码发送成功！')
            self.verifyBtn.isable = true
            let timer = setInterval(function () {
              self.verifyBtn.lastSecond--
              window.localStorage.setItem('verifyTime', self.verifyBtn.lastSecond)
              if (self.verifyBtn.lastSecond === 0) {
                self.verifyBtn.isable = false
                self.verifyBtn.lastSecond = 60
                window.localStorage.removeItem('verifyTime')
                clearInterval(timer)
              }
            }, 1000)
          },
          fail: function (err) {
            console.log(err)
            self.$message.error(err.data.message)
          }
        })
      }
    },
    completeModTelephone: function () {
      let self = this
      let newTel = self.profileInfo.newTel
      let code = self.profileInfo.telConfirmCode
      api.editUserInfo({
        data: {
          id: self.profileInfo.id,
          recVer: self.profileInfo.recVer,
          telephone: newTel,
          verifyCode: code
        },
        success: function (res) {
          self.$message.success('修改成功！')
          self.profileInfo.isTelMod = false
          self.profileInfo.recVer = res.data.data.recVer
          if (self.userInfo.loginType === 'EMAIL') {
            self.toLogout()
          }
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    getEmailConfirmCode: function () {
      let self = this
      let regEmail = /^[a-zA-Z\d]+([-_.][a-zA-Z\d]+)*@[a-zA-Z\d]+\.[a-zA-Z\d]{2,4}$/
      if (!regEmail.test(self.profileInfo.newEmail)) {
        self.$message.error('请输入正确的邮箱')
      } else {
        api.getEmailCode({
          data: {
            emailAddress: self.profileInfo.newEmail
          },
          success: function (res) {
            self.$message.success('验证码发送成功，请查阅您的邮箱')
          },
          fail: function (err) {
            self.$message.error(err.data.message)
          }
        })
      }
    },
    completeModEmail: function () {
      let self = this
      let newEmail = self.profileInfo.newEmail
      let code = self.profileInfo.emailConfirmCode
      api.editUserInfo({
        data: {
          id: self.profileInfo.id,
          recVer: self.profileInfo.recVer,
          email: newEmail,
          verifyCode: code
        },
        success: function (res) {
          self.$message.success('修改成功！')
          self.profileInfo.isEmailMod = false
          self.profileInfo.recVer = res.data.data.recVer
          if (self.userInfo.loginType === 'EMAIL') {
            self.toLogout()
          }
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    completeModPassword: function () {
      let self = this
      if (self.profileInfo.newPwd !== self.profileInfo.confirmPwd) {
        self.$message.warning('两次密码输入不一致')
      } else {
        api.updatePassword({
          data: {
            uerId: self.profileInfo.id,
            recVer: self.profileInfo.recVer,
            oldPwd: utils.toBase64(self.profileInfo.oldPwd),
            newPwd: utils.toBase64(self.profileInfo.newPwd)
          },
          success: function (res) {
            self.$message.success('修改成功！')
            self.profileInfo.isPwdMod = false
            self.toLogout()
          },
          fail: function (err) {
            self.$message.error(err.data.message)
          }
        })
      }
    },
    toLogout: function () {
      // 保留首页快捷方式
      let homeQuickList = localStorage.getItem('homeQuickList')
      localStorage.clear()
      if (homeQuickList) {
        localStorage.setItem('homeQuickList', homeQuickList)
      }
      localStorage.setItem('hadLogout', 1)
      window.location.href = `${config.publicServerHostList.userSsoHost}/auth/login?from_url=${window.location.href}&client_id=${config.sysInfo.clientId}&client_secret=${utils.toBase64(config.sysInfo.clientSecret)}&had_logout=${localStorage.getItem('hadLogout') ? 1 : 0}`
    }
  }
}
</script>

<style lang="scss">
  .user-profile {
    -webkit-box-flex: 1;
    background: #fff;
    min-height: 5rem;
    display: flex;
    margin: 8px 10px;
    position: relative;
  }
  .basic-info {
    background: #fff;
    min-height: 5rem;
    display: flex;
    flex-direction: column;
    position: relative;
    width: 100%;
    height: 100%;
    padding: 10px 20px;
    .el-form-item--mini .el-form-item__label {
      margin-right: 50px;
      font-size: 16px;
    }
    h3 {
      font-size: 20px;
      font-weight: 500;
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e7e7e7;
      text-align: left;
      &:before {
        content: '';
        display: inline-block;
        width: 10px;
        height: 10px;
        background: #0099cc;
        border-radius: 50%;
        margin-right: 8px;
      }
    }
    .inline-input {
      display: inline-block;
      width: 60%;
      margin-right: 6px;
    }
    .block-input {
      width: 60%;
    }
    .block-input.marginBottom8 {
      margin-bottom: 8px;
    }
    .text-padding {
      padding: 0 12px;
    }
    .user-avatar {
      width: 70px;
      &:hover {
        background: #ffffff;
      }
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
  }
</style>
