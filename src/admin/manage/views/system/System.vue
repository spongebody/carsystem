<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini" label-width="110px">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="系统：" label-width="80px">
                <el-input placeholder="请输入系统名" v-model="userQuery.column.systemName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="16" :md="12" :lg="8">
              <el-form-item label="创建时间：" label-width="91px">
                <el-date-picker
                  v-model="userQuery.column.dataRange"
                  type="datetimerange"
                  range-separator="至"
                  value-format="yyyy/MM/dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="com-pannel op-btn-list">
          <el-row class="search-row">
            <el-col :span="24" style="text-align:right">
              <el-button type="primary" size="mini" round @click="searchResult">查询</el-button>
              <el-button size="mini" round @click="cleanQuery">重置</el-button>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="com-table mt">
        <div class="table-header clear">
          <strong>业务系统数据</strong>
          <ul>
            <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
            </li>
          </ul>
        </div>
        <div class="com-table-detail">
          <el-table
            v-loading="systemTable.isLoading"
            :data="systemTable.data"
            header-row-class-name="com-table-header"
            header-cell-class-name="com-table-header-cell"
            border
            :max-height="maxHeight"
            ref="table"
            style="width: 100%;">
            <el-table-column fixed label="序号" width="50" align="center">
              <template slot-scope="scope">
                <span>{{ (systemTable.pagingInfo.currentPage - 1) * systemTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="id"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="所属公司"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="systemName"
              label="业务系统名称"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="systemCode"
              label="业务系统代码"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="isAuth"
              label="是否需要企业资质认证"
              show-overflow-tooltip
              width="160"
            >
              <template slot-scope="scope">
                {{ scope.row.isAuth ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="creator"
              label="创建者"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="modifier"
              label="修改者"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              show-overflow-tooltip
              :formatter="changeTime"
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="modifyTime"
              label="修改时间"
              show-overflow-tooltip
              :formatter="changeTime"
              width="180"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="240"
              fixed="right"
              align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small"  @click="showSubscribeAdd(scope.row)">新增订阅方式</el-button>
                <el-button type="text" size="small"  @click="showDetail(scope.row, false)">查看</el-button>
                <el-button type="text" size="small"  @click="showDetail(scope.row, true)">修改</el-button>
                <el-button type="text" size="small"  @click="delRecord(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="com-pagination">
          <el-pagination
            @size-change="paginationOnSizeChange"
            @current-change="paginationOnCurrentPageChange"
            :current-page="systemTable.pagingInfo.currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="systemTable.pagingInfo.pageSize"
            :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
            :total="systemTable.pagingInfo.totalRows">
          </el-pagination>
        </div>
      </div>
    </el-form>
    <el-dialog :title="systemDialog.props.title" :visible.sync="systemDialog.props.visible"
               :close-on-click-modal="false" @close="closeDetailDialog">
      <div class="com-dialog-s-title">基础数据</div>
      <el-form class="com-form" ref="systemDialog.model" :model="systemDialog.model" size="mini" :rules="systemDialog.rules">
        <div class="com-pannel">
          <el-col :span="12" v-if="!systemDialog.isCreate">
            <el-form-item label-width="150px" label="系统id：">
              <el-input v-model="systemDialog.model.id" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="150px" label="业务系统名称：" prop="systemName">
              <el-input v-model="systemDialog.model.systemName" placeholder="请输入业务系统名称" :disabled="!systemDialog.isMod && !systemDialog.isCreate">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" >
          <el-col :span="12">
            <el-form-item label-width="150px" label="公司：" prop="companyId">
              <el-select
                v-model="systemDialog.model.companyId"
                placeholder="请选择公司"
                filterable
                :disabled="!systemDialog.isMod && !systemDialog.isCreate"
                clearable
              >
                <el-option
                  v-for="item in systemDialog.extends.companyList"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="!systemDialog.isCreate">
            <el-form-item label-width="150px" label="是否需要资质认证：" prop="isAuth">
              <el-select
                v-model="systemDialog.model.isAuth"
                filterable
                placeholder="请选择是或否"
                :disabled="!systemDialog.isMod && !systemDialog.isCreate"
                clearable
                @focus="getSystem"
              >
                <el-option
                  v-for="item in systemDialog.extends.isAuthList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" >
          <el-col :span="12" v-if="systemDialog.isCreate">
            <el-form-item label-width="150px" label="是否需要资质认证：" prop="isAuth">
              <el-select
                v-model="systemDialog.model.isAuth"
                filterable
                placeholder="请选择是或否"
                :disabled="!systemDialog.isMod && !systemDialog.isCreate"
                clearable
                @focus="getSystem"
              >
                <el-option
                  v-for="item in systemDialog.extends.isAuthList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!systemDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="150px" label="创建者：">
              <el-input v-model="systemDialog.model.creator" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="150px" label="创建时间：">
              <el-input v-model="systemDialog.model.createTime" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!systemDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="150px" label="修改者：">
              <el-input v-model="systemDialog.model.modifier" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="150px" label="修改时间：">
              <el-input v-model="systemDialog.model.modifyTime" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="systemDialog.isMod || systemDialog.isCreate">
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button size="mini" type="primary" v-if="!systemDialog.isCreate" @click="modRecord">确定</el-button>
        <el-button size="mini" type="primary" v-if="systemDialog.isCreate" @click="createRecord">创建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增订阅方式" :visible.sync="systemAddDialog.props.visible"
               :close-on-click-modal="false" @close="closeDetailDialog">
      <div class="com-dialog-s-title">基础数据</div>
      <el-form class="com-form" ref="systemAddDialog.model" :model="systemAddDialog.model"
               size="mini" :rules="systemAddDialog.rules" label-position="top" label-width="80px">
        <div class="com-pannel" >
          <el-col :span="12">
            <el-form-item label="业务系统">
              <el-select
                v-model="systemAddDialog.model.systemId"
                filterable
                placeholder="请选择业务系统"
                :disabled="true"
                clearable
              >
                <el-option
                  v-for="item in systemAddDialog.extends.systemList"
                  :key="item.id"
                  :label="item.systemName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" >
          <el-col :span="12">
            <el-form-item label="服务名：" prop="serviceName">
              <el-input v-model="systemAddDialog.model.serviceName" placeholder="请输入服务名">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label="订阅方式：" prop="subscribeList">
              <el-checkbox-group v-model="systemAddDialog.extends.subscribeList">
                <el-checkbox label="qq"></el-checkbox>
                <el-checkbox label="微信"></el-checkbox>
                <el-checkbox label="邮箱"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddSystemDialog">取消</el-button>
        <el-button size="mini" type="primary" @click="addSystem">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/system/apiMethod'
import apiCompany from '@api/company/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'System',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '新增',
          method: 'showSystemAdd',
          params: null
        }
      ],
      // 条件查询字段
      userQuery: {
        column: {
          systemName: '',
          systemType: '',
          dataRange: ''
        }
      },
      systemTable: {
        isLoading: false,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      systemDialog: {
        isMod: false,
        isCreate: false,
        model: {},
        rules: {
          systemName: [
            {
              required: true,
              message: '请输入业务系统名称',
              trigger: 'blur'
            }
          ],
          isAuth: [
            {
              required: true,
              message: '请选择是否需要验证',
              trigger: 'blur'
            }
          ],
          companyId: [
            {
              required: true,
              message: '请选择所属公司',
              trigger: 'blur'
            }
          ]
        },
        extends: {
          siteLoading: false,
          isAuthList: [
            { name: '是', code: 1 },
            { name: '否', code: 0 }
          ],
          companyList: []
        },
        props: {
          title: '数据详情',
          visible: false
        }
      },
      systemAddDialog: {
        model: {},
        rules: {
          serviceName: [
            {
              required: true,
              message: '请输入服务名',
              trigger: 'blur'
            }
          ],
          subscribeList: [
            {
              required: true,
              message: '请选择订阅方式',
              trigger: 'blur'
            }
          ]
        },
        extends: {
          systemList: [],
          subscribeList: []
        },
        props: {
          visible: false
        }
      }
    }
  },
  created: function () {
    let self = this
    self.getSystem()
  },
  mounted: function () {
    let self = this
    // 获取表格高度
    self.$nextTick(function () {
      self.maxHeight = self.$el.querySelector('.com-table-detail').clientHeight
    })
  },
  computed: {
    ...mapGetters([
      'isMobile'
    ])
  },
  methods: {
    getSystem: function (isRefresh, filterConds = null) {
      let self = this
      if (isRefresh) {
        self.systemTable.pagingInfo.currentPage = 1
      }
      self.systemTable.isLoading = true
      api.getSystem({
        data: {
          page: self.systemTable.pagingInfo.currentPage,
          pageSize: self.systemTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          self.systemTable.pagingInfo.totalRows = res.data.data.totalSize
          self.systemTable.data = res.data.data.records
          console.log(res.data.data.records)
          self.systemTable.isLoading = false
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        }
      })
    },
    getCompany: function () {
      let self = this
      apiCompany.getCompanyByCurrentUser({
        data: {
        },
        success: function (res) {
          console.log(res.data.data)
          self.systemDialog.extends.companyList = res.data.data
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
    queryPDict: function (query) {
      let self = this
      console.log(query)
      // 顶部查询设置该上级字典条件查询时加上
      // self.productManageQuery.column.siteLoading = true
      self.systemDialog.extends.siteLoading = true
      /*      siteapi.querySiteBase({
        data: {
          name: query,
          page: 1,
          pageSize: 10
        },
        success: function (res) {
          // self.productManageQuery.column.siteLoading = false
          self.systemDialog.extends.siteLoading = false
          // self.productManageQuery.range.siteList = res.data.data.baseDataSites
          self.systemDialog.extends.siteList = res.data.data.baseDataSites
        }
      }) */
      self.systemDialog.extends.siteList = [
        { name: 'test', code: 1 },
        { name: 'test2', code: 2 }
      ]
      self.systemDialog.extends.siteLoading = false
    },
    changePDict: function (value) {
      let self = this
      self.systemDialog.model.systemType = value
      console.log(self.systemDialog.model.systemType)
    },
    // 查、看修改弹出框
    showDetail: function (row, isMod) {
      let self = this
      if (isMod) {
        self.systemDialog.props.title = '修改数据'
        self.systemDialog.isMod = true
      } else {
        self.systemDialog.props.title = '数据详情'
        self.systemDialog.isMod = false
      }
      self.systemDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
      newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
      self.getCompany()
      self.systemDialog.model = Object.assign({}, newObj)
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.systemTable.pagingInfo.pageSize = val
      self.systemTable.pagingInfo.currentPage = 1
      self.getSystem(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.systemTable.pagingInfo.currentPage = val
      self.getSystem()
    },
    // dialog取消按钮事件 和 ‘X'
    closeDetailDialog: function () {
      let self = this
      self.systemDialog.props.visible = false
      self.systemDialog.isCreate = false
      self.systemDialog.model.data = ''
      self.$refs['systemDialog.model'].clearValidate()
    },
    closeAddSystemDialog: function () {
      let self = this
      self.systemAddDialog.props.visible = false
      self.systemAddDialog.model.data = ''
      self.$refs['systemAddDialog.model'].clearValidate()
    },
    // 删除记录
    delRecord: function (row) {
      let self = this
      self.$confirm('是否删除当前记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除记录
        api.delSystem({
          data: {
            id: row.id,
            recVer: row.recVer
          },
          success: function (res) {
            self.$message.success('删除成功')
            self.systemTable.pagingInfo.currentPage = 1
            self.getSystem(true)
          },
          fail: function (res) {
            self.$message.error(res.data.message)
          }
        }, row.id)
      }).catch(() => {
      })
    },
    // 确认修改
    modRecord: function () {
      let self = this
      let thisObj = self.systemDialog.model
      self.$confirm('是否保存当前修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$refs['systemDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            // 修改记录
            api.updateSystem({
              data: {
                ...self.systemDialog.model
              },
              success: function (res) {
                self.$message.success('修改成功')
                self.systemTable.pagingInfo.currentPage = 1
                self.closeDetailDialog()
                self.getSystem(true)
              },
              fail: function (res) {
                self.$message.error(res.data.message)
              }
            }, thisObj.id)
          }
        })
      }).catch(() => {
      })
    },
    // 新增弹出dialog
    showSystemAdd: function () {
      let self = this
      self.systemDialog.isCreate = true
      self.systemDialog.props.title = '新增记录'
      self.systemDialog.props.visible = true
      self.systemDialog.model = {
        systemName: '',
        isAuth: null,
        companyId: ''
      }
      self.getCompany()
    },
    showSubscribeAdd: function (row) {
      let self = this
      self.systemAddDialog.extends.systemList = [
        { systemName: row.systemName, id: row.id }
      ]
      self.systemAddDialog.props.visible = true
      self.systemAddDialog.model = {
        systemId: row.id,
        isAuth: null,
        systemName: ''
      }
    },
    // 确认新增
    createRecord: function () {
      let self = this
      self.$confirm('是否创建当前记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 创建记录
        self.$refs['systemDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            api.addSystem({
              data: {
                ...self.systemDialog.model
              },
              success: function (res) {
                console.log('success')
                console.log(res)
                self.$message.success('创建成功')
                self.systemTable.pagingInfo.currentPage = 1
                self.systemDialog.isCreate = false
                self.closeDetailDialog()
                self.getSystem(true)
              },
              fail: function (res) {
                console.log(res)
                self.$message.error(res.data.message)
              }
            })
          }
        })
      }).catch(() => {
      })
    },
    addSystem: function () {
      let self = this
      self.$confirm('是否创建当前记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 创建记录
        self.$refs['systemAddDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            api.addSystem({
              data: {
                systemId: self.systemAddDialog.model.systemId,
                systemName: self.systemAddDialog.model.systemName,
                isAuth: self.systemAddDialog.model.isAuth
              },
              success: function (res) {
                console.log('success')
                console.log(res)
                self.$message.success('创建成功')
                self.systemTable.pagingInfo.currentPage = 1
                self.closeAddSystemDialog()
                self.getSystem(true)
              },
              fail: function (res) {
                console.log(res)
                self.$message.error(res.data.message)
              }
            })
          }
        })
      }).catch(() => {
      })
    },
    // 重置查询条件
    cleanQuery: function () {
      let self = this
      self.userQuery = {
        column: {
          systemName: '',
          dataRange: ''
        }
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.userQuery.column
      if (query.systemName || query.dataRange) {
        const filterConds = [
          { fieldName: 'systemName', fieldValue: query.systemName, operator: 'likeStart' },
          { fieldName: 'createTime', fieldValue: query.dataRange[0], operator: '>=' },
          { fieldName: 'createTime', fieldValue: query.dataRange[1], operator: '<=' }
        ]
        self.getSystem(true, filterConds)
      } else {
        self.getSystem(true)
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
