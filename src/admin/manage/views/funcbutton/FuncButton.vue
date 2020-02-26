<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="24" :md="8" :lg="4">
              <el-form-item label="公司：" label-width="100px" prop="companyCode">
                <el-select
                  v-model="buttonQuery.company.companyId"
                  filterable
                  placeholder="请选择公司"
                  clearable
                  @change="changeCompany"
                >
                  <el-option
                    v-for="item in buttonQuery.company.companyList"
                    :key="item.id"
                    :label="item.companyName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="4">
              <el-form-item label="系统：" label-width="100px" prop="sysCode" v-show="buttonQuery.company.companyId"
              >
                <el-select
                  v-model="buttonQuery.system.systemId"
                  filterable
                  placeholder="请选择业务系统"
                  clearable
                  @focus="getSystem"
                  @change="changeSystem"
                >
                  <el-option
                    v-for="item in buttonQuery.system.systemList"
                    :key="item.id"
                    :label="item.systemName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="8" :lg="4">
              <el-form-item label-width="100px" label="绑定菜单：" prop="menuId"  v-show="buttonQuery.system.systemId">
                <el-select
                  v-model="buttonQuery.menu.menuId"
                  filterable
                  placeholder="请选择菜单"
                  @change="changeMenu"
                  clearable
                >
                  <el-option
                    v-for="item in buttonQuery.menu.menuList"
                    :key="item.id"
                    :label="item.menuName"
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
              <el-form-item label="按钮名称：" label-width="100px">
                <el-input
                  placeholder="请输入按钮名称"
                  v-model="buttonQuery.column.buttonName"
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
          <strong>权限按钮基础数据</strong>
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
            v-loading="buttonTable.isLoading"
            :data="buttonTable.data"
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
                  (buttonTable.pagingInfo.currentPage - 1) *
                    buttonTable.pagingInfo.pageSize +
                    scope.$index +
                    1
                }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="按钮id"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="buttonName"
              label="按钮名称"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="menuName"
              label="绑定菜单"
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
              align="center"
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
            :current-page="buttonTable.pagingInfo.currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="buttonTable.pagingInfo.pageSize"
            :layout="
              isMobile
                ? 'total, sizes, prev, pager, next'
                : 'total, sizes, prev, pager, next, jumper'
            "
            :total="buttonTable.pagingInfo.totalRows"
          >
          </el-pagination>
        </div>
      </div>
    </el-form>
    <el-dialog
      :title="buttonDialog.props.title"
      :visible.sync="buttonDialog.props.visible"
      :close-on-click-modal="false"
      @close="closeDetailDialog"
    >
      <div class="com-dialog-s-title">基础数据</div>
      <el-form
        class="com-form"
        ref="buttonDialog.model"
        :model="buttonDialog.model"
        size="mini"
        :rules="buttonDialog.rules"
      >
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="100px" label="按钮名称：" prop="buttonName">
              <el-input
                placeholder="请输入按钮名称"
                v-model="buttonDialog.model.buttonName"
                :disabled="!buttonDialog.isMod && !buttonDialog.isCreate"
                @keyup.enter.native="createRecord"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="100px" label="公司：" prop="">
              <el-select
                v-model="buttonDialog.model.companyId"
                collapse-tags
                placeholder="请选择关联公司"
                clearable
                :disabled="!buttonDialog.isMod && !buttonDialog.isCreate"
                @change="changeCompany">
                <el-option
                  v-for="item in buttonDialog.extends.companyList"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="100px" label="业务系统：" prop="" v-show="buttonDialog.model.companyId">
              <el-select
                v-model="buttonDialog.model.systemId"
                collapse-tags
                :disabled="!buttonDialog.isMod && !buttonDialog.isCreate"
                placeholder="请选择业务系统"
                clearable
                @focus="getSystem"
                @change="changeSystem"
              >
                <el-option
                  v-for="item in buttonDialog.extends.systemList"
                  :key="item.id"
                  :label="item.systemName"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="100px" label="绑定菜单：" prop="menuId" v-show="buttonDialog.model.systemId">
              <el-select
                v-model="buttonDialog.model.menuId"
                filterable
                @change="changeMenu"
                placeholder="请选择要绑定的菜单"
                :disabled="!buttonDialog.isMod && !buttonDialog.isCreate"
                clearable
              >
                <el-option
                  v-for="item in buttonDialog.extends.menuList"
                  :key="item.id"
                  :label="item.menuName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!buttonDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="100px" label="创建者：">
              <el-input v-model="buttonDialog.model.creator" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="100px" label="创建时间：">
              <el-input
                v-model="buttonDialog.model.createTime"
                :disabled="true"
              >
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!buttonDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="100px" label="修改者：">
              <el-input
                v-model="buttonDialog.model.modifier"
                :disabled="true"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="100px" label="修改时间：">
              <el-input
                v-model="buttonDialog.model.modifyTime"
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
        v-if="buttonDialog.isMod || buttonDialog.isCreate"
      >
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button
          size="mini"
          type="primary"
          v-if="!buttonDialog.isCreate"
          @click="modRecord"
          >确定</el-button
        >
        <el-button
          size="mini"
          type="primary"
          v-if="buttonDialog.isCreate"
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
import api from '@api/button/apiMethod'
import apiCompany from '@api/company/apiMethod'
import mapi from '@api/menu/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'FuncButton',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '新增',
          method: 'showButtonAdd',
          params: null
        }
      ],
      // 条件查询字段
      buttonQuery: {
        column: {
          buttonName: '',
          menuName: ''
        },
        company: {
          companyId: '',
          companyList: []
        },
        system: {
          systemId: '',
          systemList: []
        },
        menu: {
          menuId: '',
          menuList: ''
        },
        range: {
          siteLoading: false,
          menuList: []
        }
      },
      buttonTable: {
        isLoading: false,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      buttonDialog: {
        isMod: false,
        isCreate: false,
        model: {},
        rules: {
          buttonName: [
            {
              required: true,
              message: '请输入按钮名称',
              trigger: 'blur'
            }
          ],
          menuId: [
            {
              required: true,
              message: '请选择绑定菜单',
              trigger: 'blur'
            }
          ]
        },
        extends: {
          companyList: [],
          systemList: []
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
    self.getCompany()
    document.addEventListener('keydown', self.handleKeydown)
  },
  mounted: function () {
    let self = this
    // 获取表格高度
    self.$nextTick(function () {
      self.maxHeight = self.$el.querySelector('.com-table-detail').clientHeight
    })
  },
  computed: {
    ...mapGetters(['isMobile', 'defaultIndex'])
  },
  methods: {
    getButton: function (isRefresh) {
      let self = this
      let query = self.buttonQuery
      const filterConds = [
        { fieldName: 'menuName', fieldValue: query.column.menuName, operator: 'likeStart' },
        { fieldName: 'buttonName', fieldValue: query.column.buttonName, operator: 'likeStart' },
        { fieldName: 'menuId', fieldValue: query.menu.menuId, operator: '=' }
      ]
      if (isRefresh) {
        self.buttonTable.pagingInfo.currentPage = 1
      }
      self.buttonTable.isLoading = true

      api.getButton({
        data: {
          page: self.buttonTable.pagingInfo.currentPage,
          pageSize: self.buttonTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          self.buttonTable.pagingInfo.totalRows = res.data.data.totalSize
          self.buttonTable.data = res.data.data.records
          console.log(res.data.data.records)
          self.buttonTable.isLoading = false
        },
        fail: function (err) {
          self.$message.error(err.data.message)
        }
      })
    },
    getMenu: function () {
      let self = this
      mapi.getMenuBySystemId({
        data: {
          systemId: self.buttonQuery.system.systemId
        },
        success: function (res) {
          let allChildMenu = []
          let menuList = res.data.data
          console.log(res.data.data)
          menuList.forEach(pMenu => {
            if (pMenu.children) {
              pMenu.children.forEach(secondMenu => {
                if (!secondMenu.children) {
                  allChildMenu.push(secondMenu)
                } else {
                  secondMenu.children.forEach(thridMenu => {
                    allChildMenu.push(thridMenu)
                  })
                }
              })
            }
          })
          self.buttonDialog.extends.menuList = allChildMenu
          self.buttonQuery.menu.menuList = allChildMenu
        }
      })
    },
    getCompany: function () {
      let self = this
      apiCompany.getCompanyByCurrentUser({
        data: {},
        success: function (res) {
          console.log(res.data.data)
          self.buttonQuery.company.companyList = res.data.data
          self.buttonDialog.extends.companyList = res.data.data
        }
      })
    },
    getSystem: function () {
      let self = this
      apiCompany.getSystemByCurrentUser({
        data: {
          companyId: self.buttonQuery.company.companyId
        },
        success: function (res) {
          self.buttonQuery.system.systemList = res.data.data
          self.buttonDialog.extends.systemList = res.data.data
        }
      })
    },
    changeSystem: function (val) {
      let self = this
      self.buttonDialog.model.systemId = val
      self.buttonQuery.system.systemId = val
      self.buttonQuery.menu.menuId = null
      self.buttonDialog.model.menuId = null

      self.buttonTable.data = []
      self.getMenu(true)
    },
    changeMenu: function (val) {
      let self = this
      self.buttonQuery.menu.menuId = val
      self.buttonDialog.model.menuId = val
      self.getButton(true)
    },
    changeCompany: function (val) {
      let self = this
      self.buttonDialog.model.companyId = val
      self.buttonQuery.company.companyId = val
      self.buttonQuery.system.systemId = null
      self.buttonDialog.model.systemId = null
      self.buttonQuery.menu.menuId = null
      self.buttonDialog.model.menuId = null

      self.buttonTable.data = []
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
    paginationOnSizeChange: function (val) {
      let self = this
      self.buttonTable.pagingInfo.pageSize = val
      self.buttonTable.pagingInfo.currentPage = 1
      self.getButton(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.buttonTable.pagingInfo.currentPage = val
      self.getButton()
    },
    // dialog取消事件
    closeDetailDialog: function () {
      let self = this
      self.buttonDialog.props.visible = false
      self.buttonDialog.isCreate = false
      self.buttonDialog.model.data = ''
      self.$refs['buttonDialog.model'].clearValidate()
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
        api.delButton({
          data: {
            id: row.id,
            recVer: row.recVer
          },
          success: function (res) {
            self.$message.success('删除成功')
            self.buttonTable.pagingInfo.currentPage = 1
            self.getButton(true)
          },
          fail: function (res) {
            self.$message.error(res.data.message)
          }
        })
      })
    },
    // 确认修改
    modRecord: function () {
      let self = this
      self
        .$confirm('是否保存当前修改？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          self.$refs['buttonDialog.model'].validate(valid => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              // 修改记录
              api.updateButton(
                {
                  data: {
                    ...self.buttonDialog.model
                  },
                  success: function (res) {
                    self.$message.success('修改成功')
                    self.buttonTable.pagingInfo.currentPage = 1
                    self.closeDetailDialog()
                    self.getButton(true)
                  },
                  fail: function (res) {
                    self.$message.error(res.data.message)
                  }
                }
              )
            }
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 新增弹出dialog
    showButtonAdd: function () {
      let self = this
      self.buttonDialog.isCreate = true
      self.buttonDialog.props.title = '新增记录'
      self.buttonDialog.props.visible = true
      self.buttonDialog.model = {
        buttonName: '',
        companyId: self.buttonQuery.company.companyId,
        systemId: self.buttonQuery.system.systemId,
        menuId: self.buttonQuery.menu.menuId
      }
    },
    showDetail: function (row, isMod) {
      let self = this
      if (isMod) {
        self.buttonDialog.props.title = '修改数据'
        self.buttonDialog.isMod = true
      } else {
        self.buttonDialog.props.title = '数据详情'
        self.buttonDialog.isMod = false
      }
      self.buttonDialog.props.visible = true
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
      newObj.companyId = self.buttonQuery.company.companyId
      newObj.systemId = self.buttonQuery.system.systemId
      self.buttonDialog.model = Object.assign({}, newObj)
      self.getMenu()
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
          self.$refs['buttonDialog.model'].validate(valid => {
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
          })
        })
        .catch(() => {})
    },
    // 重置查询条件
    cleanQuery: function () {
      let self = this
      self.buttonQuery.column = {}
      self.buttonQuery.company.companyId = null
      self.buttonQuery.system.systemId = null
      self.buttonQuery.menu.menuId = null
      self.buttonTable.data = []
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.buttonQuery
      if (query.menu.menuId) {
        self.getButton(true)
      } else {
        self.$message.error('请依次选择公司系统菜单查询')
      }
    },
    handleKeydown: function (e) {
      let self = this
      if ((e.altKey && e.keyCode === 79)) {
        self.showButtonAdd()
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
