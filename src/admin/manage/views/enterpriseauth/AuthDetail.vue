<template>
  <div class="com-page mg-detail">
    <div class="register-ctx auto">
      <el-form class="register-form" ref="company" :inline="true">
        <el-form-item label="关联企业：" label-width="100px" prop="companyCode">
          <el-input :disabled="true" v-model="authDetail.companyName"></el-input>
        </el-form-item>
        <el-form-item label="关联系统：" label-width="100px" prop="sysCode">
          <el-input :disabled="true" v-model="authDetail.systemName"></el-input>
        </el-form-item>
        <el-form-item label="关联角色：" label-width="100px" prop="roleCode">
          <el-input :disabled="true" v-model="authDetail.roleName"></el-input>
        </el-form-item>
      </el-form>
      <el-form class="register-form no-top" ref="register" size="mini">
        <!-- 加载自定义模板模块 -->
        <div class="register-com-block-wrp">
          <div class="register-com-block" v-for="(item, index) in authDetail.authJsonObj" :key="index">
            <div class="register-com-title">
              <div class="register-title-child">{{ item.tempName }}</div>
            </div>
            <div class="register-main-ctx">
              <el-form-item :prop="'model.' + index + '.children.' + cindex + '.bindvalue'"
                            :label="[6, 9].indexOf(citem.type) !== -1 ? '' : citem.tempName + '：'"
                            :label-width="[6, 9].indexOf(citem.type) !== -1 ? '0px' : (citem.tempName.length > 5  ? '' : '125px')"
                            :label-position="citem.tempName.length > 5 ? 'top' : 'left'" v-for="(citem, cindex) in item.children"
                            :key="cindex">
                <!-- type: 0 标题，1 文本，2 图片，3 下拉框，4 复选框， 5 单选框， 6 附件 7 地址 8 行业 9 文本链接-->
                <template v-if="citem.type === 1">
                  <el-input type="text" v-model="citem.bindvalue" :disabled="true"></el-input>
                </template>
                <template v-if="citem.type === 2">
                  <div
                    v-if="citem.bindvalue"
                    class="pr ilb"
                  >
                    <el-image
                      style="width: 100px; height: 100px; border-radius: 4px"
                      :src="imgHost + citem.bindvalue"
                      :alt="citem.tempName"
                      fit="cover"
                      @click="previewImage"
                    >
                    </el-image>
                  </div>
                </template>
                <!-- 下拉框 3 -->
                <template v-if="citem.type === 3">
                  <el-input type="text" v-model="citem.bindvalue" :disabled="true"></el-input>
                </template>
                <!-- 复选框 4 -->
                <template v-if="citem.type === 4">
                  <el-checkbox-group v-model="citem.checkedList">
                    <el-checkbox :disabled="true" :label="bitem.name" v-for="(bitem, bindex) in citem.specialValObj.checkboxList" :key="bindex"></el-checkbox>
                  </el-checkbox-group>
                </template>
                <!-- 单选框 5 -->
                <template v-if="citem.type === 5">
                  <el-radio :disabled="true" v-model="citem.radioValue" :label="bitem.value" v-for="(bitem, bindex) in citem.specialValObj.radioList" :key="bindex">{{ bitem.name }}</el-radio>
                </template>
                <!-- special component：附件 6 -->
                <div class="file-cp" v-if="citem.type === 6">
                  <template  v-for="(bitem, bindex) in citem.specialValObj.fileList">
                    <div class="file-row" :key="bindex">
                      <div class="file-name">{{ bitem.filename + '：' }}</div>
                      <el-button class="upload-btn" size="medium" type="text" @click="toViewFile(imgHost + citem.bindvalue)">{{ citem.bindvalue ? citem.uploadFileList[0].name : '上传附件' }}</el-button>
                    </div>
                  </template>
                </div>
                <!-- special component：地址 7 -->
                <template v-if="citem.type === 7">
                  <el-row>
                    <el-col :span="6">
                      <el-select
                        v-model="citem.addressObj.provinceObj.value"
                        placeholder="请选择省份"
                        :disabled="true"
                      >
                        <el-option
                          v-for="ditem in citem.addressObj.provinceObj.list"
                          :key="ditem.id"
                          :label="ditem.name"
                          :value="ditem.id">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6" class="second-trade">
                      <el-select
                        v-model="citem.addressObj.cityObj.value"
                        placeholder="请选择城市"
                        :disabled="true"
                      >
                        <el-option
                          v-for="ditem in citem.addressObj.cityObj.list"
                          :key="ditem.id"
                          :label="ditem.name"
                          :value="ditem.id">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="6" class="second-trade">
                      <el-select
                        v-model="citem.addressObj.areaObj.value"
                        placeholder="请选择区/县"
                        :disabled="true"
                      >
                        <el-option
                          v-for="ditem in citem.addressObj.areaObj.list"
                          :key="ditem.id"
                          :label="ditem.name"
                          :value="ditem.id">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :span="19" class="top-trade">
                      <el-input :disabled="true" type="text" v-model="citem.addressObj.detailAddress" placeholder="请输入详细地址"></el-input>
                    </el-col>
                  </el-row>
                </template>
                <!-- special component：行业 8 -->
                <template v-if="citem.type === 8">
                  <el-row>
                    <el-col :span="6">
                      <el-select
                        v-model="citem.tradeObj.firstObj.value"
                        :disabled="true"
                        placeholder="请选择行业"
                      >
                        <el-option
                          v-for="ditem in citem.tradeObj.firstObj.list"
                          :key="ditem.id"
                          :label="ditem.name"
                          :value="ditem.id">
                        </el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="8" class="second-trade">
                      <el-select
                        v-model="citem.tradeObj.secondObj.value"
                        placeholder="请选择行业类别"
                        :disabled="true"
                      >
                        <el-option
                          v-for="ditem in citem.tradeObj.secondObj.list"
                          :key="ditem.id"
                          :label="ditem.name"
                          :value="ditem.id">
                        </el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                </template>
                <!-- special component：文字链接 9 -->
                <div class="file-cp" v-if="citem.type === 9">
                  <div class="file-row">
                    <div class="file-name">{{ citem.specialValObj.linkObj.tipText }}</div>
                    <a :href="citem.specialValObj.linkObj.link" target="_blank">{{ citem.specialValObj.linkObj.linkText }}</a>
                  </div>
                </div>
              </el-form-item>
            </div>
          </div>
        </div>
      </el-form>
      <div class="dialog-footer">
        <el-button size="mini" @click="passVerify(2)">拒绝</el-button>
        <el-button size="mini" type="primary" @click="passVerify(1)">通过</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import api from '@api/enterprise/apiMethod'
