<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini" label-width="110px" @submit.native="searchResult">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item
                label-width="91px"
                label="港口代码："
                prop=""
              >
                <el-input
                  placeholder="请输入港口代码"
                  v-model="basicInfoQuery.column.code"
                  clearable
                  @keydown.enter.native="searchResult"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="6">
              <el-form-item
                label-width="91px"
                label="港口名称："
                prop=""
              >
                <el-input
                  placeholder="请输入港口名称"
                  v-model="basicInfoQuery.column.name"
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
          <strong>港口信息</strong>
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
              prop="cityCode"
              label="城市区域代码"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="cityName"
              label="城市区域名称"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="cnName"
              label="港口中文名称"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="code"
              label="港口代码"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="countryCode"
              label="所属国家代码"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="countryName"
              label="所属国家名称"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="enName"
              label="港口英文名称"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="lat"
              label="纬度"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="lon"
              label="经度"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="provinceCode"
              label="所属省/州代码"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="provinceName"
              label="省/州名称"
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
                  @click="update(scope.row)"
                >更新</el-button>
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
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/portrait/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'DataDictionary',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '全部更新',
          method: 'batchUpdate',
          params: null
        }
      ],
      // 条件查询字段
      basicInfoQuery: {
        column: {
          code: '',
          name: ''
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
      api.getPortInfo({
        data: {
          current: self.dataDictTable.pagingInfo.currentPage,
          size: self.dataDictTable.pagingInfo.pageSize,
          code: self.basicInfoQuery.column.code.trim() || '',
          name: self.basicInfoQuery.column.name.trim() || ''
        },
        success: function (res) {
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
      api.getBasicInfo({
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
                    self.getBasicInfo(true)
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
                    self.getBasicInfo(true)
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
                  self.getBasicInfo(true)
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
      self.basicInfoQuery.column = {
        code: '',
        name: ''
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      self.getBasicInfo(true)
    },
    update: function (row) {
      let self = this
      self.dataDictTable.isLoading = true
      api.updatePortInfo(
        {
          data: {
            code: row.code,
            type: 0
          },
          success: function (res) {
            self.$message.success('更新成功')
            self.getBasicInfo()
            self.dataDictTable.isLoading = false
          },
          fail: function (res) {
            self.$message.error(res.data.message)
          }
        }
      )
    },
    batchUpdate: function () {
      let self = this
      self
        .$confirm('全部更新需要较长时间，确认更新？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // self.$message.warning('数据更新中，请耐心等待...')
          self.dataDictTable.isLoading = true
          api.updatePortInfo(
            {
              data: {
                type: 1
              },
              success: function (res) {
                self.$message.success('更新成功')
                console.log(res)
                self.getBasicInfo(true)
                self.dataDictTable.isLoading = true
              },
              fail: function (res) {
                self.$message.error(res.data.message)
              }
            }
          )
        })
    }
  }
}
</script>

<style scoped lang="scss"></style>
