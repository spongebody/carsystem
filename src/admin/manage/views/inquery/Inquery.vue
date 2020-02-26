<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini" label-width="110px" @submit.native="searchResult">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="5">
              <el-form-item
                label-width="91px"
                label="司机："
                prop="driver"
              >
                <el-input
                  placeholder="请输入司机姓名"
                  v-model="basicInfoQuery.column.driver"
                  clearable
                  @keydown.enter.native="searchResult"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5">
              <el-form-item
                label-width="91px"
                label="电话："
                prop="tel"
              >
                <el-input
                  placeholder="请输入司机电话"
                  v-model="basicInfoQuery.column.tel"
                  clearable
                  @keydown.enter.native="searchResult"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5">
              <el-form-item label="车牌号：" label-width="91px">
                <el-input
                  placeholder="请输入车牌号"
                  v-model="basicInfoQuery.column.carCode"
                  clearable
                  @keydown.enter.native="searchResult"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="5">
              <el-form-item label="筛选：" label-width="91px">
                <el-select v-model="basicInfoQuery.column.value" placeholder="请选择">
                  <el-option
                    v-for="item in basicInfoQuery.column.options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
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
          <strong>车辆基础信息</strong>
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
              prop="driver"
              label="司机"
              show-overflow-tooltip
              width="220"
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
              prop="carCode"
              label="车牌号"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="carType"
              label="车型"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="brand"
              label="品牌"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="km"
              label="公里数"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="time"
              label="时长"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="money"
              label="金额"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="paidMoneyTime"
              label="已付金额"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                >
                  <span v-if="scope.row.isPay" class="review-done" >九月</span>
                  <span v-else @click="pay(scope.row)">点击支付</span>
                </el-button>
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
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="司机：" prop="driver">
              <el-input
                v-model="userInfoDialog.model.driver"
                :disabled="!userInfoDialog.isMod  && !userInfoDialog.isCreate"

              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="110px" label="电话：" prop="tel">
              <el-input
                v-model="userInfoDialog.model.tel"
                :disabled="!userInfoDialog.isMod  && !userInfoDialog.isCreate"

              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="车牌号：">
              <el-input
                v-model="userInfoDialog.model.carCode "
                :disabled="!userInfoDialog.isMod && !userInfoDialog.isCreate"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="110px" label="车型：">
              <el-input
                v-model="userInfoDialog.model.carType"
                :disabled="!userInfoDialog.isMod  && !userInfoDialog.isCreate"

              >
              </el-input>
            </el-form-item>
          </el-col>

        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="品牌：">
              <el-input
                v-model="userInfoDialog.model.brand"
                :disabled="!userInfoDialog.isMod && !userInfoDialog.isCreate"

              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="110px" label="颜色：" prop="color">
              <el-input
                v-model="userInfoDialog.model.color"
                :disabled="!userInfoDialog.isMod && !userInfoDialog.isCreate"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>

        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="110px" label="优先级：">
              <el-input
                v-model="userInfoDialog.model.priority"
                :disabled="!userInfoDialog.isMod && !userInfoDialog.isCreate"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="userInfoDialog.isMod  || userInfoDialog.isCreate"
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
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/usecar/apiMethod'
import { mapGetters } from 'vuex'
import { getPerformance } from '../../../../mock/data/common'

export default {
  name: 'DataDictionary',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '保存结果',
          method: 'saveResult',
          params: null
        }
      ],
      // 条件查询字段
      basicInfoQuery: {
        column: {
          customerName: '',
          creditCode: '',
          masterCustomerCode: '',
          value: '',
          options: [
            {
              value: '0',
              label: '未支付'
            }, {
              value: '1',
              label: '本月业绩'
            }, {
              value: '2',
              label: '上月业绩'
            }
          ]
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
              message: '请输入司机电话',
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
      api.getPerformance({
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
      self.userInfoDialog.props.title = '新增车辆'
      self.userInfoDialog.props.visible = true
      self.userInfoDialog.model = {
        tel: '',
        driver: '',
        carCode: '',
        carType: '',
        color: '',
        priority: '',
        brand: ''
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
        masterCustomerCode: '',
        value: '',
        options: [
          {
            value: '0',
            label: '未支付'
          }, {
            value: '1',
            label: '本月业绩'
          }, {
            value: '2',
            label: '上月业绩'
          }
        ]
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      self.getBasicInfo(true)
    },
    saveResult: function () {
      let self = this
      self.$message.warning('功能正在开发中。。。')
    },
    pay: function (row) {
      let self = this
      self
        .$confirm('是否要支付？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          row.isPay = 1
          self.$message.success('支付成功')
        })
    }
  }
}
</script>

<style scoped lang="scss">
  .review-done {
    color: #8c8c8c;
    cursor: default;
    pointer-events: none;
  }
</style>
<style lang="scss">
</style>