import config from '@js/config'

export default {
  name: 'AuthDetail',
  extends: Base,
  props: {
    params: {
    }
  },
  data () {
    return {
      imgHost: config.publicServerHostList.imgHost,
      authDetail: ''
    }
  },
  created: function () {
    let self = this
    self.getEnterprise()
  },
  mounted: function () {
  },
  computed: {
  },
  activated: function () {
    let self = this
    self.getEnterprise()
  },
  methods: {
    getEnterprise: function () {
      let self = this
      api.queryAuth({
        data: {
          page: 1,
          pageSize: 10,
          filterConds: [
            {
              fieldName: 'id', fieldValue: self._props.params.id, operator: '='
            }
          ]
        },
        success: function (res) {
          let result = res.data.data.records
          if (result.length > 0) {
            result[0].authJsonObj = JSON.parse(result[0].authJson)
            self.authDetail = result[0]
          } else {
            self.$message.error('查询不到相关审核记录')
          }
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        }
      })
    },
    toViewFile: function (url) {
      window.open(url)
    },
    previewImage: function (e) {
      let self = this
      let imgUrl = e.currentTarget.src
      let imgTitle = e.currentTarget.alt
      self.$alert(`<img src="${imgUrl}" style="width: 100%" alt="${imgTitle}">`, '图片预览', {
        dangerouslyUseHTMLString: true
      })
    },
    passVerify: function (status) {
      let self = this
      self.$confirm(status === 1 ? '是否通过该资质审核' : '是否拒绝该资质审核', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除记录
        api.authEnterprise({
          data: {
            ids: [self._props.params.id],
            status: status
          },
          success: function (res) {
            self.$message.success('操作成功')
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/homepage/register.scss";
  .dialog-footer{
    text-align: right;
    padding: 12px;
  }
</style>

<style lang="scss">
  @import "../../../../assets/scss/homepage/unscopehompage.scss";
  i.el-icon-circle-close{
    z-index: 9;
    color: #fff;
    top: 3px;
    right: 3px;
    font-size: 16px;
    cursor: pointer;
  }
  .second-trade{
    margin-left: 6px;
  }
  .top-trade{
    margin-top: 6px;
  }
</style>
