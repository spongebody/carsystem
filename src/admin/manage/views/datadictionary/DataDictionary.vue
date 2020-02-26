<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini" label-width="110px">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="字典值：" label-width="80px">
                <el-input
                  placeholder="请输入字段名"
                  v-model="dataDictQuery.column.dictValue"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item
                label-width="91px"
                label="上级字典："
                prop="pDictKey"
              >
                <el-select
                  v-model="dataDictQuery.column.pDictKey"
                  filterable
                  placeholder="请输入上级字典名"
                  clearable
                  @focus="getPdictKey"
                >
                  <el-option
                    v-for="item in dataDictQuery.range.siteList"
                    :key="item.id"
                    :label="item.dictValue"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="16" :md="12" :lg="8">
              <el-form-item label="创建时间：" label-width="100px">
                <el-date-picker
                  v-model="dataDictQuery.column.dataRange"
                  type="datetimerange"
                  range-separator="至"
                  value-format="yyyy/MM/dd HH:mm:ss"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                >
                </el-date-picker>
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
          <strong>数据字典基础数据</strong>
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
              prop="id"
              label="id"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="dictKey"
              label="字典key"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="dictValue"
              label="字典值"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="pDictKey"
              label="上级字典key"
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
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="showDetail(scope.row, false)"
                  >查看</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="showDetail(scope.row, true)"
                  >修改</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="delRecord(scope.row)"
                  >删除</el-button
                >
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
      :title="dataDictDialog.props.title"
      :visible.sync="dataDictDialog.props.visible"
      :close-on-click-modal="false"
      @close="closeDetailDialog"
    >
      <div class="com-dialog-s-title">基础数据</div>
      <el-form
        class="com-form"
        ref="dataDictDialog.model"
        :model="dataDictDialog.model"
        size="mini"
        :rules="dataDictDialog.rules"
      >
        <div class="com-pannel">
          <el-col :span="12" v-if="!dataDictDialog.isCreate">
            <el-form-item label-width="82px" label="字典key：">
              <el-input v-model="dataDictDialog.model.dictKey" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="91px" label="字典值：" prop="dictValue">
              <el-input
                v-model="dataDictDialog.model.dictValue"
                :disabled="!dataDictDialog.isMod && !dataDictDialog.isCreate"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="91px" label="上级字典：" prop="pDictKey">
              <el-select
                v-model="dataDictDialog.model.pDictKey"
                filterable
                placeholder="请输入上级字典名"
                :disabled="!dataDictDialog.isMod && !dataDictDialog.isCreate"
                clearable
                @focus="getPdictKey"
              >
                <el-option
                  v-for="item in dataDictDialog.extends.siteList"
                  :key="item.id"
                  :label="item.dictValue"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!dataDictDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="82px" label="创建者：">
              <el-input v-model="dataDictDialog.model.creator" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="82px" label="创建时间：">
              <el-input
                v-model="dataDictDialog.model.createTime"
                :disabled="true"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!dataDictDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="82px" label="修改者：">
              <el-input
                v-model="dataDictDialog.model.modifier"
                :disabled="true"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="82px" label="修改时间：">
              <el-input
                v-model="dataDictDialog.model.modifyTime"
                :disabled="true"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="dataDictDialog.isMod || dataDictDialog.isCreate"
      >
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button
          size="mini"
          type="primary"
          v-if="!dataDictDialog.isCreate"
          @click="modRecord"
          >确定</el-button
        >
        <el-button
          size="mini"
          type="primary"
          v-if="dataDictDialog.isCreate"
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
import api from '@api/datadictionary/apiMethod'
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
      dataDictQuery: {
        column: {
          dictValue: '',
          pDictKey: '',
          dataRange: ''
        },
        range: {
          siteLoading: false,
          siteList: []
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
      dataDictDialog: {
        isMod: false,
        isCreate: false,
        model: {},
        rules: {
          dictValue: [
            {
              required: true,
              message: '请输入字典名',
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
    self.getDataDict()
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
    getDataDict: function (isRefresh, filterConds = null) {
      let self = this
      if (isRefresh) {
        self.dataDictTable.pagingInfo.currentPage = 1
      }
      self.dataDictTable.isLoading = true
      api.getDataDict({
        data: {
          page: self.dataDictTable.pagingInfo.currentPage,
          pageSize: self.dataDictTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          self.dataDictTable.pagingInfo.totalRows = res.data.data.totalSize
          self.dataDictTable.data = res.data.data.records || []
          console.log(res.data.data.records)
          self.dataDictTable.isLoading = false
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        }
      })
    },
    getPdictKey: function () {
      let self = this
      api.getDataPDict({
        data: {},
        success: function (res) {
          const head = [{ dictValue: '#', id: '#' }]
          console.log(res.data.data)
          self.dataDictQuery.range.siteList =
            head.concat(res.data.data) || []
          self.dataDictDialog.extends.siteList = head.concat(res.data.data) || []
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
      api.getDataPDict({
        data: {},
        success: function (res) {
          console.log(res.data.data)
          self.dataDictQuery.range.siteList = res.data.data.records || []
          self.dataDictDialog.extends.siteList = res.data.data.records || []
        }
      })
      self.dataDictDialog.extends.siteLoading = false
      self.dataDictQuery.range.siteLoading = false
    },
    changePDict: function (value) {
      let self = this
      console.log(value)
      self.dataDictDialog.model.pDictKey = value
      self.dataDictQuery.column.pDictKey = value
    },
    // 查、看修改弹出框
    showDetail: function (row, isMod) {
      let self = this
      if (isMod) {
        self.dataDictDialog.props.title = '修改数据'
        self.dataDictDialog.isMod = true
      } else {
        self.dataDictDialog.props.title = '数据详情'
        self.dataDictDialog.isMod = false
      }
      self.dataDictDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(
        newObj.createTime * 1,
        '-',
        false,
        false
      )
      newObj.modifyTime = newObj.modifyTime
        ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false)
        : '暂无修改'
      self.dataDictDialog.model = Object.assign({}, newObj)
      console.log(self.dataDictDialog.extends.siteList)
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.dataDictTable.pagingInfo.pageSize = val
      self.dataDictTable.pagingInfo.currentPage = 1
      self.getDataDict(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.dataDictTable.pagingInfo.currentPage = val
      self.getDataDict()
    },
    // dialog取消事件
    closeDetailDialog: function () {
      let self = this
      self.dataDictDialog.props.visible = false
      self.dataDictDialog.isCreate = false
      self.dataDictDialog.model.data = ''
      self.$refs['dataDictDialog.model'].clearValidate()
    },
    // 删除记录
    delRecord: function (row) {
      let self = this
      let children
      const filterConds = [
        { fieldName: 'pDictKey', fieldValue: row.id, operator: '=' }
      ]
      api.getDataDict({
        data: {
          page: self.dataDictTable.pagingInfo.currentPage,
          pageSize: self.dataDictTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          children = res.data.data.records
          console.log(children)
          const confirmInfo = children
            ? '存在子字典,是否删除该字典及其子字典？'
            : '是否删除当前字典？'
          self
            .$confirm(confirmInfo, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
            .then(() => {
              // 删除记录
              api.delDataDict(
                {
                  data: {
                    id: row.id,
                    recVer: row.recVer
                  },
                  success: function (res) {
                    self.$message.success('删除成功')
                    self.dataDictTable.pagingInfo.currentPage = 1
                    self.getDataDict(true)
                  },
                  fail: function (res) {
                    self.$message.error(res.data.message)
                  }
                },
                row.id
              )
            })
            .catch(() => {})
        },
        fail: function (err) {
          console.log(err)
          self.$message.error('操作失败')
        }
      })
    },
    // 确认修改
    modRecord: function () {
      let self = this
      let thisObj = self.dataDictDialog.model
      self
        .$confirm('是否保存当前修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          self.$refs['dataDictDialog.model'].validate(valid => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              // 修改记录
              api.updateDataDict(
                {
                  data: {
                    dictValue: self.dataDictDialog.model.dictValue,
                    pDictKey: self.dataDictDialog.model.pDictKey,
                    recVer: thisObj.recVer,
                    id: thisObj.id
                  },
                  success: function (res) {
                    self.$message.success('修改成功')
                    self.dataDictTable.pagingInfo.currentPage = 1
                    self.closeDetailDialog()
                    self.getDataDict(true)
                  },
                  fail: function (res) {
                    self.$message.error(res.data.message)
                  }
                },
                thisObj.id
              )
            }
          })
        })
        .catch(() => {})
    },
    // 新增弹出dialog
    showDictAdd: function () {
      let self = this
      self.dataDictDialog.isCreate = true
      self.dataDictDialog.props.title = '新增记录'
      self.dataDictDialog.props.visible = true
      self.dataDictDialog.model = {
        dictValue: '',
        pDictKey: null
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
          self.$refs['dataDictDialog.model'].validate(valid => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              api.addDataDict({
                data: {
                  dictValue: self.dataDictDialog.model.dictValue,
                  pDictKey: self.dataDictDialog.model.pDictKey || '#'
                },
                success: function (res) {
                  console.log('success')
                  console.log(res)
                  self.$message.success('创建成功')
                  self.dataDictTable.pagingInfo.currentPage = 1
                  self.dataDictDialog.isCreate = false
                  self.closeDetailDialog()
                  self.getDataDict(true)
                },
                fail: function (res) {
                  console.log(res)
                  self.$message.error(res.data.message)
                }
              })
            }
          })
        })
        .catch(() => {})
    },
    // 重置查询条件
    cleanQuery: function () {
      let self = this
      self.dataDictQuery.column = {
        dictValue: '',
        pDictKey: '',
        dataRange: ''
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.dataDictQuery.column
      if (query.dictValue.trim() || query.pDictKey || query.dataRange) {
        const filterConds = [
          {
            fieldName: 'dictValue',
            fieldValue: query.dictValue,
            operator: 'likeStart'
          },
          { fieldName: 'pDictKey', fieldValue: query.pDictKey, operator: '=' },
          {
            fieldName: 'createTime',
            fieldValue: query.dataRange[0] || '',
            operator: '>='
          },
          {
            fieldName: 'createTime',
            fieldValue: query.dataRange[1] || '',
            operator: '<='
          }
        ]
        self.getDataDict(true, filterConds)
      } else {
        self.getDataDict(true)
        console.log(222)
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
