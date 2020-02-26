<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini" label-width="110px" @submit.native="searchResult">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="5">
              <el-form-item
                label-width="91px"
                label="管理员："
                prop="customerName"
              >
                <el-input
                  placeholder="请输入管理员名称"
                  v-model="basicInfoQuery.column.customerName"
                  clearable
                  @keydown.enter.native="searchResult"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5">
              <el-form-item
                label-width="91px"
                label="用车单位："
                prop="pDictKey"
              >
                <el-input
                  placeholder="请输入用车单位"
                  v-model="basicInfoQuery.column.masterCustomerCode"
                  clearable
                  @keydown.enter.native="searchResult"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5">
              <el-form-item label="手机号：" label-width="91px">
                <el-input
                  placeholder="请输入管理员手机号"
                  v-model="basicInfoQuery.column.creditCode"
                  clearable
                  @keydown.enter.native="searchResult"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="com-pannel op-btn-list">
          <el-row class="search-row">
            <el-col :span="24" style="text-align:right">
              <el-button type="primary" size="mini" round @click="searchResult"
              >查询</el-button
              >
              <el-button size="mini" round @click="cleanQuery">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="com-table mt">
        <div class="table-header clear">
          <strong>客户基础信息</strong>
          <ul>
            <li
              :class="[index % 2 === 0 ? 'double' : 'single']"
              v-for="(item, index) in dataOp"
              :key="index"
              v-html="item.text"
              @click="togger(item.method, item.params)"
            ></li>
          </ul>
        </div>
        <div class="com-table-detail">
          <el-table
            v-loading="dataDictTable.isLoading"
            :data="dataDictTable.data"
            header-row-class-name="com-table-header"
            header-cell-class-name="com-table-header-cell"
            border
            :max-height="maxHeight"
            ref="table"
            style="width: 100%;"
          >
            <el-table-column fixed label="序号" width="50" align="center">
              <template slot-scope="scope">
                <span>{{
                  (dataDictTable.pagingInfo.currentPage - 1) *
                    dataDictTable.pagingInfo.pageSize +
                    scope.$index +
                    1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="用车单位"
              show-overflow-tooltip
              width="220"
            >
            </el-table-column>
            <el-table-column
              prop="administrator"
              label="管理员"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="tel"
              label="电话"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="endDate"
              label="截止期"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="地址"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="180"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="delRecord(scope.row)"
                >删除</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="showDetail(scope.row, true)"
                >修改</el-button>
                <el-button
                  type="text"
                  size="small"
                  @click="showChangePwd(scope.row)"
                >密码重置</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="com-pagination">
          <el-pagination
            @size-change="paginationOnSizeChange"
            @current-change="paginationOnCurrentPageChange"
            :current-page="dataDictTable.pagingInfo.currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="dataDictTable.pagingInfo.pageSize"
            :layout="
              isMobile
                ? 'total, sizes, prev, pager, next'
                : 'total, sizes, prev, pager, next, jumper'
            "
            :total="dataDictTable.pagingInfo.totalRows"
          >
          </el-pagination>
        </div>
      </div>
    </el-form>
    <el-dialog
      :title="userInfoDialog.props.title"
      :visible.sync="userInfoDialog.props.visible"
      :close-on-click-modal="false"
      @close="closeDetailDialog"
    >
      <div class="com-dialog-s-title">基础数据</div>
      <el-form
        class="com-form"
        ref="userInfoDialog.model"
        :model="userInfoDialog.model"
        size="mini"
        :rules="userInfoDialog.rules"
      >
        <div class="com-pannel custom-uploader">
          <el-col :span="12">
            <el-form-item label-width="100px" label="企业logo：">
              <el-upload
                class="avatar-uploader"
                action="https://jsonplaceholder.typicode.com/posts/"
                :show-file-list="false"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <img v-if="userInfoDialog.model.imageUrl" :src="userInfoDialog.model.imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="电话：" prop="tel">
              <el-input
                v-model="userInfoDialog.model.tel"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="110px" label="管理员：" prop="administrator">
              <el-input
                v-model="userInfoDialog.model.administrator"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="公司名称：">
              <el-input v-model="userInfoDialog.model.companyName">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="110px" label="常用目的地：">
              <el-input
                v-model="userInfoDialog.model.destination"
              >
              </el-input>
            </el-form-item>
          </el-col>

        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="常用车型：">
              <el-input
                v-model="userInfoDialog.model.carType"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="110px" label="接车位置：" prop="carLocation">
              <el-input
                v-model="userInfoDialog.model.carLocation"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>

        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="常用派车部门：">
              <el-input
                v-model="userInfoDialog.model.carDept"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="110px" label="公司地址：">
              <el-input
                v-model="userInfoDialog.model.address"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="userInfoDialog.isMod || userInfoDialog.isCreate"
      >
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button
          size="mini"
          type="primary"
          v-if="!userInfoDialog.isCreate"
          @click="modRecord"
        >确定</el-button
        >
        <el-button
          size="mini"
          type="primary"
          v-if="userInfoDialog.isCreate"
          @click="createRecord"
        >创建</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="passwordDialog.title"
      :visible.sync="passwordDialog.visible"
      :close-on-click-modal="false"
      @close="closeDetailDialog"
    >
      <div class="com-dialog-s-title">基础数据</div>
      <el-form
        class="com-form"
        ref="passwordDialog.model"
        :model="passwordDialog.model"
        size="mini"
        :rules="passwordDialog.rules"
      >
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="原密码：" prop="oldPwd">
              <el-input
                v-model="passwordDialog.model.oldPwd"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="新密码：" prop="newPwd">
              <el-input v-model="passwordDialog.model.newPwd">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="确认密码：" prop="confirmPwd">
              <el-input
                v-model="passwordDialog.model.confirmPwd"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="changePwd"
        >确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/usecar/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'DataDictionary',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '新建账户',
          method: 'showAddUser',
          params: null
        },
        {
          text: '批量删除',
          method: 'batchDelete',
          params: null
        }
      ],
      // 条件查询字段
      basicInfoQuery: {
        column: {
          customerName: '',
          creditCode: '',
          masterCustomerCode: ''
        }
      },
      dataDictTable: {
        isLoading: false,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      userInfoDialog: {
        isMod: false,
        isCreate: false,
        model: {},
        rules: {
          tel: [
            {
              required: true,
              message: '请输入负责人电话',
              trigger: 'blur'
            }
          ],
          carLocation: [
            {
              required: true,
              message: '请输入默认接车位置',
              trigger: 'blur'
            }
          ],
          administrator: [
            {
              required: true,
              message: '请输入管理员姓名',
              trigger: 'blur'
            }
          ]
        },
        extends: {
          siteLoading: false,
          siteList: []
        },
        props: {
          title: '数据详情',
          visible: false
        }
      },
      passwordDialog: {
        title: '修改密码',
        visible: false,
        model: {},
        rules: {
          oldPwd: [
            {
              required: true,
              message: '请输入原始密码',
              trigger: 'blur'
            }
          ],
          newPwd: [
            {
              required: true,
              message: '请输入新密码',
              trigger: 'blur'
            }
          ],
          confirmPwd: [
            {
              required: true,
              message: '请确认密码',
              trigger: 'blur'
            }
          ]
        }
      }
    }
  },
  created: function () {
    let self = this
    self.getBasicInfo()
  },
  mounted: function () {
    let self = this
    // 获取表格高度
    self.$nextTick(function () {
      self.maxHeight = self.$el.querySelector('.com-table-detail').clientHeight
    })
  },
  computed: {
    ...mapGetters(['isMobile'])
  },
  methods: {
    getBasicInfo: function (isRefresh) {
      let self = this
      if (isRefresh) {
        self.dataDictTable.pagingInfo.currentPage = 1
      }
      self.dataDictTable.isLoading = true
      api.getUsers({
        data: {
        },
        success: function (res) {
          console.log(res)
          self.dataDictTable.pagingInfo.totalRows = res.data.data.totalSize
          self.dataDictTable.data = res.data.data.records || []
          self.dataDictTable.isLoading = false
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        }
      })
    },
    changeTime: function (row, column, cellValue, index) {
      if (cellValue) {
        //  返回的时间为字符串形式，转换为整数
        return utils.timestampToDateString(cellValue * 1, '-', false, false)
      } else {
        return '暂无修改时间'
      }
    },
    // 查、看修改弹出框
    showDetail: function (row, isMod) {
      let self = this
      if (isMod) {
        self.userInfoDialog.props.title = '修改数据'
        self.userInfoDialog.isMod = true
      } else {
        self.userInfoDialog.props.title = '数据详情'
        self.userInfoDialog.isMod = false
      }
      self.userInfoDialog.props.visible = true
      let newObj = Object.assign({}, row)
      self.userInfoDialog.model = Object.assign({}, newObj)
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.dataDictTable.pagingInfo.pageSize = val
      self.dataDictTable.pagingInfo.currentPage = 1
      self.getBasicInfo(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.dataDictTable.pagingInfo.currentPage = val
      self.getBasicInfo()
    },
    // dialog取消事件
    closeDetailDialog: function () {
      let self = this
      self.userInfoDialog.props.visible = false
      self.passwordDialog.visible = false
      self.userInfoDialog.isCreate = false
      self.userInfoDialog.model.data = ''
      self.$refs['userInfoDialog.model'].clearValidate()
    },
    // 删除记录
    delRecord: function (row) {
      let self = this
      self
        .$confirm('删除后无法恢复，是否删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          self.$message.error('删除失败！，还未接上数据库呢')
        })
    },
    // 确认修改
    modRecord: function () {
      let self = this
      // let thisObj = self.userInfoDialog.model
      self
        .$confirm('是否保存当前修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          self.$refs['userInfoDialog.model'].validate(valid => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              self.$message.success('修改成功')
              self.dataDictTable.pagingInfo.currentPage = 1
              self.closeDetailDialog()
              // 修改记录
              /*              api.updateDataDict(
                {
                  data: {
                    dictValue: self.userInfoDialog.model.dictValue,
                    pDictKey: self.userInfoDialog.model.pDictKey,
                    recVer: thisObj.recVer,
                    id: thisObj.id
                  },
                  success: function (res) {
                    self.$message.success('修改成功')
                    self.dataDictTable.pagingInfo.currentPage = 1
                    self.closeDetailDialog()
                    self.getBasicInfo(true)
                  },
                  fail: function (res) {
                    self.$message.error(res.data.message)
                  }
                },
                thisObj.id
              ) */
            }
          })
        })
    },
    // 新增弹出dialog
    showAddUser: function () {
      let self = this
      self.userInfoDialog.isCreate = true
      self.userInfoDialog.props.title = '新增账户'
      self.userInfoDialog.props.visible = true
      self.userInfoDialog.model = {
        tel: '',
        carType: '',
        administrator: '',
        destination: '',
        carLocation: '',
        carDept: '',
        companyName: '',
        logo: '',
        imageUrl: '',
        address: ''
      }
    },
    // 弹出修改密码dialog
    showChangePwd: function (row) {
      let self = this
      self.passwordDialog.visible = true
      self.passwordDialog.model = {
        oldPwd: '',
        newPwd: '',
        confirmPwd: ''
      }
    },
    // 确认新增
    createRecord: function () {
      let self = this
      self
        .$confirm('是否创建当前记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // 创建记录
          self.$refs['userInfoDialog.model'].validate(valid => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              self.$message.success('创建成功')
              self.userInfoDialog.isCreate = false
              self.closeDetailDialog()
              // todo 暂时只模拟过程，数据之后实现
              /*              api.addDataDict({
                data: {
                  dictValue: self.userInfoDialog.model.dictValue,
                  pDictKey: self.userInfoDialog.model.pDictKey || '#'
                },
                success: function (res) {
                  console.log('success')
                  console.log(res)
                  self.$message.success('创建成功')
                  self.dataDictTable.pagingInfo.currentPage = 1
                  self.userInfoDialog.isCreate = false
                  self.closeDetailDialog()
                  self.getBasicInfo(true)
                },
                fail: function (res) {
                  console.log(res)
                  self.$message.error(res.data.message)
                }
              }) */
            }
          })
        })
        .catch(() => {})
    },

    changePwd: function () {
      let self = this
      self.$refs['passwordDialog.model'].validate(valid => {
        if (!valid) {
          self.$message.error('请完善表单')
        } else {
          self.$message.error('修改密码失败！')
          self.closeDetailDialog()
        }
      })
    },
    // 重置查询条件
    cleanQuery: function () {
      let self = this
      self.basicInfoQuery.column = {
        customerName: '',
        creditCode: '',
        masterCustomerCode: ''
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      self.getBasicInfo(true)
    },

    // 批量删除
    batchDelete: function () {
      let self = this
      self.$message.warning('该功能正在开发当中。。。')
    },

    // -------上传logo相关-----------
    handleAvatarSuccess (res, file) {
      this.userInfoDialog.model.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }
    // -------上传logo相关-----------
  }
}
</script>

<style scoped lang="scss">
</style>
<style lang="scss">
  .custom-uploader {
    .avatar-uploader .el-upload {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
      border-color: #409EFF;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 158px;
      height: 158px;
      line-height: 178px;
      text-align: center;
    }
    .avatar {
      width: 158px;
      height: 158px;
      display: block;
    }
  }
</style>
