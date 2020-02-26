<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini" label-width="110px">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="公司：" label-width="80px">
                <el-input placeholder="请输入公司名" v-model="companyQuery.column.companyName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="16" :md="12" :lg="8">
              <el-form-item label="创建时间：" label-width="91px">
                <el-date-picker
                  v-model="companyQuery.column.dataRange"
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
          <strong>公司列表数据</strong>
          <ul>
            <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
            </li>
          </ul>
        </div>
        <div class="com-table-detail">
          <el-table
            v-loading="companyTable.isLoading"
            :data="companyTable.data"
            header-row-class-name="com-table-header"
            header-cell-class-name="com-table-header-cell"
            border
            :max-height="maxHeight"
            ref="table"
            style="width: 100%;">
            <el-table-column fixed label="序号" width="50" align="center">
              <template slot-scope="scope">
                <span>{{ (companyTable.pagingInfo.currentPage - 1) * companyTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              label="公司id"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="companyName"
              label="公司中文名"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="englishName"
              label="公司英文名"
              show-overflow-tooltip
              width="180"
            >
            </el-table-column>
            <el-table-column
              prop="companyType"
              label="公司类型"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="industryType"
              label="行业类型"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="email"
              label="公司邮箱"
              show-overflow-tooltip
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="postcode"
              label="邮政编码"
              show-overflow-tooltip
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="linkman"
              label="联系人"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="telephone"
              label="联系电话"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="country"
              label="国家名称"
              show-overflow-tooltip
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="province"
              label="省份名称"
              show-overflow-tooltip
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="city"
              label="城市名称"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="area"
              label="区名"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="address"
              label="详细地址"
              show-overflow-tooltip
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="status"
              label="公司状态"
              show-overflow-tooltip
              width="100"
            >
            </el-table-column>
            <el-table-column
              prop="isBinding"
              label="是否已经绑定"
              show-overflow-tooltip
              width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.isBinding ? '已绑定' : '未绑定' }}
              </template>
            </el-table-column>
            <el-table-column
              prop="systemId"
              label="业务系统id"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="companyType"
              label="公司类别"
              show-overflow-tooltip
              width="120"
            ></el-table-column>
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
              width="240"
              fixed="right"
              align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small"  @click="showSystemAdd(scope.row)">新增业务系统</el-button>
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
            :current-page="companyTable.pagingInfo.currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="companyTable.pagingInfo.pageSize"
            :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
            :total="companyTable.pagingInfo.totalRows">
          </el-pagination>
        </div>
      </div>
    </el-form>
    <el-dialog :title="companyDialog.props.title" :visible.sync="companyDialog.props.visible"
               :close-on-click-modal="false" @close="closeDetailDialog">
      <div class="com-dialog-s-title">基础数据</div>
      <el-form class="com-form" ref="companyDialog.model" :model="companyDialog.model" size="mini" :rules="companyDialog.rules">
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="120px" label="公司编码：" prop="companyCode">
              <el-input v-model="companyDialog.model.companyCode" placeholder="请输入公司编码" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="邮政编码：">
              <el-input v-model="companyDialog.model.postcode" placeholder="请输入邮政编码" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
            <el-col :span="12">
              <el-form-item label-width="120px" label="公司中文名：" prop="companyName">
                <el-input v-model="companyDialog.model.companyName" placeholder="请输入公司中文名" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="120px" label="公司中文缩写：">
                <el-input v-model="companyDialog.model.shortname" placeholder="请输入中文名缩写" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
        <div class="com-pannel">
         <el-col :span="12">
           <el-form-item label-width="120px" label="公司英文名：" >
             <el-input v-model="companyDialog.model.englishName" placeholder="请输入公司英文名" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
             </el-input>
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label-width="120px" label="公司英文缩写：">
             <el-input v-model="companyDialog.model.englishShortname" placeholder="请输入英文名缩写" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
             </el-input>
           </el-form-item>
         </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="120px" label="联系人：" prop="linkman">
              <el-input v-model="companyDialog.model.linkman" placeholder="请输入联系人" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="联系电话：" prop="telephone">
              <el-input v-model="companyDialog.model.telephone" placeholder="请输入联系电话" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="120px" label="公司邮箱：" prop="email">
              <el-input v-model="companyDialog.model.email" placeholder="请输入公司邮箱" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="详细地址：" prop="address">
              <el-input v-model="companyDialog.model.address" placeholder="请输入公司详细地址" :disabled="!companyDialog.isMod && !companyDialog.isCreate">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="120px" label="公司类型：" prop="companyType">
              <el-select
                v-model="companyDialog.model.companyType"
                filterable
                placeholder="请选择公司类型"
                :disabled="!companyDialog.isMod && !companyDialog.isCreate"
                clearable
              >
                <el-option
                  v-for="item in companyDialog.extends.companyTypeList"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.companyId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="行业类型：" prop="industryType">
              <el-select
                v-model="companyDialog.model.industryType"
                filterable
                placeholder="请选择行业类型:"
                :disabled="!companyDialog.isMod && !companyDialog.isCreate"
                clearable
              >
                <el-option
                  v-for="item in companyDialog.extends.industryTypeList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!companyDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="120px" label="创建者：">
              <el-input v-model="companyDialog.model.creator" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="创建时间：">
              <el-input v-model="companyDialog.model.createTime" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" v-if="!companyDialog.isCreate">
          <el-col :span="12">
            <el-form-item label-width="120px" label="修改者：">
              <el-input v-model="companyDialog.model.modifier" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="120px" label="修改时间：">
              <el-input v-model="companyDialog.model.modifyTime" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer" v-if="companyDialog.isMod || companyDialog.isCreate">
        <el-button size="mini" @click="closeDetailDialog">取消</el-button>
        <el-button size="mini" type="primary" v-if="!companyDialog.isCreate" @click="modRecord">确定</el-button>
        <el-button size="mini" type="primary" v-if="companyDialog.isCreate" @click="createRecord">创建</el-button>
      </span>
    </el-dialog>

    <el-dialog title="新增业务系统" :visible.sync="systemAddDialog.props.visible"
               :close-on-click-modal="false" @close="closeDetailDialog">
      <div class="com-dialog-s-title">基础数据</div>
      <el-form class="com-form" ref="systemAddDialog.model" :model="systemAddDialog.model"
               size="mini" :rules="systemAddDialog.rules" label-position="top" label-width="80px">
        <div class="com-pannel" >
          <el-col :span="12">
            <el-form-item label="公司">
              <el-select
                v-model="systemAddDialog.model.companyId"
                filterable
                placeholder="请选择公司"
                :disabled="true"
                clearable
              >
                <el-option
                  v-for="item in systemAddDialog.extends.companyList"
                  :key="item.id"
                  :label="item.companyName"
                  :value="item.companyId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel" >
          <el-col :span="12">
            <el-form-item label="是否需要企业资质认证" prop="isAuth">
              <el-select
                v-model="systemAddDialog.model.isAuth"
                filterable
                placeholder="请选择是或否"
                clearable
              >
                <el-option
                  v-for="item in systemAddDialog.extends.isAuthList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.code">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label="业务系统名称：" prop="systemName">
              <el-input v-model="systemAddDialog.model.systemName" placeholder="请输入业务系统名称">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeAddSystemDialog">取消</el-button>
        <el-button size="mini" type="primary" @click="addSystem">创建</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/company/apiMethod'
