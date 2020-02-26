<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="角色名称：" label-width="100px">
                <el-input placeholder="请输入角色名称" v-model="roleMenuQuery.column.roleName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="菜单名称：" label-width="80px">
                <el-input placeholder="请输入菜单名称" v-model="roleMenuQuery.column.menuName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="16" :md="12" :lg="8">
              <el-form-item label="创建时间：" label-width="100px">
                <el-date-picker
                  v-model="roleMenuQuery.column.dataRange"
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
          <strong>角色菜单基础数据</strong>
          <ul>
            <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
            </li>
          </ul>
        </div>
        <div class="com-table-detail">
          <el-table
            v-loading="roleMenuTable.isLoading"
            :data="roleMenuTable.data"
            header-row-class-name="com-table-header"
            header-cell-class-name="com-table-header-cell"
            border
            :max-height="maxHeight"
            ref="table"
            style="width: 100%;">
            <el-table-column fixed label="序号" width="50" align="center">
              <template slot-scope="scope">
                <span>{{ (roleMenuTable.pagingInfo.currentPage - 1) * roleMenuTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
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
              prop="roleName"
              label="角色名称"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="menuId"
              label="菜单id"
              show-overflow-tooltip
              width="120"
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
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="140"
              align="center">
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
            :current-page="roleMenuTable.pagingInfo.currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="roleMenuTable.pagingInfo.pageSize"
            :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
            :total="roleMenuTable.pagingInfo.totalRows">
          </el-pagination>
        </div>
      </div>
    </el-form>
    <el-dialog :title="roleMenuDialog.props.title" :visible.sync="roleMenuDialog.props.visible"
               :close-on-click-modal="false" @close="closeDetailDialog">
      <div class="com-dialog-s-title">基础数据</div>
      <el-form class="com-form" ref="roleMenuDialog.model" :model="roleMenuDialog.model" size="mini" :rules="roleMenuDialog.rules">
        <div class="com-pannel">
          <el-col :span="12" v-if="!roleMenuDialog.isCreate">
            <el-form-item label-width="82px" label="id：">
              <el-input v-model="roleMenuDialog.model.dictKey" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="91px" label="角色名称：" prop="name">
              <el-input v-model="roleMenuDialog.model.roleMenuValue" :disabled="!roleMenuDialog.isMod && !roleMenuDialog.isCreate">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!roleMenuDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="82px" label="创建者：">
              <el-input v-model="roleMenuDialog.model.creator" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="82px" label="创建时间：">
              <el-input v-model="roleMenuDialog.model.createTime" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!roleMenuDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="82px" label="修改者：">
              <el-input v-model="roleMenuDialog.model.modifier" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="82px" label="修改时间：">
              <el-input v-model="roleMenuDialog.model.modifyTime" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="roleMenuDialog.isMod || roleMenuDialog.isCreate">
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button size="mini" type="primary" v-if="!roleMenuDialog.isCreate" @click="modRecord">确定</el-button>
        <el-button size="mini" type="primary" v-if="roleMenuDialog.isCreate" @click="createRecord">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/rolemenu/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'RoleMenu',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '新增',
          method: 'showRoleMenuAdd',
          params: null
        }
      ],
      // 条件查询字段
      roleMenuQuery: {
        column: {
          roleName: '',
          menuName: '',
          dataRange: ''
        }
      },
      roleMenuTable: {
        isLoading: false,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      roleMenuDialog: {
        isMod: false,
        isCreate: false,
        model: {},
        rules: {
          roleMenuValue: [
            {
              required: true,
              message: '请输入角色名',
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
    self.getRoleMenu()
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
    getRoleMenu: function (isRefresh, filterConds = null) {
      let self = this
      if (isRefresh) {
        self.roleMenuTable.pagingInfo.currentPage = 1
      }
      self.roleMenuTable.isLoading = true
      api.getRoleMenu({
        data: {
          page: self.roleMenuTable.pagingInfo.currentPage,
          pageSize: self.roleMenuTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          console.log(res.data.data)
          self.roleMenuTable.pagingInfo.totalRows = res.data.data.totalSize
          self.roleMenuTable.data = res.data.data.records
          self.roleMenuTable.isLoading = false
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
        self.roleMenuDialog.props.title = '修改数据'
        self.roleMenuDialog.isMod = true
      } else {
        self.roleMenuDialog.props.title = '数据详情'
        self.roleMenuDialog.isMod = false
      }
      self.roleMenuDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
      newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
      self.roleMenuDialog.model = Object.assign({}, newObj)
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.roleMenuTable.pagingInfo.pageSize = val
      self.roleMenuTable.pagingInfo.currentPage = 1
      self.getRoleMenu(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.roleMenuTable.pagingInfo.currentPage = val
      self.getRoleMenu()
    },
    // dialog取消按钮事件 和 ‘X'
    closeDetailDialog: function () {
      let self = this
      self.roleMenuDialog.props.visible = false
      self.roleMenuDialog.isCreate = false
      self.roleMenuDialog.model.data = ''
      self.$refs['roleMenuDialog.model'].clearValidate()
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
        api.delRoleMenu({
          data: {
            id: row.id,
            recVer: row.recVer
          },
          success: function (res) {
            self.$message.success('删除成功')
            self.roleMenuTable.pagingInfo.currentPage = 1
            self.getRoleMenu(true)
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
      let thisObj = self.roleMenuDialog.model
      self.$confirm('是否保存当前修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$refs['roleMenuDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            // 修改记录
            api.updateRoleMenu({
              data: {
                roleMenuValue: self.roleMenuDialog.model.roleMenuValue,
                roleMenuType: self.roleMenuDialog.model.roleMenuType,
                recVer: thisObj.recVer,
                id: thisObj.id
              },
              success: function (res) {
                self.$message.success('修改成功')
                self.roleMenuTable.pagingInfo.currentPage = 1
                self.closeDetailDialog()
                self.getRoleMenu(true)
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
      self.roleMenuDialog.isCreate = true
      self.roleMenuDialog.props.title = '新增记录'
      self.roleMenuDialog.props.visible = true
      self.roleMenuDialog.model = {
        roleMenuValue: '',
        roleMenuType: null
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
        self.$refs['roleMenuDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            api.addRoleMenu({
              data: {
                roleMenuValue: self.roleMenuDialog.model.roleMenuValue,
                roleMenuType: self.roleMenuDialog.model.roleMenuType
              },
              success: function (res) {
                console.log('success')
                console.log(res)
                self.$message.success('创建成功')
                self.roleMenuTable.pagingInfo.currentPage = 1
                self.roleMenuDialog.isCreate = false
                self.closeDetailDialog()
                self.getRoleMenu(true)
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
      self.roleMenuQuery = {
        column: {
          roleMenuValue: '',
          roleMenuType: '',
          dataRange: ''
        }
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.roleMenuQuery.column
      if (query.roleMenuValue || query.roleMenuType || query.dataRange) {
        const filterConds = [
          { fieldName: 'roleMenuValue', fieldValue: query.roleMenuValue, operator: '=' },
          { fieldName: 'roleMenuType', fieldValue: query.roleMenuType, operator: '=' },
          { fieldName: 'creatTime', fieldValue: query.dataRange[0], operator: '>=' },
          { fieldName: 'creatTime', fieldValue: query.dataRange[1], operator: '<=' }
        ]
        self.getRoleMenu(true, filterConds)
      } else {
        self.getRoleMenu(true)
        console.log(222)
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
