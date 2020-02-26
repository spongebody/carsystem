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
                    v-model="menuQuery.company.companyId"
                    filterable
                    placeholder="请选择公司"
                    clearable
                    @change="changeCompany"
                  >
                    <el-option
                      v-for="item in menuQuery.company.companyList"
                      :key="item.id"
                      :label="item.companyName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="8">
                <el-form-item label="系统：" label-width="100px" prop="sysCode" v-show="menuQuery.company.companyId"
                >
                  <el-select
                    v-model="menuQuery.system.systemId"
                    filterable
                    placeholder="请选择业务系统"
                    clearable
                    @focus="getSystem"
                    @change="changeSystem"
                  >
                    <el-option
                      v-for="item in menuQuery.system.systemList"
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
            <el-form-item label="菜单名：" label-width="100px" prop="companyCode">
                <el-input
                  class="filterInput"
                  placeholder="请输入菜单名进行过滤"
                  clearable
                  v-model="filterText">
                </el-input>
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
            <strong>菜单</strong>
            <ul>
              <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in pMenuDataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
              </li>
            </ul>
          </div>
          <div class="com-table-detail">
            <el-tree
              :props="defaultProps"
              :data="menuTree.data"
              @node-click="handleNodeClick"
              ref="menuTree"
              show-checkbox
              :filter-node-method="filterNode"
            >
            </el-tree>
          </div>
        </div>
      </el-form>
    </div>
    <div class="com-page">
      <el-form class="com-form" ref="form" size="mini" label-width="110px">
        <div class="com-table">
          <div class="table-header clear">
            <strong>{{ menuTable.title }}</strong>
            <ul>
              <li :class="[index % 2 === 0 ? 'double' : 'single']" v-show="index === 0 ? menuDialog.isShowAddMenu : menuDialog.isCanBindButton"
                  v-for="(item, index) in childMenuDataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
              </li>
            </ul>
          </div>
          <div class="com-table-detail">
            <el-table
              v-loading="menuTable.isLoading"
              :data="menuTable.data"
              header-row-class-name="com-table-header"
              header-cell-class-name="com-table-header-cell"
              border
              :max-height="maxHeight"
              ref="table"
              style="width: 100%;">
              <el-table-column fixed label="序号" width="50" align="center">
                <template slot-scope="scope">
                  <span>{{ (menuTable.pagingInfo.currentPage - 1) * menuTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="id"
                label="菜单id"
                show-overflow-tooltip
                width="180"
              >
              </el-table-column>
              <el-table-column
                prop="menuName"
                label="菜单名称"
                show-overflow-tooltip
                width="120"
              >
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
                label="所属系统"
                show-overflow-tooltip
                width="120"
              >
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
                prop="router"
                label="路由"
                show-overflow-tooltip
                width="120"
              >
              </el-table-column>
              <el-table-column
                label="操作"
                width="180"
                align="center"
                fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small"  @click="showDetail(scope.row, false)">查看</el-button>
                  <el-button type="text" size="small"  @click="showDetail(scope.row, true)">修改</el-button>
                  <el-button type="text" size="small"  @click="delRecord(scope.row)">删除</el-button>
                  <el-button type="text" size="small"  @click="toButtonPage(scope.row)">按钮管理</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="com-pagination">
            <el-pagination
              @size-change="paginationOnSizeChange"
              @current-change="paginationOnCurrentPageChange"
              :current-page="menuTable.pagingInfo.currentPage"
              :page-sizes="[10, 30, 50]"
              :page-size="menuTable.pagingInfo.pageSize"
              :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
              :total="menuTable.pagingInfo.totalRows">
            </el-pagination>
          </div>
        </div>
      </el-form>
      <el-dialog :title="menuDialog.props.title" :visible.sync="menuDialog.props.visible"
                 :close-on-click-modal="false" @close="closeDetailDialog">
        <div class="com-dialog-s-title">基础数据</div>
        <el-form class="com-form" ref="menuDialog.model" :model="menuDialog.model" size="mini" :rules="menuDialog.rules">
          <div class="com-pannel">
            <el-col :span="12">
              <el-form-item label-width="100px" :label="menuDialog.isShowAddMenuButtonDialog ? '按钮名称：' : '菜单名称：'" prop="menuName">
                <el-input v-model="menuDialog.model.menuName" :placeholder="menuDialog.isShowAddMenuButtonDialog ? '请输入按钮名称' : '请输入菜单名称'"
                          :disabled="!menuDialog.isMod && !menuDialog.isCreate"
                >
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="100px" :label="menuDialog.isShowAddMenuButtonDialog ? '绑定菜单：' : '上级菜单：'" prop="">
                <el-input v-model="pMenuName" disabled=true>
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div v-if="!menuDialog.isShowAddMenuButtonDialog">
            <div class="com-pannel">
              <el-col :span="12">
                <el-form-item label-width="100px" label="链接：" prop="">
                  <el-input v-model="menuDialog.model.dataUrl" placeholder="请输入菜单链接" :disabled="!menuDialog.isMod && !menuDialog.isCreate">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="100px" label="路由地址：" prop="router">
                  <el-input v-model="menuDialog.model.router" placeholder="请输入路由地址" :disabled="menuDialog.isShowPMenu || (!menuDialog.isMod && !menuDialog.isCreate)">
                  </el-input>
                </el-form-item>
              </el-col>
            </div>
            <div class="com-pannel">
              <el-col :span="12">
                <el-form-item label-width="100px" label="顺序：" prop="seq">
                  <el-input v-model="menuDialog.model.seq" placeholder="请输入菜单的顺序号" :disabled="!menuDialog.isMod && !menuDialog.isCreate">
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="100px" label="图标：" >
                  <el-input v-model="menuDialog.model.icon" placeholder="请输入菜单图标名" :disabled="!menuDialog.isMod && !menuDialog.isCreate">
                  </el-input>
                </el-form-item>
              </el-col>
            </div>
            <div class="com-pannel">
              <el-col :span="12">
                <el-form-item label-width="100px" label="公司：" prop="companyId" v-if="!menuDialog.isCreate">
                  <el-select
                    v-model="menuDialog.model.companyId "
                    placeholder="请选择公司"
                    filterable
                    disabled=true
                    clearable
                    @change="changeCompany"
                  >
                    <el-option
                      v-for="item in menuDialog.extends.companyList"
                      :key="item.id"
                      :label="item.companyName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="menuDialog.model.companyId">
                <el-form-item label-width="100px" label="业务系统：" prop="systemId" v-if="!menuDialog.isCreate">
                  <el-select
                    v-model="menuDialog.model.systemId"
                    filterable
                    placeholder="请选择业务系统"
                    disabled=true
                    clearable
                    @focus="getSystem"
                    @change="changeSystem"
                  >
                    <el-option
                      v-for="item in menuDialog.extends.systemList"
                      :key="item.id"
                      :label="item.systemName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </div>
            <div class="com-pannel" v-if="!menuDialog.isCreate">
              <el-col :span="12">
                <el-form-item label-width="100px" label="创建者：">
                  <el-input v-model="menuDialog.model.creator" disabled=true>

                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label-width="100px" label="创建时间：">
                  <el-input v-model="menuDialog.model.createTime" disabled=true>

                  </el-input>
                </el-form-item>
              </el-col>
            </div>
            <div class="com-pannel" v-if="!menuDialog.isCreate">
            <el-col :span="12">
              <el-form-item label-width="100px" label="修改者：">
                <el-input v-model="menuDialog.model.modifier" disabled=true>

                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="100px" label="修改时间：">
                <el-input v-model="menuDialog.model.modifyTime" disabled=true>

                </el-input>
              </el-form-item>
            </el-col>
          </div>
          </div>
        </el-form>
        <span slot="footer" class="dialog-footer" v-if="menuDialog.isMod || menuDialog.isCreate">
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button size="mini" type="primary" v-if="!menuDialog.isCreate" @click="modRecord">确定</el-button>
        <el-button size="mini" type="primary" v-if="menuDialog.isCreate && !menuDialog.isShowAddMenuButtonDialog" @click="createRecord">创建</el-button>
        <el-button size="mini" type="primary" v-if="menuDialog.isCreate && menuDialog.isShowAddMenuButtonDialog" @click="addButtonToMenu">添加</el-button>

      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/menu/apiMethod'
import apiCompany from '@api/company/apiMethod'
import apiButton from '@api/button/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'Menu',
  extends: Base,
  data () {
    let self = this
    let validateRouter = (rule, value, callback) => {
      if (self.menuDialog.isShowPMenu) {
        callback()
      } else {
        if (!value) {
          console.log(11)
          callback(new Error('请输入路由地址'))
        } else {
          callback()
        }
      }
    }
    return {
      maxHeight: 1000,
      childMenuDataOp: [
        {
          text: '新增菜单',
          method: 'showMenuAdd',
          params: 'test'
        },
        {
          text: '新增权限按钮',
          method: 'showMenuButtonAdd',
          params: 'test'
        }
      ],
      pMenuDataOp: [
        {
          text: '新增一级菜单',
          method: 'showPMenuAdd',
          params: ''
        },
        {
          text: '修改一级菜单',
          method: 'showUpdatePMenu',
          params: null
        },
        {
          text: '批量删除',
          method: 'btlDelPMenu',
          params: null
        }
      ],
      // 条件查询字段
      menuQuery: {
        column: {
          menuValue: '',
          menuType: '',
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
      menuTable: {
        isLoading: false,
        title: '菜单信息',
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      menuDialog: {
        isMod: false,
        isCreate: false,
        isCanBindButton: false, // 是否显示新增按钮
        isShowAddMenu: false, // 是否显示新增
        isShowAddMenuButtonDialog: false, // 是否只显示名称 菜单字段
        model: {},
        rules: {
          menuName: [
            {
              required: true,
              message: '请输入菜单名',
              trigger: 'blur'
            }
          ],
          companyId: [
            {
              required: true,
              message: '请选择关联公司',
              trigger: 'blur'
            }
          ],
          systemId: [
            {
              required: true,
              message: '请选择关联系统',
              trigger: 'blur'
            }
          ],
          router: [
            {
              validator: validateRouter,
              trigger: 'blur'
            }
          ],
          seq: [
            {
              required: true,
              message: '请输入菜单顺序号（数字）',
              trigger: 'blur'
            }
          ]
        },
        extends: {
          companyList: [],
          systemList: []
        },
        pMenu: {
          menuName: '',
          id: ''
        },
        props: {
          title: '数据详情',
          visible: false
        },
        isShowPMenu: false
      },
      defaultProps: {
        label: 'menuName',
        children: 'children'
      },
      menuTree: {
        data: []
      },
      filterText: ''
    }
  },
  created: function () {
    let self = this
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
    ...mapGetters([
      'isMobile'
    ]),
    pMenuName () {
      let pMenu = this.menuDialog.pMenu
      return this.menuDialog.isShowPMenu ? '无' : pMenu ? pMenu.menuName : ''
    }
    /*    pMenuName () {
      return this.menuDialog.isShowPMenu ? '无' : this.menuDialog.pMenu.menuName
    },
    router () {
      return this.menuDialog.isShowPMenu ? '无' : this.menuDialog.model.router
    } */
  },
  watch: {
    filterText (val) {
      this.$refs.menuTree.filter(val)
    }
  },
  methods: {
    getMenuTable: function (isRefresh) {
      let self = this
      const filterConds = [
        { fieldName: 'parentId', fieldValue: self.menuDialog.pMenu.id, operator: '=' }
      ]
      if (isRefresh) {
        self.menuTable.pagingInfo.currentPage = 1
      }
      self.menuTable.isLoading = true
      api.getMenu({
        data: {
          page: self.menuTable.pagingInfo.currentPage,
          pageSize: self.menuTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          self.menuTable.pagingInfo.totalRows = res.data.data.totalSize
          self.menuTable.data = res.data.data.records || []
          console.log(res.data.data.records)
          self.menuTable.isLoading = false
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    getMenuTree: function () {
      let self = this
      api.getMenuBySystemId({
        data: {
          systemId: self.menuQuery.system.systemId
        },
        success: function (res) {
          let menuList = res.data.data.slice()
          console.log(res.data.data)
          self.menuTree.data = menuList.slice()
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        }
      })
    },
    getButton: function () {
      let self = this
      const filterConds = [
        { fieldName: 'menuId', fieldValue: self.menuDialog.pMenu.id, operator: '=' }
      ]
      apiButton.getButton({
        data: {
          page: 1,
          pageSize: 10,
          filterConds: filterConds
        },
        success: function (res) {
          return res.data.data.records
        },
        fail: function (err) {
          return err.data.message
        }
      })
    },
    checkIsBindButton: function (menuId) {
      const filterConds = [
        { fieldName: 'menuId', fieldValue: menuId, operator: '=' }
      ]
      return new Promise((resolve, reject) => {
        apiButton.getButton({
          data: {
            page: 1,
            pageSize: 10,
            filterConds: filterConds
          },
          success: function (res) {
            let buttons = res.data.data.records
            if (!buttons) {
              resolve(false)
            } else {
              resolve(true)
            }
          },
          fail: function (err) {
            reject(err.data.message)
          }
        })
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
          self.menuQuery.company.companyList = res.data.data
          self.menuDialog.extends.companyList = res.data.data
        }
      })
    },
    getSystem: function () {
      let self = this
      apiCompany.getSystemByCurrentUser({
        data: {
          companyId: self.menuQuery.company.companyId
        },
        success: function (res) {
          self.menuQuery.system.systemList = res.data.data
          self.menuDialog.extends.systemList = res.data.data
        }
      })
    },
    changeSystem: function (val) {
      let self = this
      self.menuDialog.model.systemId = val
      self.menuQuery.system.systemId = val
      // 系统改变时右侧菜单表格应为空，点击菜单树才加载
      self.menuTable.data = []
      self.menuTable.title = '菜单信息'
      self.getMenuTree()
    },
    changeCompany: function (val) {
      let self = this
      self.menuDialog.model.companyId = val
      self.menuQuery.company.companyId = val
      self.menuQuery.system.systemId = null
      self.menuDialog.model.systemId = null
      // 公司改变时表格和菜单树应都为空
      self.menuTree.data = []
      self.menuTable.data = []
      self.getSystem()
    },
    // 查、看修改弹出框
    showDetail: function (row, isMod) {
      let self = this
      self.menuDialog.isShowAddMenuButtonDialog = false
      self.menuDialog.isShowPMenu = false
      if (isMod) {
        self.menuDialog.props.title = '修改数据'
        self.menuDialog.isMod = true
      } else {
        self.menuDialog.props.title = '数据详情'
        self.menuDialog.isMod = false
      }
      self.menuDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
      newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
      self.menuDialog.model = Object.assign({}, newObj)
    },
    showUpdatePMenu: function () {
      let self = this
      let checkedNodes = self.$refs['menuTree'].getCheckedNodes(false).slice()
      let pNodes = checkedNodes.filter(node => parseInt(node.parentId, 10) === 0)
      console.log(pNodes)
      if (!pNodes.length) {
        self.$message.warning('未选中一级菜单')
      } else if (pNodes.length > 1) {
        self.$message.warning('请只选中一个要修改的一级菜单')
      } else {
        self.menuDialog.props.title = '修改一级菜单'
        let newObj = Object.assign({}, pNodes[0])
        newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
        newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
        self.menuDialog.model = Object.assign({}, newObj)
        self.menuDialog.isMod = true
        self.menuDialog.isShowPMenu = true
        self.menuDialog.props.visible = true
      }
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.menuTable.pagingInfo.pageSize = val
      self.menuTable.pagingInfo.currentPage = 1
      self.getMenuTable(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.menuTable.pagingInfo.currentPage = val
      self.getMenuTable(true)
    },
    // dialog取消按钮事件 和 ‘X'
    closeDetailDialog: function () {
      let self = this
      self.menuDialog.props.visible = false
      self.menuDialog.isCreate = false
      self.menuDialog.model.data = ''
      self.$refs['menuDialog.model'].clearValidate()
    },
    // 删除记录
    delRecord: function (row) {
      console.log(row)
      let self = this
      self.$confirm('是否删除当前记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 删除记录
        api.delMenu({
          data: [row.id],
          success: function (res) {
            self.$message.success('删除成功')
            self.getMenuTree()
            self.getMenuTable(true)
          },
          fail: function (res) {
            self.$message.error(res.data.message)
          }
        }, row.id)
      }).catch(() => {
      })
    },
    btlDelPMenu: function () {
      let self = this
      self.$confirm('是否要批量删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let checkedNodes = self.$refs['menuTree'].getCheckedNodes(false).slice()
        if (!checkedNodes.length) {
          self.$message.warning('未选中菜单')
        } else {
          let menuIds = checkedNodes.map(menu => menu.id)
          api.delMenu({
            data: menuIds,
            success: function (res) {
              self.$message.success('删除成功')
              self.getMenuTree()
            },
            fail: function (res) {
              self.$message.error(res.data.message)
            }
          })
        }
      }).catch(() => {})
    },
    // 确认修改
    modRecord: function () {
      let self = this
      self.$confirm('是否保存当前修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$refs['menuDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            self.menuDialog.model.children = ''
            // 修改记录
            api.updateMenu({
              data: {
                ...self.menuDialog.model,
                menuTitle: self.menuDialog.model.menuName
              },
              success: function (res) {
                self.$message.success('修改成功')
                self.closeDetailDialog()
                self.getMenuTree()
                self.getMenuTable(true)
              },
              fail: function (res) {
                self.$message.error(res.data.message)
              }
            })
          }
        })
      }).catch(() => {
      })
    },
    // 新增弹出dialog
    showMenuAdd: async function () {
      let self = this
      let isBindButton = await self.checkIsBindButton(self.menuDialog.pMenu.id)
      if (isBindButton) {
        self.$message.warning('该菜单已经绑定权限按钮，不能新增下级菜单！')
      } else {
        self.menuDialog.isShowAddMenuButtonDialog = false
        self.menuDialog.isCreate = true
        self.menuDialog.isShowPMenu = false
        self.menuDialog.props.title = '新增菜单'
        self.menuDialog.props.visible = true
        self.menuDialog.model = {
          menuName: '',
          companyId: self.menuQuery.company.companyId,
          systemId: self.menuQuery.system.systemId
        }
      }
    },
    showMenuButtonAdd: function () {
      let self = this
      self.menuDialog.isCreate = true
      self.menuDialog.isShowPMenu = false
      self.menuDialog.isShowAddMenuButtonDialog = true
      self.menuDialog.props.title = '新增按钮'
      self.menuDialog.props.visible = true
      self.menuDialog.model = {
        menuName: ''
      }
    },
    showPMenuAdd: function () {
      let self = this
      self.menuDialog.isShowAddMenuButtonDialog = false
      self.menuDialog.isCreate = true
      self.menuDialog.isShowPMenu = true
      self.menuDialog.props.title = '新增记录'
      self.menuDialog.props.visible = true
      self.menuDialog.model = {
        menuName: '',
        companyId: self.menuQuery.company.companyId,
        systemId: self.menuQuery.system.systemId
      }
      console.log(self.menuDialog.model)
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
        self.$refs['menuDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            api.addMenu({
              data: {
                ...self.menuDialog.model,
                parentId: self.menuDialog.isShowPMenu ? 0 : self.menuDialog.pMenu.id,
                menuTitle: self.menuDialog.model.menuName
              },
              success: function (res) {
                console.log(res)
                self.$message.success('创建成功')
                self.menuDialog.isCreate = false
                self.closeDetailDialog()
                self.getMenuTree()
                self.getMenuTable(true)
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
    addButtonToMenu: function () {
      let self = this
      self
        .$confirm('是否创建当前记录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          if (self.menuDialog.model.menuName.trim() === '') {
            self.$message.warning('请输入按钮名称')
          } else {
            apiButton.addButton({
              data: {
                buttonName: self.menuDialog.model.menuName, // 按钮菜单共用menuName
                menuId: self.menuDialog.pMenu.id
              },
              success: function (res) {
                console.log(res)
                self.$message.success('创建成功')
                self.menuDialog.props.visible = false
              },
              fail: function (res) {
                self.$message.error(res.data.message)
              }
            })
          }
          // 创建记录
          /* self.$refs['buttonDialog.model'].validate(valid => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              api.addButton({
                data: {
                  buttonName: self.buttonDialog.model.buttonName,
                  menuId: self.buttonDialog.model.menuId
                },
                success: function (res) {
                  console.log(res)
                  self.$message.success('创建成功')
                  self.buttonTable.pagingInfo.currentPage = 1
                  self.buttonDialog.isCreate = false
                  self.closeDetailDialog()
                  self.getButton(true)
                },
                fail: function (res) {
                  console.log(res)
                  self.$message.error(res.data.message)
                }
              })
            }
          }) */
        })
        .catch(() => {})
    },
    // 重置查询条件
    cleanQuery: function () {
      let self = this
      self.menuQuery = {
        column: {
          menuValue: '',
          menuType: '',
          dataRange: ''
        }
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.menuQuery
      if (query.company.companyId && query.system.systemId) {
        self.getMenuTree()
      } else {
        self.$message.error('未选择公司或系统')
      }
    },
    handleNodeClick: function (node, treeNode) {
      let self = this
      console.log(treeNode)
      /*      if (treeNode.level === 1) {
        self.menuDialog.pMenu = node
        self.menuDialog.isCanBindButton = false
        self.menuDialog.isShowAddMenuButton = false
      } */
      self.menuTable.title = node.menuName
      if (treeNode.level === 3) {
        self.menuDialog.pMenu = node
        self.getMenuTable(true)
        self.menuDialog.isCanBindButton = true
        self.menuDialog.isShowAddMenu = false
      } else if (treeNode.level === 2 && !node.children) {
        self.menuTable.isLoading = true
        self.menuDialog.pMenu = node
        self.getMenuTable(true)
        self.menuDialog.isCanBindButton = true
        self.menuDialog.isShowAddMenu = true
        self.menuTable.isLoading = false
      } else {
        self.menuTable.isLoading = true
        self.menuDialog.pMenu = node
        self.menuDialog.isCanBindButton = false
        self.menuDialog.isShowAddMenu = true
        self.getMenuTable(true)
        self.menuTable.isLoading = false
      }
      console.log(self.menuDialog.isCanBindButton)
      console.log(self.menuDialog.isShowAddMenuButtonDialog)
    },
    toButtonPage: function (row) {
      let self = this
      console.log(row)
      let params = {
        path: 'funcbutton/FuncButton',
        title: '权限按钮管理',
        params: {
          companyId: row.companyId,
          systemId: row.systemId,
          menuId: row.id
        }
      }
      self.$newpage({
        path: 'funcbutton/FuncButton',
        title: '权限按钮管理',
        params
      })
    },
    filterNode: function (value, data) {
      if (!value) return true
      return data.menuName.indexOf(value) !== -1
    }
  }
}
</script>

<style scoped lang="scss">

</style>
