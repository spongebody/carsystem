<template>
  <div class="com-page-flex-wrp half-wrp">
    <div class="com-page">
      <el-form class="com-form" ref="form" size="mini">
        <div class="com-pannel-wrp">
          <div class="com-pannel">
            <el-row class="search-row">
              <el-col :xs="24" :sm="24" :md="12" :lg="8">
                <el-form-item label="公司：" label-width="100px" prop="companyCode">
                  <el-select
                    v-model="deptQuery.company.companyId"
                    filterable
                    placeholder="请选择公司"
                    clearable
                    @change="changeCompany"
                  >
                    <el-option
                      v-for="item in deptQuery.company.companyList"
                      :key="item.id"
                      :label="item.companyName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8">
                <el-form-item label="系统：" label-width="100px" prop="sysCode" v-show="deptQuery.company.companyId"
                >
                  <el-select
                    v-model="deptQuery.system.systemId"
                    filterable
                    placeholder="请选择业务系统"
                    clearable
                    @focus="getSystem"
                    @change="changeSystem"
                  >
                    <el-option
                      v-for="item in deptQuery.system.systemList"
                      :key="item.id"
                      :label="item.systemName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="12" :lg="8">
                <el-form-item label="上级部门：" label-width="100px" prop="" v-show="deptQuery.system.systemId">
                  <el-select
                    v-model="deptQuery.parent.parentId"
                    filterable
                    placeholder="请选择上级部门"
                    clearable
                    @focus="getPDept"
                    @change="changePDept"
                  >
                    <el-option
                      v-for="item in deptQuery.parent.parentList"
                      :key="item.id"
                      :label="item.deptName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div class="com-pannel">
            <el-row class="search-row">
              <el-col :xs="24" :sm="24" :md="12" :lg="8">
                <el-form-item label="部门名称：" label-width="100px">
                  <el-input placeholder="请输入部门名称" v-model="deptQuery.column.deptName"></el-input>
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
            <strong>部门数据</strong>
            <ul>
              <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
              </li>
            </ul>
          </div>
          <div class="com-table-detail">
            <el-table
              v-loading="deptTable.isLoading"
              :data="deptTable.data"
              header-row-class-name="com-table-header"
              header-cell-class-name="com-table-header-cell"
              border
              :max-height="maxHeight"
              ref="table"
              style="width: 100%;"
              highlight-current-row
              @current-change="handleCurrentChange"
            >
              <el-table-column fixed label="序号" width="50" align="center">
                <template slot-scope="scope">
                  <span>{{ (deptTable.pagingInfo.currentPage - 1) * deptTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="部门id"
                show-overflow-tooltip
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="deptName"
                label="部门名称"
                show-overflow-tooltip
                width="100"
              >
              </el-table-column>
              <el-table-column
                prop="parentName"
                label="上级部门"
                show-overflow-tooltip
                width="100"
              >
              </el-table-column>
              <el-table-column
                prop="leader"
                label="部门领导人"
                show-overflow-tooltip
                width="100"
              >
              </el-table-column>
              <el-table-column
                prop="telephone"
                label="部门电话"
                show-overflow-tooltip
                width="140"
              >
              </el-table-column>
              <el-table-column
                prop="status"
                label="是否启用"
                show-overflow-tooltip
                width="100"
              >
                <template slot-scope="scope">
                  {{ parseInt(scope.row.status, 10) ? '是' : '否' }}
                </template>
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
              :current-page="deptTable.pagingInfo.currentPage"
              :page-sizes="[10, 30, 50]"
              :page-size="deptTable.pagingInfo.pageSize"
              :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
              :total="deptTable.pagingInfo.totalRows">
            </el-pagination>
          </div>
        </div>
      </el-form>
      <el-dialog :title="deptDialog.props.title" :visible.sync="deptDialog.props.visible"
                 :close-on-click-modal="false" @close="closeDetailDialog">
        <div class="com-dialog-s-title">基础数据</div>
        <el-form class="com-form" ref="deptDialog.model" :model="deptDialog.model" size="mini" :rules="deptDialog.rules">
          <div class="com-pannel">
            <el-col :span="8">
              <el-form-item label-width="106px" label="公司：" prop="companyId">
                <el-select
                  v-model="deptDialog.model.companyId"
                  collapse-tags
                  placeholder="请选择关联公司"
                  clearable
                  :disabled="!deptDialog.isMod && !deptDialog.isCreate"
                  @change="changeCompany">
                  <el-option
                    v-for="item in deptDialog.extends.companyList"
                    :key="item.id"
                    :label="item.companyName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="106px" label="业务系统：" prop="systemId" v-show="deptDialog.model.companyId">
                <el-select
                  v-model="deptDialog.model.systemId"
                  collapse-tags
                  :disabled="!deptDialog.isMod && !deptDialog.isCreate"
                  placeholder="请选择业务系统"
                  clearable
                  @focus="getSystem"
                  @change="changeSystem"
                >
                  <el-option
                    v-for="item in deptDialog.extends.systemList"
                    :key="item.id"
                    :label="item.systemName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="106px" label="上级部门：" prop="parentId" v-show="deptDialog.model.systemId">
                <el-select
                  v-model="deptDialog.model.parentId"
                  collapse-tags
                  placeholder="请选择上级部门"
                  clearable
                  @focus="getPDept"
                  @change="changePDept"
                  :disabled="!deptDialog.isMod && !deptDialog.isCreate"
                >
                  <el-option
                    v-for="item in deptDialog.extends.parentList"
                    :key="item.id"
                    :label="item.deptName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>

          </div>
          <div class="com-pannel">
            <el-col :span="12">
              <el-form-item label-width="106px" label="部门名称：" prop="deptName">
                <el-input v-model="deptDialog.model.deptName" placeholder="请输入部门名称" :disabled="!deptDialog.isMod && !deptDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="106px" :disabled="!deptDialog.isMod && !deptDialog.isCreate" label="是否启用：" prop="status">
                <el-select
                  v-model="deptDialog.model.status"
                  collapse-tags
                  placeholder="请选择是否启用"
                  :disabled="!deptDialog.isMod && !deptDialog.isCreate"
                  clearable
                >
                  <el-option
                    v-for="item in deptDialog.extends.typeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel">
            <el-col :span="12">
              <el-form-item label-width="106px" label="部门领导人：" prop="leader">
                <el-input v-model="deptDialog.model.leader" placeholder="请输入部门领导人" :disabled="!deptDialog.isMod && !deptDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="106px" label="部门电话：" prop="telephone">
                <el-input v-model="deptDialog.model.telephone" placeholder="请输入部门电话" :disabled="!deptDialog.isMod && !deptDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" v-if="!deptDialog.isCreate">
            <el-col :span="12">
              <el-form-item label-width="106px" label="创建者：">
                <el-input v-model="deptDialog.model.creator" :disabled="true">

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="106px" label="创建时间：">
                <el-input v-model="deptDialog.model.createTime" :disabled="true">

                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" v-if="!deptDialog.isCreate">
            <el-col :span="12">
              <el-form-item label-width="106px" label="修改者：">
                <el-input v-model="deptDialog.model.modifier" :disabled="true">

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="106px" label="修改时间：">
                <el-input v-model="deptDialog.model.modifyTime" :disabled="true">

                </el-input>
              </el-form-item>
            </el-col>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="deptDialog.isMod || deptDialog.isCreate">
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button size="mini" type="primary" v-if="!deptDialog.isCreate" @click="modRecord">确定</el-button>
        <el-button size="mini" type="primary" v-if="deptDialog.isCreate" @click="createRecord">创建</el-button>
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
              @selection-change="getSelectedUsersInDept"
              @select-all="getSelectedUsersInDept">
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
                prop="deptName"
                label="所在部门"
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
                width="80"
                align="center"
                fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small"  @click="showUserMove(scope.row)">移动</el-button>
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
          <el-button size="mini" type="primary" @click="addUserToDept">添加</el-button>
        </span>
      </el-dialog>
      <el-dialog title="移动用户" :visible.sync="authorizationAddDialog.props.visible"
                 :close-on-click-modal="false" @close="closeAuthorizationDialog" @opened="opened">
        <div class="com-dialog-s-title">请选择部门</div>
        <el-tree
          :props="authorizationAddDialog.defaultProps"
          :data="authorizationAddDialog.data"
          node-key="id"
          ref="menuTree"
          show-checkbox
          @node-click="handleNodeClick"
          @check-change="handleCheckChange"
        >
        </el-tree>

        <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAuthorizationDialog">取消</el-button>
        <el-button size="mini" type="primary" @click="completeUserMove">确认 </el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/dept/apiMethod'
import apiCompany from '@api/company/apiMethod'
import apiUserGroup from '@api/usergroup/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'Dept',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      maxHeightRight: 1000,
      dataOp: [
        {
          text: '新增',
          method: 'showDeptAdd',
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
      deptQuery: {
        column: {
          deptName: '',
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
        },
        parent: {
          parentId: '',
          parentList: [
            { deptName: 'test', id: '123' }
          ]
        }
      },
      userQuery: {
        dataOp: [
          {
            text: '新增',
            method: 'showUserAddToDept',
            params: null
          }
        ],
        column: {}
      },
      deptTable: {
        isLoading: false,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      userTable: {
        deptId: '',
        userId: '', // 用于移动用户操作
        deptName: '',
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
      deptDialog: {
        isMod: false,
        isCreate: false,
        model: {},
        rules: {
          deptName: [
            {
              required: true,
              message: '请输入部门名称',
              trigger: 'blur'
            }
          ],
          companyId: [
            {
              required: true,
              message: '请选择公司',
              trigger: 'blur'
            }
          ],
          systemId: [
            {
              required: true,
              message: '请选择系统',
              trigger: 'blur'
            }
          ],
          leader: [
            {
              required: true,
              message: '请输入部门领导人',
              trigger: 'blur'
            }
          ],
          parentId: [
            {
              required: true,
              message: '请选择上级部门',
              trigger: 'blur'
            }
          ],
          telephone: [
            {
              required: true,
              message: '请输入部门联系电话',
              trigger: 'blur'
            }
          ],
          status: [
            {
              required: true,
              message: '请选择是否可用',
              trigger: 'blur'
            }
          ]
        },
        extends: {
          companyList: [],
          systemList: [],
          typeList: [
            { name: '是', value: '1' },
            { name: '否', value: '0' }
          ],
          parentList: []
        },
        props: {
          title: '数据详情',
          visible: false
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
      defaultProps: {
        label: 'menuName',
        children: 'children'
      },
      authorizationAddDialog: {
        props: {
          visible: false
        },
        data: [],
        roleId: '',
        defaultProps: {
          label: 'deptName',
          children: 'children'
        }
      }
    }
  },
  created: function () {
    let self = this
    self.getCompany()
    self.getPDept()
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
    getDept: function (isRefresh) {
      let self = this
      let query = self.deptQuery
      const filterConds = [
        { fieldName: 'deptName', fieldValue: query.column.deptName, operator: 'likeStart' },
        { fieldName: 'companyId', fieldValue: query.company.companyId, operator: '=' },
        { fieldName: 'deptType', fieldValue: 2, operator: '=' },
        { fieldName: 'systemId', fieldValue: query.system.systemId, operator: '=' },
        { fieldName: 'parentId', fieldValue: query.parent.parentId, operator: '=' }
      ]
      if (isRefresh) {
        self.deptTable.pagingInfo.currentPage = 1
      }
      self.deptTable.isLoading = true

      api.getDept({
        data: {
          page: self.deptTable.pagingInfo.currentPage,
          pageSize: self.deptTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          self.deptTable.pagingInfo.totalRows = res.data.data.totalSize
          self.deptTable.data = res.data.data.records || []
          self.authorizationAddDialog.data = res.data.data.records || []
          console.log(res.data.data.records)
          self.deptTable.isLoading = false
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    getUserByDept: function (isRefresh) {
      let self = this
      self.userTable.isLoading = true
      if (isRefresh) {
        self.userTable.pagingInfo.currentPage = 1
      }
      apiUserGroup.searchUser({
        data: {
          page: self.userTable.pagingInfo.currentPage,
          pageSize: self.userTable.pagingInfo.pageSize,
          filterConds: [
            { fieldName: 'deptId', fieldValue: self.userTable.deptId, operator: '=' }
          ]
        },
        success: function (res) {
          console.log(res.data.data)
          let userTableData = res.data.data.records || []
          if (userTableData.length) {
            userTableData.forEach(user => {
              user.deptName = self.userTable.deptName
            })
          }
          self.userTable.data = userTableData
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
      apiUserGroup.searchUser({
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
    getCompany: function () {
      let self = this
      apiCompany.getCompanyByCurrentUser({
        data: {},
        success: function (res) {
          console.log(res.data.data)
          self.deptQuery.company.companyList = res.data.data
          self.deptDialog.extends.companyList = res.data.data
        }
      })
    },
    getPDept: function () {
      let self = this
      api.getPDept({
        data: {
          systemId: self.deptQuery.system.systemId
        },
        success: function (res) {
          console.log(res)
          self.deptQuery.parent.parentList = res.data.data
          self.deptDialog.extends.parentList = res.data.data
        }
      })
    },
    changePDept: function (val) {
      let self = this
      self.deptQuery.parent.parentId = val
      self.deptDialog.model.parentId = val
      self.getDept(true)
    },
    getSystem: function () {
      let self = this
      apiCompany.getSystemByCurrentUser({
        data: {
          companyId: self.deptQuery.company.companyId
        },
        success: function (res) {
          self.deptQuery.system.systemList = res.data.data
          self.deptDialog.extends.systemList = res.data.data
        }
      })
    },
    changeSystem: function (val) {
      let self = this
      self.deptDialog.model.systemId = val
      self.deptQuery.system.systemId = val
      self.deptQuery.parent.parentId = null
      self.deptDialog.model.parentId = null
      self.deptQuery.parent.parentList = []
      self.deptDialog.extends.parentList = []
      self.getDept(true)
    },
    changeCompany: function (val) {
      let self = this
      self.deptDialog.model.companyId = val
      self.deptQuery.company.companyId = val
      self.deptQuery.system.systemId = null
      self.deptDialog.model.systemId = null
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
        self.deptDialog.props.title = '修改数据'
        self.deptDialog.isMod = true
      } else {
        self.deptDialog.props.title = '数据详情'
        self.deptDialog.isMod = false
      }
      self.deptDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
      newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
      self.deptDialog.model = Object.assign({}, newObj)
      self.getCompany()
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.deptTable.pagingInfo.pageSize = val
      self.deptTable.pagingInfo.currentPage = 1
      self.getDept(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.deptTable.pagingInfo.currentPage = val
      self.getDept(false)
    },
    userPaginationOnSizeChange: function (val) {
      let self = this
      self.userTable.pagingInfo.pageSize = val
      self.userTable.pagingInfo.currentPage = 1
      self.getUserByDept(true)
    },
    userPaginationOnCurrentPageChange: function (val) {
      let self = this
      self.userDeptTable.pagingInfo.currentPage = val
      self.getUserByDept(false)
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
      self.deptDialog.props.visible = false
      self.deptDialog.isCreate = false
      self.deptDialog.model.data = ''
      self.$refs['deptDialog.model'].clearValidate()
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
        api.delDept({
          data: {
            id: row.id,
            recVer: row.recVer
          },
          success: function (res) {
            self.$message.success('删除成功')
            self.deptTable.pagingInfo.currentPage = 1
            self.getDept(true)
          },
          fail: function (res) {
            self.$message.error(res.data.message)
          }
        })
      }).catch(() => {
      })
    },
    // 确认修改
    modRecord: function () {
      let self = this
      let thisObj = self.deptDialog.model
      self.$confirm('是否保存当前修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$refs['deptDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            // 修改记录
            api.updateDept({
              data: {
                ...self.deptDialog.model
              },
              success: function (res) {
                self.$message.success('修改成功')
                self.deptTable.pagingInfo.currentPage = 1
                self.closeDetailDialog()
                self.getDept(true)
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
    showDeptAdd: function () {
      let self = this
      self.deptDialog.isCreate = true
      self.deptDialog.props.title = '新增记录'
      self.deptDialog.props.visible = true
      self.deptDialog.model = {
        deptName: '',
        companyId: self.deptQuery.company.companyId,
        systemId: self.deptQuery.system.systemId,
        parentId: self.deptQuery.parent.parentId
      }
    },
    showUserAddToDept: function () {
      let self = this
      if (self.userTable.deptId) {
        self.userDialog.props.visible = true
      } else {
        self.$message.warning('未点击左侧部门')
      }
    },
    // 确认新增
    createRecord: function () {
      let self = this
      let isValid = false
      self.$confirm('是否创建当前记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 创建记录
        self.$refs['deptDialog.model'].validate((valid) => {
          if (!self.deptDialog.model.roleType && (!self.deptDialog.model.companyId || !self.deptDialog.model.systemId)) {
            isValid = true
          }
          if (!valid || isValid) {
            self.$message.error('请完善表单')
          } else {
            // 判断是否为平台角色，确保平台角色不绑定公司 系统
            console.log(self.deptDialog.model)
            api.addDept({
              data: {
                ...self.deptDialog.model,
                deptType: 2
              },
              success: function (res) {
                console.log(res)
                self.$message.success('创建成功')
                self.deptTable.pagingInfo.currentPage = 1
                self.deptDialog.isCreate = false
                self.closeDetailDialog()
                self.getDept(true)
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
    addUserToDept: function () {
      let self = this
      console.log(self.userDialogTable.selectedUserIds)
      api.addUserToDept({
        data: {
          userIdSet: self.userDialogTable.selectedUserIds, // 目前新增用户还不支持批量，所以传递单个id，后期为整个ids数组
          deptId: self.userTable.deptId
        },
        success: function (res) {
          console.log(res.data)
          self.$message.success('添加成功')
          self.userDialog.props.visible = false
          self.getUserByDept(true)
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    // 重置查询条件
    cleanQuery: function () {
      let self = this
      self.deptQuery.column = {
        deptName: '',
        roleType: '',
        dataRange: ''
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.deptQuery
      if (query.company.companyId && query.system.systemId) {
        self.getDept(true)
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
    getSelectedUsersInDept: function (val) {
      let self = this
      let selectedUsersInDept = val.slice()
      self.userTable.userIds = selectedUsersInDept.map(user => user.id)
      console.log(self.userTable.userIds)
    },
    handleCurrentChange: function (cRow) {
      let self = this
      self.userTable.deptId = cRow.id
      self.userTable.deptName = cRow.deptName
      self.userTable.isLoading = true
      self.getUserByDept(true)
    },
    showUserMove: function (row) {
      let self = this
      self.userTable.userId = row.id
      self.authorizationAddDialog.props.visible = true
      // self.setCheckdDept()
    },
    opened: function () {
      let self = this
      self.setCheckdDept()
    },
    closeAuthorizationDialog: function () {
      let self = this
      self.authorizationAddDialog.props.visible = false
    },
    completeUserMove: function () {
      let self = this
      // debugger
      let deptIds = self.$refs['menuTree'].getCheckedKeys() || []
      if (!deptIds.length) {
        self.$message.warning('未选中部门')
      } else {
        api.addUserToDept({
          data: {
            userIdSet: [self.userTable.userId],
            deptId: deptIds[0],
            isEdit: true
          },
          success: function (res) {
            console.log(res.data)
            self.$message.success('移动成功!')
            self.authorizationAddDialog.props.visible = false
            // self.authorizationAddDialog.data = []
            self.getUserByDept(true)
          },
          fail: function (err) {
            console.log(err)
            self.$message.error(err.data.message)
          }
        })
      }
    },
    setCheckdDept: function () {
      let self = this
      self.$refs['menuTree'].setCheckedKeys([self.userTable.deptId])
    },
    handleNodeClick: function (item) {
      let self = this
      self.authorizationAddDialog.editCheckId = item.id
      self.$refs['menuTree'].setCheckedKeys([item.id])
    },
    handleCheckChange: function (item, node) {
      let self = this
      if (node === true) { // 点击未选中的
        self.authorizationAddDialog.editCheckId = item.id
        self.$refs['menuTree'].setCheckedKeys([item.id])
      } else {
        if (self.authorizationAddDialog.editCheckId === item.id) {
          self.$refs['menuTree'].setCheckedKeys([])
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
