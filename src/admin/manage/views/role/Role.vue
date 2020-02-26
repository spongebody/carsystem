<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="24" :md="8" :lg="4">
              <el-form-item
                label="公司："
                label-width="100px"
                prop="companyCode"
              >
                <el-select
                  v-model="roleQuery.company.companyId"
                  filterable
                  placeholder="请选择公司"
                  clearable
                  @change="changeCompany"
                >
                  <el-option
                    v-for="item in roleQuery.company.companyList"
                    :key="item.id"
                    :label="item.companyName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24" :lg="6">
              <el-form-item
                label="系统："
                label-width="100px"
                prop="sysCode"
                v-show="roleQuery.company.companyId"
              >
                <el-select
                  v-model="roleQuery.system.systemId"
                  filterable
                  placeholder="请选择业务系统"
                  clearable
                  @focus="getSystem"
                  @change="changeSystem"
                >
                  <el-option
                    v-for="item in roleQuery.system.systemList"
                    :key="item.id"
                    :label="item.systemName"
                    :value="item.id"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="角色名称：" label-width="100px">
                <el-input
                  placeholder="请输入角色名称"
                  v-model="roleQuery.column.roleName"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="16" :md="12" :lg="6">
              <el-form-item label="创建时间：" label-width="100px">
                <el-date-picker
                  v-model="roleQuery.column.dataRange"
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
          <strong>角色数据</strong>
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
            v-loading="roleTable.isLoading"
            :data="roleTable.data"
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
                  (roleTable.pagingInfo.currentPage - 1) *
                    roleTable.pagingInfo.pageSize +
                    scope.$index +
                    1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="角色id"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="roleName"
              label="角色名称"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="角色状态"
              show-overflow-tooltip
              width="100"
            >
              <template slot-scope="scope">
                {{ scope.row.status ? "可用" : "不可用" }}
              </template>
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="公司"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="systemName"
              label="业务系统"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="roleType"
              label="是否为平台角色"
              show-overflow-tooltip
              width="180"
            >
              <template slot-scope="scope">
                {{ scope.row.roleType ? "是" : "否" }}
              </template>
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
              label="操作"
              width="200"
              align="center"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="showAuthorization(scope.row)"
                  >授权</el-button
                >
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
            :current-page="roleTable.pagingInfo.currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="roleTable.pagingInfo.pageSize"
            :layout="
              isMobile
                ? 'total, sizes, prev, pager, next'
                : 'total, sizes, prev, pager, next, jumper'
            "
            :total="roleTable.pagingInfo.totalRows"
          >
          </el-pagination>
        </div>
      </div>
    </el-form>
    <el-dialog
      :title="roleDialog.props.title"
      :visible.sync="roleDialog.props.visible"
      :close-on-click-modal="false"
      @close="closeDetailDialog"
    >
      <div class="com-dialog-s-title">基础数据</div>
      <el-form
        class="com-form"
        ref="roleDialog.model"
        :model="roleDialog.model"
        size="mini"
        :rules="roleDialog.rules"
      >
        <div class="com-pannel">
          <el-col :span="12" v-if="!roleDialog.isCreate">
            <el-form-item label-width="90px" label="角色编码：">
              <el-input v-model="roleDialog.model.roleCode" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="96px" label="角色名称：" prop="roleName">
              <el-input
                v-model="roleDialog.model.roleName"
                placeholder="请输入角色名"
                :disabled="!roleDialog.isMod && !roleDialog.isCreate"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              label-width="90px"
              :disabled="!roleDialog.isMod && !roleDialog.isCreate"
              label="平台角色："
              prop="roleType"
            >
              <el-select
                v-model="roleDialog.model.roleType"
                collapse-tags
                placeholder="请选择是否平台角色"
                :disabled="!roleDialog.isMod && !roleDialog.isCreate"
                clearable
              >
                <el-option
                  v-for="item in roleDialog.extends.typeList"
                  :key="item.value"
                  :label="item.name"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-show="!roleDialog.model.roleType">
          <el-col :span="12">
            <el-form-item label-width="90px" label="公司：" prop="">
              <el-select
                v-model="roleDialog.model.companyId"
                collapse-tags
                placeholder="请选择关联公司"
                clearable
                :disabled="!roleDialog.isMod && !roleDialog.isCreate"
                @change="changeCompany"
              >
                <el-option
                  v-for="item in roleDialog.extends.companyList"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="90px" label="业务系统：" prop="systemId">
              <el-select
                v-model="roleDialog.model.systemId"
                collapse-tags
                :disabled="!roleDialog.isMod && !roleDialog.isCreate"
                placeholder="请选择业务系统"
                clearable
                @focus="getSystem"
                @change="changeSystem"
              >
                <el-option
                  v-for="item in roleDialog.extends.systemList"
                  :key="item.id"
                  :label="item.systemName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!roleDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="90px" label="创建者：">
              <el-input v-model="roleDialog.model.creator" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="90px" label="创建时间：">
              <el-input v-model="roleDialog.model.createTime" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!roleDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="90px" label="修改者：">
              <el-input v-model="roleDialog.model.modifier" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="90px" label="修改时间：">
              <el-input v-model="roleDialog.model.modifyTime" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
        v-if="roleDialog.isMod || roleDialog.isCreate"
      >
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button
          size="mini"
          type="primary"
          v-if="!roleDialog.isCreate"
          @click="modRecord"
          >确定</el-button
        >
        <el-button
          size="mini"
          type="primary"
          v-if="roleDialog.isCreate"
          @click="createRecord"
          >创建</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="授权"
      :visible.sync="authorizationAddDialog.props.visible"
      :close-on-click-modal="false"
      @close="closeAuthorizationDialog"
    >
      <div class="com-dialog-s-title">分配菜单</div>
      <el-tree
        :props="defaultProps"
        :data="authorizationAddDialog.data"
        v-loading="authorizationAddDialog.loading"
        element-loading-text="正在授权"
        ref="menuTree"
        node-key="id"
        show-checkbox
      >
      </el-tree>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAuthorizationDialog"
          >取消</el-button
        >
        <el-button size="mini" type="primary" @click="completeAuthorizatio"
          >确认
        </el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/role/apiMethod'
