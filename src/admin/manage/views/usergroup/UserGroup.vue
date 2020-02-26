<template>
  <div class="com-page-flex-wrp half-wrp">
    <div class="com-page">
      <el-form class="com-form" ref="form" size="mini" label-width="110px">
        <div class="com-pannel-wrp">
          <div class="com-pannel">
            <el-row class="search-row">
              <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <el-form-item label="公司：" label-width="100px" prop="companyCode">
                  <el-select
                    v-model="userGroupQuery.company.companyId"
                    filterable
                    placeholder="请选择公司"
                    clearable
                    @change="changeCompany"
                  >
                    <el-option
                      v-for="item in userGroupQuery.company.companyList"
                      :key="item.id"
                      :label="item.companyName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <el-form-item label="系统：" label-width="100px" prop="sysCode" v-show="userGroupQuery.company.companyId"
                >
                  <el-select
                    v-model="userGroupQuery.system.systemId"
                    filterable
                    placeholder="请选择业务系统"
                    clearable
                    @focus="getSystem"
                    @change="changeSystem"
                  >
                    <el-option
                      v-for="item in userGroupQuery.system.systemList"
                      :key="item.id"
                      :label="item.systemName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="com-pannel">
            <el-col :xs="24" :sm="24" :md="24" :lg="8">
              <el-form-item label="用户组名称：" label-width="100px">
                <el-input placeholder="请输入用户组名称" @keyup.enter.native="searchResult" v-model="userGroupQuery.column.groupName"></el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel op-btn-list">
            <el-row class="search-row">
              <el-col :span="24" style="text-align:right">
                <el-button type="primary" size="mini" round @click="searchResult">查询</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="com-table mt">
          <div class="table-header clear">
            <strong>用户组</strong>
            <ul>
              <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in userGroupQuery.dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
              </li>
            </ul>
          </div>
          <div class="com-table-detail">
            <el-table
              v-loading="userGroupTable.isLoading"
              :data="userGroupTable.data"
              header-row-class-name="com-table-header"
              header-cell-class-name="com-table-header-cell"
              border
              :max-height="maxHeight"
              highlight-current-row
              @current-change="handleCurrentChange"
              @selection-change="getSelectedGroups"
              @select-all="getSelectedGroups"
              ref="table"
              style="width: 100%;">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column label="序号" width="50" align="center">
                <template slot-scope="scope">
                  <span>{{ (userGroupTable.pagingInfo.currentPage - 1) * userGroupTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="groupName"
                label="用户组名称"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="creator"
                label="创建者"
                show-overflow-tooltip
                :formatter="changeTime"
                width="120"
              >
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                show-overflow-tooltip
                :formatter="changeTime"
                width="140"
              >
              </el-table-column>
              <el-table-column
                label="操作"
                width="140"
                align="center"
                >
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
              @size-change="userGroupPaginationOnSizeChange"
              @current-change="userGroupPaginationOnCurrentPageChange"
              :current-page="userGroupTable.pagingInfo.currentPage"
              :page-sizes="[10, 30, 50]"
              :page-size="userGroupTable.pagingInfo.pageSize"
              :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
              :total="userGroupTable.pagingInfo.totalRows">
            </el-pagination>
          </div>
        </div>
      </el-form>
      <el-dialog :title="userGroupDialog.props.title" :visible.sync="userGroupDialog.props.visible"
                 :close-on-click-modal="false" @close="closeDetailDialog">
        <div class="com-dialog-s-title">用户组信息</div>
        <el-form class="com-form" ref="userGroupDialog.model" :model="userGroupDialog.model" size="mini" :rules="userGroupDialog.rules">
          <div class="com-pannel">
            <el-col :span="12" v-if="!userGroupDialog.isCreate">
              <el-form-item label-width="92px" label="id：">
                <el-input v-model="userGroupDialog.model.id" :disabled="true">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="92px" label="名称：" prop="groupName">
                <el-input v-model="userGroupDialog.model.groupName" placeholder="请输入用户组名称" :disabled="!userGroupDialog.isMod && !userGroupDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" >
            <el-col :span="12">
              <el-form-item label-width="92px" label="公司：" prop="companyId">
                <el-select
                  v-model="userGroupDialog.model.companyId "
                  placeholder="请选择公司"
                  filterable
                  :disabled="!userGroupDialog.isMod && !userGroupDialog.isCreate"
                  clearable
                  @change="changeCompany"
                >
                  <el-option
                    v-for="item in userGroupDialog.extends.companyList"
                    :key="item.id"
                    :label="item.companyName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="!userGroupDialog.isCreate">
              <el-form-item label-width="92px" label="业务系统：" prop="systemId">
                <el-select
                  v-model="userGroupDialog.model.systemId"
                  filterable
                  placeholder="请选择业务系统"
                  :disabled="!userGroupDialog.isMod && !userGroupDialog.isCreate"
                  clearable
                  @focus="getSystem"
                  @change="changeSystem"
                >
                  <el-option
                    v-for="item in userGroupDialog.extends.systemList"
                    :key="item.id"
                    :label="item.systemName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" >
            <el-col :span="12" v-if="userGroupDialog.isCreate && userGroupDialog.model.companyId">
              <el-form-item label-width="92px" label="业务系统：" prop="systemId">
                <el-select
                  v-model="userGroupDialog.model.systemId"
                  filterable
                  placeholder="请选择业务系统"
                  :disabled="!userGroupDialog.isMod && !userGroupDialog.isCreate"
                  clearable
                  @focus="getSystem"
                  @change="changeSystem"
                >
                  <el-option
                    v-for="item in userGroupDialog.extends.systemList"
                    :key="item.id"
                    :label="item.systemName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" v-if="!userGroupDialog.isCreate">
            <el-col :span="12">
              <el-form-item label-width="92px" label="创建者：">
                <el-input v-model="userGroupDialog.model.creator" :disabled="true">

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="92px" label="创建时间：">
                <el-input v-model="userGroupDialog.model.createTime" :disabled="true">

                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" v-if="!userGroupDialog.isCreate">
            <el-col :span="12">
              <el-form-item label-width="92px" label="修改者：">
                <el-input v-model="userGroupDialog.model.modifier" :disabled="true">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="92px" label="修改时间：">
                <el-input v-model="userGroupDialog.model.modifyTime" :disabled="true">

                </el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeDetailDialog">取消</el-button>
          <el-button size="mini" type="primary" @click="modRecord" v-if="userGroupDialog.isMod">修改</el-button>
          <el-button size="mini" type="primary" @click="createRecord" v-if="userGroupDialog.isCreate">创建</el-button>
        </span>
      </el-dialog>
      <el-dialog title="授权" :visible.sync="authorizationAddDialog.props.visible"
                 :close-on-click-modal="false" @close="closeAuthorizationDialog">
        <div class="com-dialog-s-title">分配菜单</div>
        <el-tree
          :props="authorizationAddDialog.defaultProps"
          :data="authorizationAddDialog.data"
          node-key="id"
          ref="menuTree"
          show-checkbox>
        </el-tree>

        <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAuthorizationDialog">取消</el-button>
        <el-button size="mini" type="primary" @click="updateGroupMenus">确认 </el-button>
      </span>
      </el-dialog>
    </div>
    <div class="com-page">
      <el-form class="com-form" ref="form" size="mini" label-width="110px">
        <div class="com-table">
          <div class="table-header clear">
            <strong>用户</strong>
            <ul>
              <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in userQuery.dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
              </li>
            </ul>
          </div>
          <div class="com-table-detail">
            <el-table
              v-loading="userTable.isLoading"
              :data="userTable.data"
              header-row-class-name="com-table-header"
              header-cell-class-name="com-table-header-cell"
              border
              :max-height="maxHeightRight"
              ref="table"
              style="width: 100%;"
              @selection-change="getSelectedUsersInGroup"
              @select-all="getSelectedUsersInGroup">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column fixed label="序号" width="50" align="center">
                <template slot-scope="scope">
                  <span>{{ (userTable.pagingInfo.currentPage - 1) * userTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="userName"
                label="用户名"
                show-overflow-tooltip
                width="120px"
              >
              </el-table-column>
              <el-table-column
                prop="companyName"
                label="公司"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="createTime"
                label="创建时间"
                show-overflow-tooltip
                :formatter="changeTime"
                width="140"
              >
              </el-table-column>
              <el-table-column
                label="操作"
                width="120"
                align="center"
                fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small"  @click="deleteUserFromGroup(scope.row)">移除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="com-pagination">
            <el-pagination
              @size-change="userPaginationOnSizeChange"
              @current-change="userPaginationOnCurrentPageChange"
              :current-page="userTable.pagingInfo.currentPage"
              :page-sizes="[10, 30, 50]"
              :page-size="userTable.pagingInfo.pageSize"
              :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
              :total="userTable.pagingInfo.totalRows">
            </el-pagination>
          </div>
        </div>
      </el-form>
      <el-dialog title="添加用户" :visible.sync="userDialog.props.visible"
                 :close-on-click-modal="false"  @close="closeUserDialog">
        <el-form class="com-form" ref="form" size="mini" label-width="110px">
          <div class="com-pannel-wrp">
            <div class="com-pannel">
              <el-col :xs="24" :sm="12" :md="12" :lg="12">
                <el-form-item label="手机：" label-width="100px">
                  <el-input placeholder="请输入用户手机号" @keyup.enter.native="searchUser" v-model="userDialog.query.telephone"></el-input>
                </el-form-item>
              </el-col>
              <el-col  style="text-align:right">
                <el-button type="primary" size="mini" round @click="searchUser">查询</el-button>
              </el-col>
            </div>
          </div>
          <div class="com-table mt">
          <div class="table-header clear">
            <strong>用户列表</strong>
          </div>
          <div class="com-table-detail">
            <el-table
              v-loading="userDialogTable.isLoading"
              :data="userDialogTable.data"
              header-row-class-name="com-table-header"
              header-cell-class-name="com-table-header-cell"
              border
              :max-height="maxHeight"
              ref="table"
              style="width: 100%;"
              @selection-change="getSelectedUsers"
              @select-all="getSelectedUsers">
              <el-table-column
                type="selection"
                width="55">
              </el-table-column>
              <el-table-column fixed label="序号" width="50" align="center">
                <template slot-scope="scope">
                  <span>{{ (userDialogTable.pagingInfo.currentPage - 1) * userDialogTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="userName"
                label="用户名"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                prop="email"
                label="邮箱"
                show-overflow-tooltip
                width="120"
              >
              </el-table-column>
              <el-table-column
                prop="telephone"
                label="手机号"
                show-overflow-tooltip
                width="140"
              >
              </el-table-column>
            </el-table>
          </div>
          <div class="com-pagination">
            <el-pagination
              @size-change="userDialogPaginationOnSizeChange"
              @current-change="userDialogPaginationOnCurrentPageChange"
              :current-page="userDialogTable.pagingInfo.currentPage"
              :page-sizes="[10, 30, 50]"
              :page-size="userDialogTable.pagingInfo.pageSize"
              :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
              :total="userDialogTable.pagingInfo.totalRows">
            </el-pagination>
          </div>
        </div>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeUserDialog">取消</el-button>
          <el-button size="mini" type="primary" @click="addUserToGroup">添加</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import apiCompany from '@api/company/apiMethod'
import api from '@api/usergroup/apiMethod'
import apiMenu from '@api/menu/apiMethod'
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'

export default {
  name: 'UserGroup',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      maxHeightRight: 1000,
      userGroupQuery: {
        dataOp: [
          {
            text: '新增',
            method: 'showUserGroupAdd',
            params: null
          },
          {
            text: '批量删除',
            method: 'batchDeleteGroup',
            params: null
          },
          {
            text: '修改权限',
            method: 'showModAuthorization',
            params: null
          }
        ],
        column: {
          groupName: ''
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
      userQuery: {
        dataOp: [
          {
            text: '新增',
            method: 'showUserAddToGroup',
            params: null
          },
          {
            text: '批量删除',
            method: 'batchDeleteUsersFromGroup',
            params: null
          }
        ],
        column: {}
      },
      userGroupTable: {
        isLoading: false,
        currentRow: null,
        groupIds: [],
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      userTable: {
        groupId: '',
        userIds: [],
        isLoading: false,
        currentRow: null,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      userDialogTable: {
        isLoading: false,
        currentRow: null,
        selectedUserIds: [],
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      userGroupDialog: {
        isMod: false,
        isCreate: false,
        props: {
          title: '',
          visible: false
        },
        model: {},
        rules: {
          groupName: [
            {
              required: true, message: '请输入用户组名称', trigger: 'blur'
            }
          ],
          companyId: [
            {
              required: true, message: '请选择公司', trigger: 'blur'
            }
          ],
          systemId: [
            {
              required: true, message: '请选择业务系统', trigger: 'blur'
            }
          ]
        },
        extends: {
          companyList: [],
          systemList: []
        }
      },
      userDialog: {
        isMod: false,
        isCreate: false,
        props: {
          title: '',
          visible: false
        },
        model: {},
        extends: {},
        query: {
          telephone: ''
        },
        rules: {}
      },
      authorizationAddDialog: {
        props: {
          visible: false
        },
        data: [],
        roleId: '',
        defaultProps: {
          label: 'menuName',
          children: 'children'
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'isMobile'
    ])
  },
  mounted: function () {
    let self = this
    // 获取表格高度
    self.$nextTick(function () {
      self.maxHeight = self.$el.querySelectorAll('.com-table-detail')[0].clientHeight
      self.maxHeightRight = self.$el.querySelectorAll('.com-table-detail')[1].clientHeight
    })
  },
  methods: {
    getUserGroup: function (isRefresh) {
      let self = this
      let query = self.userGroupQuery
      const filterConds = [
        { fieldName: 'groupName', fieldValue: query.column.groupName, operator: 'likeStart' },
        { fieldName: 'companyId', fieldValue: query.company.companyId, operator: '=' },
        { fieldName: 'systemId', fieldValue: query.system.systemId, operator: '=' }
      ]
      if (isRefresh) {
        self.userGroupTable.pagingInfo.currentPage = 1
      }
      self.userGroupTable.isLoading = true
      api.getUserGroup({
        data: {
          page: self.userGroupTable.pagingInfo.currentPage,
          pageSize: self.userGroupTable.pagingInfo.pageSize,
          filterConds
        },
        success: function (res) {
          console.log(res.data.data)
          self.userGroupTable.pagingInfo.totalRows = res.data.data.totalSize
          self.userGroupTable.data = res.data.data.records || []
          self.userGroupTable.isLoading = false
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        },
        catch: function (err) {
          console.log(err)
        }
      })
    },
    getUserByGroup: function (isRefresh) {
      let self = this
      self.userTable.isLoading = true
      if (isRefresh) {
        self.userTable.pagingInfo.currentPage = 1
      }
      api.getUserByGroup({
        data: {
          page: self.userTable.pagingInfo.currentPage,
          pageSize: self.userTable.pagingInfo.pageSize,
          filterConds: [
            { fieldName: 'groupId', fieldValue: self.userTable.groupId, operator: '=' }
          ]
        },
        success: function (res) {
          console.log(res.data.data)
          self.userTable.data = res.data.data.records || []
          self.userTable.pagingInfo.totalRows = res.data.data.totalSize
          self.userTable.isLoading = false
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    getAvailableUsers: function () {
      let self = this
      self.userDialogTable.isLoading = true
      api.searchUser({
        data: {
          page: self.userDialogTable.pagingInfo.currentPage,
          pageSize: self.userDialogTable.pagingInfo.pageSize,
          filterConds: [
            { fieldName: 'telephone', fieldValue: self.userDialog.query.telephone, operator: '=' }
          ]
        },
        success: function (res) {
          console.log(res.data.data)
          self.userDialogTable.data = res.data.data.records || []
          self.userDialogTable.pagingInfo.totalRows = res.data.data.totalSize
          self.userDialogTable.isLoading = false
        },
        fail: function (err) {
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
    getCompany: function () {
      let self = this
      apiCompany.getCompanyByCurrentUser({
        data: {},
        success: function (res) {
          console.log(res.data.data)
          self.userGroupQuery.company.companyList = res.data.data
          self.userGroupDialog.extends.companyList = res.data.data
        }
      })
    },
    getSystem: function () {
      let self = this
      apiCompany.getSystemByCurrentUser({
        data: {
          companyId: self.userGroupQuery.company.companyId
        },
        success: function (res) {
          self.userGroupQuery.system.systemList = res.data.data
          self.userGroupDialog.extends.systemList = res.data.data
        }
      })
    },
    changeSystem: function (val) {
      let self = this
      self.userGroupDialog.model.systemId = val
      self.userGroupQuery.system.systemId = val
      self.getUserGroup(true)
    },
    changeCompany: function (val) {
      let self = this
      self.userGroupDialog.model.companyId = val
      self.userGroupQuery.company.companyId = val
      self.userGroupQuery.system.systemId = null
      self.userGroupDialog.model.systemId = null
      self.getSystem()
    },
    // 查、看修改弹出框
    showDetail: function (row, isMod) {
      let self = this
      if (isMod) {
        self.userGroupDialog.props.title = '修改数据'
        self.userGroupDialog.isMod = true
      } else {
        self.userGroupDialog.props.title = '数据详情'
        self.userGroupDialog.isMod = false
      }
      self.userGroupDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
      newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
      self.getCompany()
      self.userGroupDialog.model = Object.assign({}, newObj)
    },
    userPaginationOnSizeChange: function (val) {
      let self = this
      self.userTable.pagingInfo.pageSize = val
      self.userTable.pagingInfo.currentPage = 1
      self.getUserByGroup(true)
    },
    userPaginationOnCurrentPageChange: function (val) {
      let self = this
      self.userGroupTable.pagingInfo.currentPage = val
      self.getUserByGroup(false)
    },
    userGroupPaginationOnSizeChange: function (val) {
      let self = this
      self.userGroupTable.pagingInfo.pageSize = val
      self.userGroupTable.pagingInfo.currentPage = 1
      self.getUserGroup(true)
    },
    userGroupPaginationOnCurrentPageChange: function (val) {
      let self = this
      self.userGroupTable.pagingInfo.currentPage = val
      self.getUserGroup(false)
    },
    userDialogPaginationOnSizeChange: function (val) {
      let self = this
      self.userDialogTable.pagingInfo.pageSize = val
      self.userDialogTable.pagingInfo.currentPage = 1
      self.getAvailableUsers()
    },
    userDialogPaginationOnCurrentPageChange: function (val) {
      let self = this
      self.userDialogTable.pagingInfo.currentPage = val
      self.getAvailableUsers()
    },
    // dialog取消按钮事件 和 ‘X'
    closeDetailDialog: function () {
      let self = this
      self.userGroupDialog.props.visible = false
      self.userGroupDialog.isCreate = false
      self.userGroupDialog.model = {}
      self.$refs['userGroupDialog.model'].clearValidate()
    },
    closeUserDialog: function () {
      let self = this
      self.userDialog.props.visible = false
      self.userDialog.query.telephone = ''
      self.userDialogTable.data = []
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
        api.delUserGroup({
          data: [row.id],
          success: function (res) {
            self.$message.success('删除成功')
            self.userGroupTable.pagingInfo.currentPage = 1
            self.getUserGroup(true)
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
      let thisObj = self.userGroupDialog.model
      console.log(thisObj)
      self.$confirm('是否保存当前修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$refs['userGroupDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            // 修改记录
            api.updateUserGroup({
              data: {
                name: thisObj.groupName,
                recVer: thisObj.recVer,
                companyId: thisObj.companyId,
                systemId: thisObj.systemId,
                id: thisObj.id
              },
              success: function (res) {
                self.$message.success('修改成功')
                self.userGroupTable.pagingInfo.currentPage = 1
                self.closeDetailDialog()
                self.getUserGroup(true)
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
    showUserGroupAdd: function () {
      let self = this
      self.userGroupDialog.isCreate = true
      self.userGroupDialog.isMod = false
      self.userGroupDialog.props.title = '新增用户组'
      self.userGroupDialog.props.visible = true
      self.userGroupDialog.model = {
        groupName: '',
        companyId: self.userGroupQuery.company.companyId,
        systemId: self.userGroupQuery.system.systemId
      }
    },
    showUserAddToGroup: function () {
      let self = this
      if (self.userTable.groupId) {
        self.userDialog.props.visible = true
      } else {
        self.$message.warning('未点击左侧用户组')
      }
    },
    // 新增用户组
    createRecord: function () {
      let self = this
      self.$confirm('是否创建当前记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 创建记录
        self.$refs['userGroupDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            console.log(self.userGroupDialog.model)
            api.addUserGroup({
              data: {
                companyId: self.userGroupDialog.model.companyId,
                name: self.userGroupDialog.model.groupName,
                systemId: self.userGroupDialog.model.systemId
              },
              success: function (res) {
                console.log('success')
                console.log(res)
                self.$message.success('创建成功')
                self.userGroupTable.pagingInfo.currentPage = 1
                self.userGroupDialog.isCreate = false
                self.closeDetailDialog()
                self.getUserGroup(true)
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
    batchDeleteGroup: function () {
      let self = this
      if (!self.userGroupTable.groupIds.length) {
        self.$message.warning('未选中用户组')
      } else {
        self.$confirm('是否要执行批量删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除记录
          api.batchDeleteGroup({
            data: [...self.userGroupTable.groupIds],
            success: function (res) {
              self.$message.success('删除成功！')
              self.userGroupTable.pagingInfo.currentPage = 1
              self.getUserGroup(true)
            },
            fail: function (res) {
              self.$message.error(res.data.message)
            }
          })
        }).catch(() => {
        })
      }
    },
    addUserToGroup: function () {
      let self = this
      api.addUserToGroup({
        data: {
          userId: self.userDialogTable.selectedUserIds[0], // 目前新增用户还不支持批量，所以传递单个id，后期为整个ids数组
          groupId: self.userTable.groupId
        },
        success: function (res) {
          console.log(res.data)
          self.$message.success('添加成功')
          self.userDialog.props.visible = false
          self.getUserByGroup(true)
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    // 用户删除和批量删除
    batchDeleteUsersFromGroup: function (row) {
      let self = this
      if (!self.userTable.userIds.length) {
        self.$message.warning('未选中用户')
      } else {
        self.$confirm('是否要执行批量删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 删除记录
          api.deleteUserFromGroup({
            data: {
              groupId: self.userTable.groupId,
              userIds: self.userTable.userIds
            },
            success: function (res) {
              self.$message.success('删除成功！')
              self.userTable.pagingInfo.currentPage = 1
              self.getUserByGroup(true)
            },
            fail: function (res) {
              self.$message.error(res.data.message)
            }
          })
        }).catch(() => {
        })
      }
    },
    // 重置查询条件
    cleanQuery: function () {
      let self = this
      self.userGroupQuery = {
        column: {
          name: '',
          dataRange: ''
        }
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.userGroupQuery
      if (query.company.companyId && query.system.systemId) {
        self.getUserGroup(true)
      } else {
        self.$message.error('未选择公司或系统')
      }
    },
    searchUser: function () {
      let self = this
      if (!self.userDialog.query.telephone.trim()) {
        this.$message.warning('未输入正确的手机号')
      } else {
        self.userDialogTable.isLoading = true
        self.getAvailableUsers()
      }
    },
    getSelectedUsers: function (val) {
      let self = this
      let selectedUsers = val.slice()
      self.userDialogTable.selectedUserIds = selectedUsers.map(user => user.id)
      console.log(self.userDialogTable.selectedUserIds)
    },
    getSelectedGroups: function (val) {
      let self = this
      let selectedGroups = val.slice()
      self.userGroupTable.groupIds = selectedGroups.map(group => group.id)
      console.log(self.userGroupTable.groupIds)
    },
    getSelectedUsersInGroup: function (val) {
      let self = this
      let selectedUsersInGroup = val.slice()
      self.userTable.userIds = selectedUsersInGroup.map(user => user.id)
      console.log(self.userTable.userIds)
    },
    handleCurrentChange: function (cRow) {
      let self = this
      self.userTable.groupId = cRow.id
      self.userTable.isLoading = true
      self.getUserByGroup(true)
    },
    // 权限相关操作
    showModAuthorization: function (row) {
      let self = this
      if (!self.userGroupTable.groupIds.length) {
        self.$message.warning('未选中用户组')
      } else if (self.userGroupTable.groupIds.length > 1) {
        self.$message.warning('请只选择一个用户组')
      } else {
        apiMenu.getMenuBySystemId({
          data: {
            systemId: self.userGroupQuery.system.systemId
          },
          success: function (res) {
            console.log(res.data.data)
            self.authorizationAddDialog.data = res.data.data
            self.setCheckdMenus()
          },
          fail: function (err) {
            console.log(err)
            self.$message.error(err.data.message)
          }
        })
        self.authorizationAddDialog.props.visible = true
      }
    },
    closeAuthorizationDialog: function () {
      let self = this
      self.authorizationAddDialog.props.visible = false
    },
    updateGroupMenus: function () {
      let self = this
      let menuIds = []
      let checkedNodes = []
      console.log(self.$refs['menuTree'].getCheckedNodes(true))
      checkedNodes = self.$refs['menuTree'].getCheckedNodes(true) || []
      if (checkedNodes.length > 1) {
        checkedNodes.forEach(item => {
          menuIds.push(item.id)
        })
      }
      api.updateGroupMenus({
        data: {
          groupId: self.userGroupTable.groupIds[0],
          menuIds
        },
        success: function (res) {
          console.log(res.data)
          self.$message.success('修改成功!')
          self.authorizationAddDialog.props.visible = false
          self.authorizationAddDialog.data = []
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        }
      })
    },
    setCheckdMenus: function () {
      let self = this
      api.getGroupMenus({
        data: {
          groupId: self.userGroupTable.groupIds[0]
        },
        success: function (res) {
          console.log(res.data.data)
          let menuIds = res.data.data.map(menu => menu.menuId)
          self.$refs['menuTree'].setCheckedKeys(menuIds)
        }
      })
    }
  },

  created: function () {
    let self = this
    self.getCompany()
  }
}
</script>

<style lang="scss" scoped>
</style>
