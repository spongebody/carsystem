<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini" label-width="110px">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="申请账号：" label-width="100px">
                <el-input clearable v-model="enterpriseQuery.column.applyAccount" placeholder="请填写申请账号"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="公司名称：" label-width="100px">
                <el-input clearable v-model="enterpriseQuery.column.companyName" placeholder="请填写公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="审核状态：" label-width="100px">
                <el-select
                  v-model="enterpriseQuery.column.statusIndex"
                  placeholder="请选择审核状态"
                  clearable
                >
                  <el-option
                    v-for="item in enterpriseQuery.external.statusList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
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
          <strong>资质认证申请</strong>
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
              label="审核状态"
              show-overflow-tooltip
              width="100"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.isAuth === 0">未审核</span>
                <span v-if="scope.row.isAuth === 1">审核通过</span>
                <span v-if="scope.row.isAuth === 2">审核未通过</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="认证公司"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="systemName"
              label="认证系统"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="roleName"
              label="认证角色"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="creator"
              label="创建者"
              show-overflow-tooltip
              width="160"
            >
            </el-table-column>
            <el-table-column
              prop="modifier"
              label="修改者"
              show-overflow-tooltip
              width="160"
            >
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              show-overflow-tooltip
              :formatter="changeTime"
              width="160"
            >
            </el-table-column>
            <el-table-column
              prop="modifyTime"
              label="修改时间"
              show-overflow-tooltip
              :formatter="changeTime"
              width="160"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="100"
              align="center"
              fixed="right">
              <template slot-scope="scope">
                <el-button type="text" size="small"  @click="toViewDetail(scope.row)">查看</el-button>
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
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/enterprise/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'AuthApply',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [],
      // 条件查询字段
      enterpriseQuery: {
        column: {
          applyAccount: '',
          companyName: '',
          statusIndex: '',
          dataRange: ''
        },
        external: {
          statusList: [
            {
              name: '未审核',
              value: 0
            },
            {
              name: '审核通过',
              value: 1
            },
            {
              name: '审核未通过',
              value: 2
            }
          ]
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
      api.queryAuth({
        data: {
          page: self.enterpriseTable.pagingInfo.currentPage,
          pageSize: self.enterpriseTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          self.enterpriseTable.pagingInfo.totalRows = res.data.data.totalSize
          self.enterpriseTable.data = res.data.data.records || []
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
    // 重置查询条件
    cleanQuery: function () {
      let self = this
      self.enterpriseQuery = {
        column: {
          applyAccount: '',
          companyName: '',
          statusIndex: '',
          dataRange: ''
        }
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.enterpriseQuery.column
      if (query.applyAccount || query.companyName || query.dataRange || query.statusIndex !== '') {
        const filterConds = [
          { fieldName: 'creator', fieldValue: query.applyAccount, operator: query.applyAccount === '' ? 'likeAnywhere' : '=' },
          { fieldName: 'name', fieldValue: query.companyName, operator: 'likeAnywhere' },
          { fieldName: 'isAuth', fieldValue: query.statusIndex, operator: query.statusIndex === '' ? 'likeAnywhere' : '=' },
          { fieldName: 'creatTime', fieldValue: query.dataRange[0], operator: '>=' },
          { fieldName: 'creatTime', fieldValue: query.dataRange[1], operator: '<=' }
        ]
        self.getEnterprise(true, filterConds)
      } else {
        self.getEnterprise(true)
      }
    },
    toViewDetail: function (row) {
      let self = this
      self.$newpage({
        path: 'enterpriseauth/AuthDetail',
        title: row.name + '认证请求',
        params: {
          id: row.id
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