import apiSystem from '@api/system/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'Company',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '新增',
          method: 'showCompanyAdd',
          params: null
        }
      ],
      // 条件查询字段
      companyQuery: {
        column: {
          companyName: '',
          companyType: '',
          dataRange: ''
        }
      },
      companyTable: {
        isLoading: false,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      companyDialog: {
        isMod: false,
        isCreate: false,
        model: {},
        rules: {
          companyName: [
            {
              required: true,
              message: '请输入公司名',
              trigger: 'blur'
            }
          ],
          companyCode: [
            {
              required: true,
              message: '请输入公司编码',
              trigger: 'blur'
            }
          ],
          email: [
            {
              required: true,
              message: '请输入公司邮箱',
              trigger: 'blur'
            }
          ],
          linkman: [
            {
              required: true,
              message: '请输入公司联系人',
              trigger: 'blur'
            }
          ],
          telephone: [
            {
              required: true,
              message: '请输入公司联系电话',
              trigger: 'blur'
            }
          ],
          address: [
            {
              required: true,
              message: '请输入公司详细地址',
              trigger: 'blur'
            }
          ]
        },
        extends: {
          siteLoading: false,
          industryTypeList: [],
          companyTypeList: []
        },
        props: {
          title: '数据详情',
          visible: false
        }
      },
      systemAddDialog: {
        model: {},
        rules: {
          systemName: [
            {
              required: true,
              message: '请输入业务系统名称',
              trigger: 'blur'
            }
          ],
          isAuth: [
            {
              required: true,
              message: '请选择是否需要验证',
              trigger: 'blur'
            }
          ]
        },
        extends: {
          companyList: [],
          isAuthList: [
            { name: '是', code: 1 },
            { name: '否', code: 0 }
          ]
        },
        props: {
          visible: false
        }
      }
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
    ])
  },
  methods: {
    getCompany: function (isRefresh, filterConds = null) {
      let self = this
      if (isRefresh) {
        self.companyTable.pagingInfo.currentPage = 1
      }
      self.companyTable.isLoading = true
      api.getCompany({
        data: {
          page: self.companyTable.pagingInfo.currentPage,
          pageSize: self.companyTable.pagingInfo.pageSize,
          filterConds: filterConds
        },
        success: function (res) {
          self.companyTable.pagingInfo.totalRows = res.data.data.totalSize
          self.companyTable.data = res.data.data.records
          self.companyTable.isLoading = false
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
      self.companyDialog.extends.siteLoading = true
      /*      siteapi.querySiteBase({
        data: {
          name: query,
          page: 1,
          pageSize: 10
        },
        success: function (res) {
          // self.productManageQuery.column.siteLoading = false
          self.companyDialog.extends.siteLoading = false
          // self.productManageQuery.range.siteList = res.data.data.baseDataSites
          self.companyDialog.extends.siteList = res.data.data.baseDataSites
        }
      }) */
      self.companyDialog.extends.siteList = [
        { name: 'test', code: 1 },
        { name: 'test2', code: 2 }
      ]
      self.companyDialog.extends.siteLoading = false
    },
    changePDict: function (value) {
      let self = this
      self.companyDialog.model.companyType = value
      console.log(self.companyDialog.model.companyType)
    },
    // 查、看修改弹出框
    showDetail: function (row, isMod) {
      let self = this
      if (isMod) {
        self.companyDialog.props.title = '修改数据'
        self.companyDialog.isMod = true
      } else {
        self.companyDialog.props.title = '数据详情'
        self.companyDialog.isMod = false
      }
      self.companyDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
      newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
      self.companyDialog.model = Object.assign({}, newObj)
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.companyTable.pagingInfo.pageSize = val
      self.companyTable.pagingInfo.currentPage = 1
      self.getCompany(true)
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.companyTable.pagingInfo.currentPage = val
      self.getCompany()
    },
    // dialog取消按钮事件 和 ‘X'
    closeDetailDialog: function () {
      let self = this
      self.companyDialog.props.visible = false
      self.companyDialog.isCreate = false
      self.companyDialog.model.data = ''
      self.$refs['companyDialog.model'].clearValidate()
    },
    closeAddSystemDialog: function () {
      let self = this
      self.systemAddDialog.props.visible = false
      self.systemAddDialog.model.data = ''
      self.$refs['systemAddDialog.model'].clearValidate()
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
        api.delCompany({
          data: {
            id: row.id,
            recVer: row.recVer
          },
          success: function (res) {
            self.$message.success('删除成功')
            self.companyTable.pagingInfo.currentPage = 1
            self.getCompany(true)
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
      let thisObj = self.companyDialog.model
      self.$confirm('是否保存当前修改？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        self.$refs['companyDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            // 修改记录
            api.updateCompany({
              data: {
                ...self.companyDialog.model
              },
              success: function (res) {
                self.$message.success('修改成功')
                self.companyTable.pagingInfo.currentPage = 1
                self.closeDetailDialog()
                self.getCompany(true)
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
    showCompanyAdd: function () {
      let self = this
      self.companyDialog.isCreate = true
      self.companyDialog.props.title = '新增记录'
      self.companyDialog.props.visible = true
      self.companyDialog.model = {
        companyName: '',
        companyType: null
      }
    },
    showSystemAdd: function (row) {
      let self = this
      self.systemAddDialog.extends.companyList = [
        { companyName: row.companyName, companyId: row.id }
      ]
      self.systemAddDialog.props.visible = true
      self.systemAddDialog.model = {
        companyId: row.id,
        isAuth: null,
        systemName: ''
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
        self.$refs['companyDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            api.addCompany({
              data: {
                ...self.companyDialog.model
              },
              success: function (res) {
                console.log('success')
                console.log(res)
                self.$message.success('创建成功')
                self.companyTable.pagingInfo.currentPage = 1
                self.companyDialog.isCreate = false
                self.closeDetailDialog()
                self.getCompany(true)
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
    addSystem: function () {
      let self = this
      self.$confirm('是否创建当前记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 创建记录
        self.$refs['systemAddDialog.model'].validate((valid) => {
          if (!valid) {
            self.$message.error('请完善表单')
          } else {
            apiSystem.addSystem({
              data: {
                companyId: self.systemAddDialog.model.companyId,
                systemName: self.systemAddDialog.model.systemName,
                isAuth: self.systemAddDialog.model.isAuth
              },
              success: function (res) {
                console.log('success')
                console.log(res)
                self.$message.success('创建成功')
                self.companyTable.pagingInfo.currentPage = 1
                self.closeAddSystemDialog()
                self.getCompany(true)
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
      self.companyQuery = {
        column: {
          companyName: '',
          companyType: '',
          dataRange: ''
        }
      }
    },
    // 查询事件
    searchResult: function () {
      let self = this
      let query = self.companyQuery.column
      if (query.companyName || query.dataRange) {
        const filterConds = [
          { fieldName: 'companyName', fieldValue: query.companyName, operator: 'likeStart' },
          { fieldName: 'createTime', fieldValue: query.dataRange[0], operator: '>=' },
          { fieldName: 'createTime', fieldValue: query.dataRange[1], operator: '<=' }
        ]
        self.getCompany(true, filterConds)
      } else {
        self.getCompany(true)
      }
    }
  }
}
</script>

<style scoped lang="scss">
</style>
