<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini" label-width="110px">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="字典值：" label-width="80px">
                <el-input placeholder="请输入字段名" v-model="enterpriseQuery.column.enterpriseValue"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="上级字典：" label-width="90px">
                <el-input placeholder="请输入字段名" v-model="enterpriseQuery.column.pDictKey"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="16" :md="12" :lg="8">
              <el-form-item label="创建时间：" label-width="100px">
                <el-date-picker
                  v-model="enterpriseQuery.column.dataRange"
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
          <strong>数据字典基础数据</strong>
          <ul>
            <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
            </li>
          </ul>
        </div>
        <div class="com-table-detail">
          <el-table
            v-loading="enterpriseTable.isLoading"
            :data="enterpriseTable.data"
            header-row-class-name="com-table-header"
            header-cell-class-name="com-table-header-cell"
            border
            :max-height="maxHeight"
            ref="table"
            style="width: 100%;">
            <el-table-column fixed label="序号" width="50" align="center">
              <template slot-scope="scope">
                <span>{{ (enterpriseTable.pagingInfo.currentPage - 1) * enterpriseTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="企业id"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="name"
              label="企业名称"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="creditCode"
              label="统一社会认证代码"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="creator"
              label="创建者"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="modifier"
              label="修改者"
              show-overflow-tooltip
              width="180"
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
              prop="creatorId"
              label="创建者id"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="modifyId"
              label="修改者id"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>

            <el-table-column
              label="操作"
              width="140"
              align="center"
              fixed="right">
              <template slot-scope="scope">
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
            :current-page="enterpriseTable.pagingInfo.currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="enterpriseTable.pagingInfo.pageSize"
            :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
            :total="enterpriseTable.pagingInfo.totalRows">
          </el-pagination>
        </div>
      </div>
    </el-form>
    <el-dialog :title="enterpriseDialog.props.title" :visible.sync="enterpriseDialog.props.visible"
               :close-on-click-modal="false" @close="closeDetailDialog">
      <div class="com-dialog-s-title">基础数据</div>
      <el-form class="com-form" ref="enterpriseDialog.model" :model="enterpriseDialog.model" size="mini" :rules="enterpriseDialog.rules">
        <div class="com-pannel">
          <el-col :span="12" v-if="!enterpriseDialog.isCreate">
            <el-form-item label-width="82px" label="字典key：">
              <el-input v-model="enterpriseDialog.model.dictKey" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="91px" label="字典值：" prop="name">
              <el-input v-model="enterpriseDialog.model.enterpriseValue" :disabled="!enterpriseDialog.isMod && !enterpriseDialog.isCreate">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="91px" label="上级字典：" prop="pDictKey">
              <el-select
                v-model="enterpriseDialog.model.pDictKey"
                filterable
                remote
                reserve-keyword
                multiple
                collapse-tags
                placeholder="请输入上级字典名"
                :remote-method="queryPDict"
                :disabled="!enterpriseDialog.isMod && !enterpriseDialog.isCreate"
                clearable
                :loading="enterpriseDialog.extends.siteLoading"
                @change="changePDict"
              >
                <el-option
                  v-for="item in enterpriseDialog.extends.siteList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!enterpriseDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="82px" label="创建者：">
              <el-input v-model="enterpriseDialog.model.creator" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="82px" label="创建时间：">
              <el-input v-model="enterpriseDialog.model.createTime" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!enterpriseDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="82px" label="修改者：">
              <el-input v-model="enterpriseDialog.model.modifier" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="82px" label="修改时间：">
              <el-input v-model="enterpriseDialog.model.modifyTime" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="enterpriseDialog.isMod || enterpriseDialog.isCreate">
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button size="mini" type="primary" v-if="!enterpriseDialog.isCreate" @click="modRecord">确定</el-button>
        <el-button size="mini" type="primary" v-if="enterpriseDialog.isCreate" @click="createRecord">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/enterprise/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'DataDictionary',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '新增',
          method: 'showDictAdd',
          params: null
        }
      ],
      // 条件查询字段
      enterpriseQuery: {
        column: {
          enterpriseValue: '',
          pDictKey: '',
          dataRange: ''
        }
      },
      enterpriseTable: {
        isLoading: false,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      enterpriseDialog: {
        isMod: false,
        isCreate: false,
        model: {},
        rules: {
          enterpriseValue: [
            {
              required: true,
              message: '请输入企业名',
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
      }
    }
  },
  created: function () {
    let self = this
    self.getEnterprise()
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
    getEnterprise: function (isRefresh, filterConds = null) {
      let self = this
      if (isRefresh) {
        self.enterpriseTable.pagingInfo.currentPage = 1
      }
      self.enterpriseTable.isLoading = true
      api.getEnterprise({
        data: {
          page: self.enterpriseTable.pagingInfo.currentPage,
          pageSize: self.enterpriseTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          self.enterpriseTable.pagingInfo.totalRows = res.data.data.totalSize
          self.enterpriseTable.data = res.data.data.records
          self.enterpriseTable.isLoading = false
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
    queryPDict: function (query) {
      let self = this
      console.log(query)
      // 顶部查询设置该上级字典条件查询时加上
      // self.productManageQuery.column.siteLoading = true
      self.enterpriseDialog.extends.siteLoading = true
      /*      siteapi.querySiteBase({
        data: {
          name: query,
          page: 1,
          pageSize: 10
        },
        success: function (res) {
          // self.productManageQuery.column.siteLoading = false
          self.enterpriseDialog.extends.siteLoading = false
          // self.productManageQuery.range.siteList = res.data.data.baseDataSites
          self.enterpriseDialog.extends.siteList = res.data.data.baseDataSites
        }
      }) */
      self.enterpriseDialog.extends.siteList = [
        { name: 'test', code: 1 },
        { name: 'test2', code: 2 }
      ]
      self.enterpriseDialog.extends.siteLoading = false
    },
    changePDict: function (value) {
      let self = this
      self.enterpriseDialog.model.pDictKey = value
      console.log(self.enterpriseDialog.model.pDictKey)
    },
    // 查、看修改弹出框
    showDetail: function (row, isMod) {
      let self = this
      if (isMod) {
        self.enterpriseDialog.props.title = '修改数据'
        self.enterpriseDialog.isMod = true
      } else {
        self.enterpriseDialog.props.title = '数据详情'
        self.enterpriseDialog.isMod = false
      }
      self.enterpriseDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
      newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
      self.enterpriseDialog.model = Object.assign({}, newObj)
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.enterpriseTable.pagingInfo.pageSize = val
      self.enterpriseTable.pagingInfo.currentPage = 1
      self.getEnterprise(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.enterpriseTable.pagingInfo.currentPage = val
      self.getEnterprise()
    },
    // dialog取消按钮事件 和 ‘X'
    closeDetailDialog: function () {
      let self = this
      self.enterpriseDialog.props.visible = false
      self.enterpriseDialog.isCreate = false
      self.enterpriseDialog.model.data = ''
      self.$refs['enterpriseDialog.model'].clearValidate()
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
        api.delEnterprise({
          data: {
            id: row.id,
            recVer: row.recVer
          },
          success: function (res) {
            self.$message.success('删除成功')
            self.enterpriseTable.pagingInfo.currentPage = 1
            self.getEnterprise(true)
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
      let thisObj = self.enterpriseDialog.model
      self.$confirm('是否保存当前修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$refs['enterpriseDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            // 修改记录
            api.updateEnterprise({
              data: {
                enterpriseValue: self.enterpriseDialog.model.enterpriseValue,
                pDictKey: self.enterpriseDialog.model.pDictKey,
                recVer: thisObj.recVer,
                id: thisObj.id
              },
              success: function (res) {
                self.$message.success('修改成功')
                self.enterpriseTable.pagingInfo.currentPage = 1
                self.closeDetailDialog()
                self.getEnterprise(true)
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
    showDictAdd: function () {
      let self = this
      self.enterpriseDialog.isCreate = true
      self.enterpriseDialog.props.title = '新增记录'
      self.enterpriseDialog.props.visible = true
      self.enterpriseDialog.model = {
        enterpriseValue: '',
        pDictKey: null
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
        self.$refs['enterpriseDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            api.addEnterprise({
              data: {
                enterpriseValue: self.enterpriseDialog.model.enterpriseValue,
                pDictKey: self.enterpriseDialog.model.pDictKey
              },
              success: function (res) {
                console.log('success')
                console.log(res)
                self.$message.success('创建成功')
                self.enterpriseTable.pagingInfo.currentPage = 1
                self.enterpriseDialog.isCreate = false
                self.closeDetailDialog()
                self.getEnterprise(true)
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
      self.enterpriseQuery = {
        column: {
          enterpriseValue: '',
          pDictKey: '',
          dataRange: ''
        }
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.enterpriseQuery.column
      if (query.enterpriseValue || query.pDictKey || query.dataRange) {
        const filterConds = [
          { fieldName: 'enterpriseValue', fieldValue: query.enterpriseValue, operator: '=' },
          { fieldName: 'pDictKey', fieldValue: query.pDictKey, operator: '=' },
          { fieldName: 'creatTime', fieldValue: query.dataRange[0], operator: '>=' },
          { fieldName: 'creatTime', fieldValue: query.dataRange[1], operator: '<=' }
        ]
        self.getEnterprise(true, filterConds)
      } else {
        self.getEnterprise(true)
        console.log(222)
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