import apiCompany from '@api/company/apiMethod'
import apiMenu from '@api/menu/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'Role',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '新增',
          method: 'showRoleAdd',
          params: null
        }
        /*        {
          text: '批量通过',
          method: 'batCtl',
          params: {
            type: 'isEnable',
            value: 1
          }
        },
        {
          text: '批量不通过',
          method: 'batCtl',
          params: {
            type: 'isEnable',
            value: 0
          }
        } */
      ],
      // 条件查询字段
      roleQuery: {
        column: {
          roleName: '',
          roleType: '',
          dataRange: ''
        },
        company: {
          companyId: '',
          companyList: []
        },
        system: {
          systemId: '',
          systemList: []
        }
      },
      roleTable: {
        isLoading: false,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      roleDialog: {
        isMod: false,
        isCreate: false,
        model: {},
        rules: {
          roleName: [
            {
              required: true,
              message: '请输入角色名',
              trigger: 'blur'
            }
          ],
          companyId: [
            {
              required: true,
              message: '请选择公司',
              trigger: 'blur'
            }
          ]
        },
        extends: {
          companyList: [],
          systemList: [],
          typeList: [{ name: '是', value: 1 }, { name: '否', value: 0 }]
        },
        props: {
          title: '数据详情',
          visible: false
        }
      },
      authorizationAddDialog: {
        props: {
          visible: false
        },
        loading: false,
        data: [],
        roleId: ''
      },
      defaultProps: {
        label: 'menuName',
        children: 'children'
      }
    }
  },
  created: function () {
    let self = this
    // self.getRole()
    self.getCompany()
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
    getRole: function (isRefresh) {
      let self = this
      let query = self.roleQuery
      const filterConds = [
        {
          fieldName: 'roleName',
          fieldValue: query.column.roleName,
          operator: 'likeStart'
        },
        {
          fieldName: 'companyId',
          fieldValue: query.company.companyId,
          operator: '='
        },
        {
          fieldName: 'systemId',
          fieldValue: query.system.systemId,
          operator: '='
        },
        {
          fieldName: 'createTime',
          fieldValue: query.dataRange ? query.dataRange[0] : '',
          operator: '>='
        },
        {
          fieldName: 'createTime',
          fieldValue: query.dataRange ? query.dataRange[1] : '',
          operator: '<='
        }
      ]
      if (isRefresh) {
        self.roleTable.pagingInfo.currentPage = 1
      }
      self.roleTable.isLoading = true

      api.getRole({
        data: {
          page: self.roleTable.pagingInfo.currentPage,
          pageSize: self.roleTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          self.roleTable.pagingInfo.totalRows = res.data.data.totalSize
          self.roleTable.data = res.data.data.records || []
          console.log(res.data.data.records)
          self.roleTable.isLoading = false
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    getCompany: function () {
      let self = this
      apiCompany.getCompanyByCurrentUser({
        data: {},
        success: function (res) {
          console.log(res.data.data)
          self.roleQuery.company.companyList = res.data.data
          self.roleDialog.extends.companyList = res.data.data
        }
      })
    },
    getSystem: function () {
      let self = this
      apiCompany.getSystemByCurrentUser({
        data: {
          companyId: self.roleQuery.company.companyId
        },
        success: function (res) {
          self.roleQuery.system.systemList = res.data.data
          self.roleDialog.extends.systemList = res.data.data
        }
      })
    },
    setCheckdMenus: function (id) {
      let self = this
      apiMenu.getMenuByRoleId({
        data: {
          roleId: id
        },
        success: function (res) {
          console.log(res.data.data)
          let checks = []
          let menus = res.data.data
          menus.forEach(function loopMenus (menu) {
            if (menu.buttonIds[0] !== '0') {
              menu.buttonIds.forEach(function loopBtnIds (btnId) {
                checks.push(btnId)
              })
            } else {
              checks.push(menu.id)
            }
          })
          console.log(checks)
          self.$refs['menuTree'].setCheckedKeys(checks)
        }
      })
    },
    changeSystem: function (val) {
      let self = this
      self.roleDialog.model.systemId = val
      self.roleQuery.system.systemId = val
      self.getRole(true)
    },
    changeCompany: function (val) {
      let self = this
      self.roleDialog.model.companyId = val
      self.roleQuery.company.companyId = val
      self.roleQuery.system.systemId = null
      self.roleDialog.model.systemId = null
      self.getSystem()
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
        self.roleDialog.props.title = '修改数据'
        self.roleDialog.isMod = true
      } else {
        self.roleDialog.props.title = '数据详情'
        self.roleDialog.isMod = false
      }
      self.roleDialog.props.visible = true
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
      self.roleDialog.model = Object.assign({}, newObj)
      self.getCompany()
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.roleTable.pagingInfo.pageSize = val
      self.roleTable.pagingInfo.currentPage = 1
      self.getRole(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.roleTable.pagingInfo.currentPage = val
      self.getRole(false)
    },
    // dialog取消按钮事件 和 ‘X'
    closeDetailDialog: function () {
      let self = this
      self.roleDialog.props.visible = false
      self.roleDialog.isCreate = false
      self.roleDialog.model.data = ''
      self.$refs['roleDialog.model'].clearValidate()
    },
    closeAuthorizationDialog: function () {
      let self = this
      self.authorizationAddDialog.props.visible = false
    },
    // 删除记录
    delRecord: function (row) {
      let self = this
      self
        .$confirm('是否删除当前记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // 删除记录
          api.delRole({
            data: {
              id: row.id,
              recVer: row.recVer
            },
            success: function (res) {
              self.$message.success('删除成功')
              self.roleTable.pagingInfo.currentPage = 1
              self.getRole(true)
            },
            fail: function (res) {
              self.$message.error(res.data.message)
            }
          })
        })
        .catch(() => {})
    },
    // 确认修改
    modRecord: function () {
      let self = this
      let thisObj = self.roleDialog.model
      self
        .$confirm('是否保存当前修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          self.$refs['roleDialog.model'].validate(valid => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              // 修改记录
              api.updateRole(
                {
                  data: {
                    roleName: self.roleDialog.model.roleName,
                    roleType: self.roleDialog.model.roleType,
                    companyId: self.roleDialog.model.companyId,
                    systemId: self.roleDialog.model.systemId,
                    recVer: thisObj.recVer,
                    id: thisObj.id
                  },
                  success: function (res) {
                    self.$message.success('修改成功')
                    self.roleTable.pagingInfo.currentPage = 1
                    self.closeDetailDialog()
                    self.getRole(true)
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
    showRoleAdd: function () {
      let self = this
      self.roleDialog.isCreate = true
      self.roleDialog.props.title = '新增记录'
      self.roleDialog.props.visible = true
      self.roleDialog.model = {
        roleName: '',
        roleType: null,
        companyId: self.roleQuery.company.companyId,
        systemId: self.roleQuery.system.systemId
      }
    },
    showAuthorization: function (row) {
      let self = this
      apiMenu.getMenuBySystemId({
        data: {
          systemId: self.roleQuery.system.systemId
        },
        success: function (res) {
          console.log(res.data.data)
          let menus = res.data.data
          menus.forEach(function loopPMenus (pMenu) {
            if (pMenu.children) {
              pMenu.children.forEach(function loopSecondMenus (secondMenu) {
                if (secondMenu.children) {
                  secondMenu.children.forEach(function loopThirdMenus (thirdMenu) {
                    if (thirdMenu.buttons && thirdMenu.buttons.length) {
                      let buttons = thirdMenu.buttons.slice()
                      buttons.forEach(function loopButtons (button) {
                        button.menuName = button.buttonName
                      })
                      thirdMenu.children = buttons
                    }
                  })
                } else {
                  if (secondMenu.buttons && secondMenu.buttons.length) {
                    let buttons = secondMenu.buttons.slice()
                    buttons.forEach(function loopButtons (button) {
                      button.menuName = button.buttonName
                    })
                    secondMenu.children = buttons
                  }
                }
              })
            }
          })
          self.authorizationAddDialog.data = res.data.data
          self.authorizationAddDialog.roleId = row.id // 用于绑定菜单
          self.setCheckdMenus(row.id)
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        }
      })
      self.authorizationAddDialog.props.visible = true
    },
    // 确认新增
    createRecord: function () {
      let self = this
      let isValid = false
      self
        .$confirm('是否创建当前记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          // 创建记录
          self.$refs['roleDialog.model'].validate(valid => {
            if (
              !self.roleDialog.model.roleType &&
              (!self.roleDialog.model.companyId ||
                !self.roleDialog.model.systemId)
            ) {
              isValid = true
            }
            if (!valid || isValid) {
              self.$message.error('请完善表单')
            } else {
              // 判断是否为平台角色，确保平台角色不绑定公司 系统
              const isPlateUser = !!self.roleDialog.model.roleType
              console.log(self.roleDialog.model)
              api.addRole({
                data: {
                  roleName: self.roleDialog.model.roleName,
                  roleType: self.roleDialog.model.roleType,
                  companyId: isPlateUser ? 0 : self.roleDialog.model.companyId,
                  systemId: isPlateUser ? 0 : self.roleDialog.model.systemId
                },
                success: function (res) {
                  console.log('success')
                  console.log(res)
                  self.$message.success('创建成功')
                  self.roleTable.pagingInfo.currentPage = 1
                  self.roleDialog.isCreate = false
                  self.closeDetailDialog()
                  self.getRole(true)
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
      self.roleQuery.column = {
        roleName: '',
        roleType: '',
        dataRange: ''
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.roleQuery
      if (query.company.companyId && query.system.systemId) {
        self.getRole(true)
      } else {
        self.$message.error('未选择公司或系统')
      }
    },
    batCtl: function (obj) {},
    completeAuthorizatio: function () {
      let self = this
      let menuIds = []
      let buttons = []
      let checkedNodes = []
      self.authorizationAddDialog.loading = true
      checkedNodes = self.$refs['menuTree'].getCheckedNodes(true)
      if (checkedNodes.length >= 1) {
        checkedNodes.forEach(item => {
          if (item.buttonName) {
            buttons.push(item)
          } else {
            menuIds.push({ menuId: item.id, buttonIds: [] })
          }
        })
        console.log(buttons)
        if (buttons.length) {
          let menuId = buttons[0].menuId
          let buttonIds = []
          buttons.forEach(button => {
            if (button.menuId === menuId) {
              buttonIds.push(button.id)
            } else {
              menuIds.push({ menuId, buttonIds })
              menuId = button.menuId
              buttonIds = [].concat(button.id)
            }
          })
          menuIds.push({ menuId, buttonIds })
        }
      }
      api.authorizeRole({
        data: [{ roleId: self.authorizationAddDialog.roleId,
          menuIds }],
        success: function (res) {
          console.log(res.data)
          self.$message.success('授权成功!')
          self.authorizationAddDialog.props.visible = false
          self.authorizationAddDialog.loading = false
          self.authorizationAddDialog.data = []
        },
        fail: function (err) {
          console.log(err)
          self.authorizationAddDialog.loading = false
          self.$message.error(err.data.message)
        },
        catch: function (exp) {
          console.log(exp)
        }
      })
    }

  }
}
</script>

<style scoped lang="scss"></style>
