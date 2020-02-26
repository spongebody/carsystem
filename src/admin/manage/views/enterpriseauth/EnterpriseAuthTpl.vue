<template>
  <div class="com-page-flex-wrp half-wrp">
    <div class="com-page left-p">
      <el-form class="com-form" ref="form" size="mini" label-width="110px" :inline="true">
        <div class="com-pannel-wrp">
          <div class="com-pannel">
            <el-row class="search-row">
              <el-form-item label="关联公司：" label-width="110px" prop="companyCode">
                <el-select
                  v-model="companyObj.company.companyValue"
                  placeholder="请选择公司"
                  clearable
                  :loading="companyObj.company.isLoading"
                  @change="queryCompany"
                  @clear="clearCompany"
                >
                  <el-option
                    v-for="item in companyObj.company.companyList"
                    :key="item.id"
                    :label="item.companyName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关联业务系统：" label-width="110px" prop="sysCode" v-if="companyObj.company.companyValue !== ''">
                <el-select
                  v-model="companyObj.system.sysValue"
                  placeholder="请选择业务系统"
                  clearable
                  :loading="companyObj.system.isLoading"
                  @change="querySystem"
                  @clear="clearSystem"
                >
                  <el-option
                    v-for="item in companyObj.system.sysList"
                    :key="item.id"
                    :label="item.systemName"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="绑定角色：" label-width="110px" prop="roleCode" v-if="companyObj.system.sysValue !== ''">
                <el-select
                  v-model="companyObj.role.roleValue"
                  placeholder="请选择绑定角色类型"
                  clearable
                  :loading="companyObj.role.isLoading"
                  @change="changeRole"
                  @clear="clearRole"
                >
                  <el-option
                    v-for="item in companyObj.role.roleList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-row>
          </div>
          <div class="com-pannel op-btn-list">
            <el-row class="search-row">
              <el-col :span="24" style="text-align:right">
                <el-button type="primary" size="mini" round @click="queryTpl">查询</el-button>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="com-table mt">
          <div class="table-header clear">
            <strong>模板模块</strong>
            <ul>
              <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in moduleQuery.dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
              </li>
            </ul>
          </div>
          <div class="com-table-detail">
            <el-table
              v-loading="moduleTable.isLoading"
              :data="moduleTable.data"
              header-row-class-name="com-table-header"
              header-cell-class-name="com-table-header-cell"
              border
              :max-height="maxHeight"
              @row-click="changeCurRowIndex"
              highlight-current-row
              @current-change="handleCurrentChange"
              ref="moduleTable"
              style="width: 100%;">
              <el-table-column fixed label="序号" width="50" align="center">
                <template slot-scope="scope">
                  <span>{{ (moduleTable.pagingInfo.currentPage - 1) * moduleTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="sort"
                label="排序"
                show-overflow-tooltip
                width="50" align="center"
              >
              </el-table-column>
              <el-table-column
                prop="tempName"
                label="模块名称"
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
                label="排序操作"
                width="100"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="small"  @click="moveRecord($event, scope, 'up')">上移</el-button>
                  <el-button type="text" size="small"  @click="moveRecord($event, scope, 'down')">下移</el-button>
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
        </div>
      </el-form>
      <el-dialog :title="tplDialog.props.title" :visible.sync="tplDialog.props.visible"
                 :close-on-click-modal="false" @close="closeDialog">
        <div class="com-dialog-s-title">模板数据</div>
        <el-form class="com-form" ref="tplDialog.model" :model="tplDialog.model" :rules="tplDialog.rules" label-width="80px">
          <div class="com-pannel">
            <el-col :span="12">
              <el-form-item label-width="90px" label="模块代码：" prop="tempCode">
                <el-input v-model="tplDialog.model.tempCode" placeholder="请输入模板代码" :disabled="true">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="100px" label="模块名称：" prop="tempName">
                <el-input @change="translateTempName" v-model="tplDialog.model.tempName" placeholder="请输入模块名称" :disabled="!tplDialog.isMod && !tplDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel">
            <el-col :span="24">
              <el-form-item label-width="65px" label="备注：">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入备注"
                  v-model="tplDialog.model.remark"
                  :disabled="!tplDialog.isMod && !tplDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-dialog-s-title">自定义json字段</div>
          <codemirror v-model="tplDialog.model.specialVal" :options="cmOptions"></codemirror>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取消</el-button>
        <el-button size="mini" type="primary" @click="modModule(0)" v-if="tplDialog.isMod">修改</el-button>
        <el-button size="mini" type="primary" @click="createModule(0)" v-if="tplDialog.isCreate">创建</el-button>
      </span>
      </el-dialog>
    </div>
    <div class="com-page right-p">
      <el-form class="com-form" ref="form" size="mini" label-width="110px">
        <div class="com-table">
          <div class="table-header clear">
            <strong>模块字段</strong>
            <ul>
              <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in fieldQuery.dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
              </li>
            </ul>
          </div>
          <div class="com-table-detail">
            <el-table
              v-loading="fieldTable.isLoading"
              :data="fieldTable.data"
              header-row-class-name="com-table-header"
              header-cell-class-name="com-table-header-cell"
              border
              :max-height="maxHeightRight"
              ref="fieldTable"
              style="width: 100%;">
              <el-table-column fixed label="序号" width="50" align="center">
                <template slot-scope="scope">
                  <span>{{ (fieldTable.pagingInfo.currentPage - 1) * fieldTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="sort"
                label="排序"
                show-overflow-tooltip
                width="50" align="center"
              >
              </el-table-column>
              <el-table-column
                prop="tempName"
                label="模块名称"
                show-overflow-tooltip
                width="120px"
              >
              </el-table-column>
              <el-table-column
                label="模块类别"
                show-overflow-tooltip
                width="120px"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.type === 1">文本</span>
                  <span v-if="scope.row.type === 2">图片</span>
                  <span v-if="scope.row.type === 3">下拉框</span>
                  <span v-if="scope.row.type === 4">复选框</span>
                  <span v-if="scope.row.type === 5">单选框</span>
                  <span v-if="scope.row.type === 6">附件</span>
                  <span v-if="scope.row.type === 7">地址</span>
                  <span v-if="scope.row.type === 8">行业</span>
                  <span v-if="scope.row.type === 9">文本链接</span>
                </template>
              </el-table-column>
              <el-table-column
                label="是否必填"
                show-overflow-tooltip
                width="80"
              >
                <template slot-scope="scope">
                  <span>{{ scope.row.isRequired ? '是' : '否' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="regex"
                label="校验正则"
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
                label="排序操作"
                width="100"
                align="center"
                fixed="right"
              >
                <template slot-scope="scope">
                  <el-button type="text" size="small"  @click="moveRecord($event, scope, 'up', true)">上移</el-button>
                  <el-button type="text" size="small"  @click="moveRecord($event, scope, 'down', true)">下移</el-button>
                </template>
              </el-table-column>
              <el-table-column
                label="操作"
                width="140"
                align="center"
                fixed="right">
                <template slot-scope="scope">
                  <el-button type="text" size="small"  @click="showChildDetail(scope.row, false)">查看</el-button>
                  <el-button type="text" size="small"  @click="showChildDetail(scope.row, true)">修改</el-button>
                  <el-button type="text" size="small"  @click="delRecord(scope.row, true)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>

      <el-dialog :title="filedDialog.props.title" :visible.sync="filedDialog.props.visible"
                 :close-on-click-modal="false" @close="closeDialog(true)">
        <div class="com-dialog-s-title">模板数据</div>
        <el-form class="com-form" ref="filedDialog.model" :model="filedDialog.model" :rules="filedDialog.rules" label-width="80px">
          <div class="com-pannel">
            <el-col :span="8">
              <el-form-item label-width="90px" label="类型选择：" prop="type">
                <el-select
                  v-model="filedDialog.model.type"
                  placeholder="请选择类型"
                  @change="changeType"
                  clearable
                  :disabled="!filedDialog.isMod && !filedDialog.isCreate"
                >
                  <el-option
                    v-for="item in filedDialog.external.typeList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="90px" label="字段代码：" prop="tempCode">
                <el-input v-model="filedDialog.model.tempCode" placeholder="请输入字段代码" :disabled="true">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label-width="100px" label="字段名称：" prop="tempName">
                <el-input @change="translateChildTempName" v-model="filedDialog.model.tempName" placeholder="请输入字段名称" :disabled="!filedDialog.isMod && !filedDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel">
            <el-col :span="12">
              <el-form-item label-width="90px" label="输入提示：" prop="placeholder">
                <el-input v-model="filedDialog.model.placeholder" placeholder="请输入提示" :disabled="!filedDialog.isMod && !filedDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="100px" label="是否必填：" prop="isRequired">
                <el-select
                  v-model="filedDialog.model.isRequired"
                  placeholder="请选择是否必填"
                  :disabled="!filedDialog.isMod && !filedDialog.isCreate"
                >
                  <el-option
                    v-for="item in filedDialog.external.requiredList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </div>
          <!-- 不同类型的附加字段 -->
          <!-- 复选框 4 -->
          <div class="com-pannel" v-if="filedDialog.model.type === 4">
            <el-col>
              <el-form-item label-width="82px" label="复选框：">
                <el-row v-for="(item, index) in filedDialog.external.checkboxList" :key="index" style="margin-bottom: 10px">
                  <el-col :span="5" style="margin-right: 10px">
                    <el-input @input="resetSpecialVal(filedDialog.model.type)" placeholder="请填写键名" v-model="item.name" :disabled="!filedDialog.isMod && !filedDialog.isCreate"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input @input="resetSpecialVal(filedDialog.model.type)" placeholder="请填写键值" v-model="item.value" :disabled="!filedDialog.isMod && !filedDialog.isCreate"></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-checkbox @change="resetSpecialVal(filedDialog.model.type)" class="default-checked" v-model="item.defaultPicked">默认选中</el-checkbox>
                  </el-col>
                  <el-col :span="3" v-if="filedDialog.isMod || filedDialog.isCreate">
                    <i class="el-icon-remove-outline" style="margin-left: 10px" :idx="index" @click="removeKeyValue($event, filedDialog.model.type)"></i>
                    <i class="el-icon-circle-plus-outline" style="margin-left: 10px" :idx="index" @click="addKeyValue($event, filedDialog.model.type)"></i>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </div>
          <!-- 单选框 5 -->
          <div class="com-pannel" v-if="filedDialog.model.type === 5">
            <el-col>
              <el-form-item label-width="82px" label="单选框：">
                <el-row v-for="(item, index) in filedDialog.external.radioList" :key="index" style="margin-bottom: 10px">
                  <el-col :span="5" style="margin-right: 10px">
                    <el-input @input="resetSpecialVal(filedDialog.model.type)" placeholder="请填写键名" v-model="item.name" :disabled="!filedDialog.isMod && !filedDialog.isCreate"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input @input="resetSpecialVal(filedDialog.model.type)" placeholder="请填写键值" v-model="item.value" :disabled="!filedDialog.isMod && !filedDialog.isCreate"></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-checkbox @change="resetSpecialVal(filedDialog.model.type, index)" class="default-checked" :disabled="!filedDialog.isMod && !filedDialog.isCreate" v-model="item.defaultPicked">默认选中</el-checkbox>
                  </el-col>
                  <el-col :span="3" v-if="filedDialog.isMod || filedDialog.isCreate">
                    <i class="el-icon-remove-outline" style="margin-left: 10px" :idx="index" @click="removeKeyValue($event, filedDialog.model.type)"></i>
                    <i class="el-icon-circle-plus-outline" style="margin-left: 10px" :idx="index" @click="addKeyValue($event, filedDialog.model.type)"></i>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </div>
          <!-- 附件 6 -->
          <div class="com-pannel" v-if="filedDialog.model.type === 6">
            <el-col>
              <el-form-item label-width="82px" label="附件列表：">
                <el-row v-for="(item, index) in filedDialog.external.fileList" :key="index" style="margin-bottom: 10px">
                  <el-col :span="5" style="margin-right: 10px">
                    <el-input @input="resetSpecialVal(filedDialog.model.type)" placeholder="请填写附件名" v-model="item.filename" :disabled="!filedDialog.isMod && !filedDialog.isCreate"></el-input>
                  </el-col>
                  <el-col :span="8">
                    <el-input @input="resetSpecialVal(filedDialog.model.type)" placeholder="请填写示例模版" v-model="item.demolink" :disabled="!filedDialog.isMod && !filedDialog.isCreate"></el-input>
                  </el-col>
                  <el-col :span="4">
                    <el-checkbox @change="resetSpecialVal(filedDialog.model.type, index)" class="default-checked" :disabled="!filedDialog.isMod && !filedDialog.isCreate" v-model="item.defaultPicked">是否必填</el-checkbox>
                  </el-col>
                  <!--<el-col :span="3" v-if="filedDialog.isMod || filedDialog.isCreate">
                    <i class="el-icon-remove-outline" style="margin-left: 10px" :idx="index" @click="removeKeyValue($event, filedDialog.model.type)"></i>
                    <i class="el-icon-circle-plus-outline" style="margin-left: 10px" :idx="index" @click="addKeyValue($event, filedDialog.model.type)"></i>
                  </el-col>-->
                </el-row>
              </el-form-item>
            </el-col>
          </div>
          <!-- 文本链接 9 -->
          <div class="com-pannel" v-if="filedDialog.model.type === 9">
            <el-col>
              <el-form-item label-width="82px" label="文本链接：">
                <el-row style="margin-bottom: 10px">
                  <el-col :span="11" style="margin-right: 10px">
                    <el-input @input="resetSpecialVal(filedDialog.model.type)" placeholder="请填写提示文本" v-model="filedDialog.external.linkObj.tipText" :disabled="!filedDialog.isMod && !filedDialog.isCreate"></el-input>
                  </el-col>
                  <el-col :span="12">
                    <el-input @input="resetSpecialVal(filedDialog.model.type)" placeholder="请填写链接文本" v-model="filedDialog.external.linkObj.linkText" :disabled="!filedDialog.isMod && !filedDialog.isCreate"></el-input>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24" style="margin-right: 10px">
                    <el-input @input="resetSpecialVal(filedDialog.model.type)" placeholder="请填写链接" v-model="filedDialog.external.linkObj.link" :disabled="!filedDialog.isMod && !filedDialog.isCreate"></el-input>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </div>
          <div cldiv="com-pannel" v-if="filedDialog.model.type === 1">
            <el-col>
              <el-form-item label-width="120px" label="输入校验正则：" prop="regex">
                <el-input v-model="filedDialog.model.regex" placeholder="请输入校验正则" :disabled="!filedDialog.isMod && !filedDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" v-if="filedDialog.model.type === 3">
            <el-col :span="12">
              <el-form-item label-width="100px" label="请求方式：" prop="method">
                <el-select
                  v-model="filedDialog.model.method"
                  placeholder="请选择请求方式"
                  :disabled="!filedDialog.isMod && !filedDialog.isCreate"
                  @change="resetSpecialVal(filedDialog.model.type)"
                >
                  <el-option
                    v-for="item in filedDialog.external.methodList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="100px" label="返回参数：" prop="respath">
                <el-input @input="resetSpecialVal(filedDialog.model.type)" v-model="filedDialog.model.respath" placeholder="请输入返回值路径(如'data.resultList')" :disabled="!filedDialog.isMod && !filedDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" v-if="filedDialog.model.type === 3">
            <el-col :span="12">
              <el-form-item label-width="100px" label="name字段：" prop="resname">
                <el-input @input="resetSpecialVal(filedDialog.model.type)" v-model="filedDialog.model.resname" placeholder="请输入返回数组name字段(如'companyName')" :disabled="!filedDialog.isMod && !filedDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label-width="100px" label="value字段：" prop="resval">
                <el-input @input="resetSpecialVal(filedDialog.model.type)" v-model="filedDialog.model.resval" placeholder="请输入返回数组value字段(如'id')" :disabled="!filedDialog.isMod && !filedDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" v-if="filedDialog.model.type === 3">
            <el-col :span="24">
              <el-form-item label-width="100px" label="查询参数：" prop="qkey">
                <el-input @input="resetSpecialVal(filedDialog.model.type)" v-model="filedDialog.model.qkey" placeholder='请输入查询参数(如{ "filterConds": [{ "fieldName": "companyName", "fieldValue": "{val}", "operator": "likeAnywhere" }]})' :disabled="!filedDialog.isMod && !filedDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel" v-if="filedDialog.model.type === 3">
            <el-col>
              <el-form-item label-width="135px" label="输入下请求地址：" prop="dataSourceUrl">
                <el-input v-model="filedDialog.model.dataSourceUrl" placeholder="请输入请求地址（下拉框类型需要）" :disabled="!filedDialog.isMod && !filedDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-pannel">
            <el-col :span="24">
              <el-form-item label-width="65px" label="备注：">
                <el-input
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4}"
                  placeholder="请输入备注"
                  v-model="filedDialog.model.remark"
                  :disabled="!filedDialog.isMod && !filedDialog.isCreate">
                </el-input>
              </el-form-item>
            </el-col>
          </div>
          <div class="com-dialog-s-title">自定义json字段</div>
          <codemirror ref="jsonCm" v-model="filedDialog.model.specialVal" :options="cmOptions"></codemirror>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog(true)">取消</el-button>
        <el-button size="mini" type="primary" @click="modModule(filedDialog.model.type)" v-if="filedDialog.isMod">修改</el-button>
        <el-button size="mini" type="primary" @click="createModule(filedDialog.model.type)" v-if="filedDialog.isCreate">创建</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import config from '@js/config'
import capi from '@api/common/apiMethod'
import { mapGetters } from 'vuex'
import utils from '@/assets/js/utils'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/mode/javascript/javascript.js'
import eapi from '@api/enterprise/apiMethod'
import pinyin from 'js-pinyin'

export default {
  name: 'EnterpriseAuthTpl',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      maxHeightRight: 1000,
      companyObj: {
        disabled: true,
        company: {
          companyCode: '',
          companyValue: '',
          companyList: [],
          isLoading: false
        },
        system: {
          sysCode: '',
          sysValue: '',
          sysList: [],
          isLoading: false
        },
        role: {
          roleCode: '',
          roleValue: '',
          roleList: [],
          isLoading: false
        }
      },
      moduleQuery: {
        dataOp: [
          {
            text: '新增',
            method: 'newModule',
            params: null
          },
          {
            text: '预览模板',
            method: 'prevTpl',
            params: null
          }
        ],
        column: {
        }
      },
      fieldQuery: {
        dataOp: [
          {
            text: '新增',
            method: 'newField',
            params: null
          }
        ],
        column: {
        }
      },
      moduleTable: {
        isLoading: false,
        currentRow: null,
        currentRowIndex: null,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      fieldTable: {
        isLoading: false,
        currentRow: null,
        data: [],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      tplDialog: {
        isMod: false,
        isCreate: false,
        props: {
          title: '',
          visible: false
        },
        model: {
          specialVal: '',
          tempCode: ''
        },
        rules: {
          tempName: [
            {
              required: true, message: '请输入模块名称', trigger: 'blur'
            }
          ]
        },
        external: {
          requiredList: [
            {
              name: '是',
              value: 1
            },
            {
              name: '否',
              value: 0
            }
          ]
        }
      },
      filedDialog: {
        isMod: false,
        isCreate: false,
        props: {
          title: '',
          visible: false
        },
        model: {
          specialVal: ''
        },
        rules: {
          isRequired: [
            {
              required: true, message: '请选择是否必填', trigger: 'blur'
            }
          ],
          tempName: [
            {
              required: true, message: '请输入模块名称', trigger: 'blur'
            }
          ]
        },
        external: {
          linkObj: {
            link: '',
            tipText: '',
            linkText: ''
          },
          fileList: [
            {
              filename: '',
              demolink: '',
              defaultPicked: false
            }
          ],
          radioList: [
            {
              name: '',
              value: '',
              defaultPicked: false
            },
            {
              name: '',
              value: '',
              defaultPicked: false
            }
          ],
          checkboxList: [
            {
              name: '',
              value: '',
              defaultPicked: false
            }
          ],
          typeList: [
            {
              name: '文本',
              value: 1
            },
            {
              name: '图片',
              value: 2
            },
            {
              name: '下拉框',
              value: 3
            },
            {
              name: '复选框',
              value: 4
            },
            {
              name: '单选框',
              value: 5
            },
            {
              name: '附件',
              value: 6
            },
            {
              name: '地址',
              value: 7
            },
            {
              name: '行业',
              value: 8
            },
            {
              name: '文本链接',
              value: 9
            }
          ],
          requiredList: [
            {
              name: '是',
              value: 1
            },
            {
              name: '否',
              value: 0
            }
          ],
          methodList: [
            {
              name: 'POST',
              value: 'post'
            },
            {
              name: 'GET',
              value: 'get'
            }
          ]
        }
      },
      cmOptions: {
        tabSize: 4,
        mode: 'application/json',
        lineNumbers: true,
        line: true
      }
    }
  },
  computed: {
    ...mapGetters([
      'isMobile'
    ])
  },
  watch: {
    'filedDialog.external.checkboxList': function () {
      let self = this
      self.resetSpecialVal()
    },
    'filedDialog.model.specialVal': function () {
      let self = this
      if (self.filedDialog.model.type === 3) {
        // 判断静态搜索结果是否存在，如果是的话dataUrl，qkey和respath等改为非必填
        try {
          let specialVal = JSON.parse(self.filedDialog.model.specialVal)
          if (Array.isArray(specialVal.selectorStaticList) && specialVal.selectorStaticList.length > 1 && specialVal.selectorStaticList[0].name !== '静态选择') {
            self.filedDialog.rules = {
              isRequired: [
                {
                  required: true, message: '请选择是否必填', trigger: 'blur'
                }
              ],
              tempName: [
                {
                  required: true, message: '请输入模块名称', trigger: 'blur'
                }
              ]
            }
            self.$refs['filedDialog.model'].clearValidate()
          } else {
            self.filedDialog.rules = {
              isRequired: [
                {
                  required: true, message: '请选择是否必填', trigger: 'blur'
                }
              ],
              tempName: [
                {
                  required: true, message: '请输入模块名称', trigger: 'blur'
                }
              ],
              qkey: [
                {
                  required: true, message: '请输入搜索参数', trigger: 'blur'
                }
              ],
              method: [
                {
                  required: true, message: '请选择请求方式', trigger: 'blur'
                }
              ],
              respath: [
                {
                  required: true, message: '请输入返回值路径', trigger: 'blur'
                }
              ],
              resname: [
                {
                  required: true, message: '请输入返回name字段', trigger: 'blur'
                }
              ],
              resval: [
                {
                  required: true, message: '请输入返回value字段', trigger: 'blur'
                }
              ],
              dataSourceUrl: [
                {
                  required: true, message: '请输入查询接口', trigger: 'blur'
                }
              ]
            }
          }
        } catch (e) {
          // 修改为必填
          self.filedDialog.rules = {
            isRequired: [
              {
                required: true, message: '请选择是否必填', trigger: 'blur'
              }
            ],
            tempName: [
              {
                required: true, message: '请输入模块名称', trigger: 'blur'
              }
            ],
            qkey: [
              {
                required: true, message: '请输入搜索参数', trigger: 'blur'
              }
            ],
            method: [
              {
                required: true, message: '请选择请求方式', trigger: 'blur'
              }
            ],
            respath: [
              {
                required: true, message: '请输入返回值路径', trigger: 'blur'
              }
            ],
            resname: [
              {
                required: true, message: '请输入返回name字段', trigger: 'blur'
              }
            ],
            resval: [
              {
                required: true, message: '请输入返回value字段', trigger: 'blur'
              }
            ],
            dataSourceUrl: [
              {
                required: true, message: '请输入查询接口', trigger: 'blur'
              }
            ]
          }
        }
      }
    }
  },
  created () {
    let self = this
    self.queryCompany()
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
    queryCompany: function () {
      let self = this
      self.companyObj.company.isLoading = true
      // 清空业务系统
      self.clearCompany()
      capi.getCompanyByUser({
        data: {
        },
        success: function (res) {
          self.companyObj.company.isLoading = false
          self.companyObj.company.companyList = res.data.data || []
          self.companyObj.company.isLoading = false
          if (self.companyObj.company.companyValue) {
            self.querySystem()
          }
        }
      })
    },
    querySystem: function () {
      let self = this
      self.companyObj.system.isLoading = true
      self.clearSystem()
      capi.getSystemByUser({
        data: {},
        success: function (res) {
          self.companyObj.system.isLoading = false
          self.companyObj.system.sysList = res.data.data || []
          self.companyObj.system.isLoading = false
          if (self.companyObj.system.sysValue) {
            self.queryRole()
          }
        }
      })
    },
    queryRole: function (query) {
      let self = this
      const filterConds = [
        { fieldName: 'name', fieldValue: query || '', operator: 'likeAnywhere' },
        { fieldName: 'companyId', fieldValue: self.companyObj.company.companyValue, operator: '=' },
        { fieldName: 'systemId', fieldValue: self.companyObj.system.sysValue, operator: '=' }
      ]
      self.companyObj.role.isLoading = true
      capi.getRole({
        data: {
          page: 1,
          pageSize: 10,
          filterConds
        },
        success: function (res) {
          self.companyObj.role.isLoading = false
          self.companyObj.role.roleList = res.data.data.records || []
          self.companyObj.role.isLoading = false
        }
      })
    },
    queryTpl: function (isRefresh, cb) {
      let self = this
      if (self.companyObj.system.sysValue && self.companyObj.role.roleValue) {
        capi.getTpl({
          data: {
            systemId: self.companyObj.system.sysValue,
            userType: self.companyObj.role.roleValue
          },
          success: function (res) {
            let result = res.data.data || []
            result.forEach(function (item, idx) {
              item.idx = idx
            })
            self.moduleTable.data = result || []
            self.moduleTable.currentRow = null
            if (cb) {
              cb()
            }
          }
        })
      }
    },
    changeTime: function (row, column, cellValue, index) {
      if (cellValue) {
        //  返回的时间为字符串形式，转换为整数
        return utils.timestampToDateString(cellValue * 1, '-', false, false)
      } else {
        return '暂无修改时间'
      }
    },
    changeRole: function () {
      let self = this
      self.queryTpl()
    },
    handleCurrentChange: function (val) {
      let self = this
      if (val) {
        self.moduleTable.currentRow = val
        self.fieldTable.data = val.children || []
      }
    },
    closeDialog: function (isChild) {
      let self = this
      if (!isChild) {
        // 模块
        self.$refs['tplDialog.model'].clearValidate()
        self.tplDialog.props.visible = false
        self.tplDialog.model = {
          specialVal: '',
          tempCode: ''
        }
        self.tplDialog.isCreate = false
        self.tplDialog.isMod = false
      } else {
        // 字段
        self.$refs['filedDialog.model'].clearValidate()
        self.filedDialog.props.visible = false
        self.filedDialog.model = {
          specialVal: '',
          tempCode: ''
        }
        self.filedDialog.external.checkboxList = [
          {
            name: '',
            value: '',
            defaultPicked: false
          }
        ]
        self.filedDialog.external.radioList = [
          {
            name: '',
            value: '',
            defaultPicked: false
          },
          {
            name: '',
            value: '',
            defaultPicked: false
          }
        ]
        self.filedDialog.external.fileList = [
          {
            filename: '',
            demolink: '',
            defaultPicked: false
          }
        ]
        self.filedDialog.isCreate = false
        self.filedDialog.isMod = false
        self.changeCmReadStatus(false)
      }
    },
    newModule: function () {
      // 新增模板模块
      let self = this
      if (self.companyObj.company.companyValue === '' || self.companyObj.system.sysValue === '' || self.companyObj.role.roleValue === '') {
        self.$message.error('请选择公司、系统及角色')
        return false
      }
      self.tplDialog.props.visible = true
      self.tplDialog.props.title = '新增模块'
      self.tplDialog.isCreate = true
    },
    newField: function () {
      // 新增模板模块
      let self = this
      if (!self.moduleTable.currentRow) {
        self.$message.error('请选择父级栏目')
        return false
      }
      self.filedDialog.props.visible = true
      self.filedDialog.props.title = '新增模块'
      self.filedDialog.isCreate = true
    },
    showDetail: function (row, isMod) {
      let self = this
      if (isMod) {
        self.tplDialog.props.title = '修改数据'
        self.tplDialog.isMod = true
      } else {
        self.tplDialog.props.title = '数据详情'
        self.tplDialog.isMod = false
      }
      self.tplDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
      newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
      let temSpecialVal = ''
      if (newObj.specialVal) {
        temSpecialVal = JSON.parse(newObj.specialVal)
        newObj.specialVal = JSON.stringify(temSpecialVal, null, 4)
      }
      self.tplDialog.model = Object.assign({}, newObj)
    },
    showChildDetail: function (row, isMod) {
      let self = this
      if (isMod) {
        self.filedDialog.props.title = '修改数据'
        self.filedDialog.isMod = true
      } else {
        self.filedDialog.props.title = '数据详情'
        self.filedDialog.isMod = false
      }
      self.filedDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.createTime = utils.timestampToDateString(newObj.createTime * 1, '-', false, false)
      newObj.modifyTime = newObj.modifyTime ? utils.timestampToDateString(newObj.modifyTime * 1, '-', false, false) : '暂无修改'
      let temSpecialVal = ''
      if (newObj.specialVal) {
        temSpecialVal = JSON.parse(newObj.specialVal)
        newObj.specialVal = JSON.stringify(temSpecialVal, null, 4)
      }
      // 初始化一些model参数
      switch (newObj.type) {
        case 3:
          try {
            let specialVal = JSON.parse(newObj.specialVal)
            newObj.qkey = specialVal.selectorQuery.qkey
            newObj.respath = specialVal.selectorQuery.respath
            newObj.method = specialVal.selectorQuery.method
            newObj.resname = specialVal.selectorQuery.resname
            newObj.resval = specialVal.selectorQuery.resval
          } catch (e) {
            self.$message.warning('JSON转换失败')
          }
          break
        case 4:
          try {
            let specialVal = JSON.parse(newObj.specialVal)
            self.filedDialog.external.checkboxList = specialVal.checkboxList
            self.changeCmReadStatus(true)
          } catch (e) {
            self.$message.warning('JSON转换失败')
          }
          break
        case 5:
          try {
            let specialVal = JSON.parse(newObj.specialVal)
            self.filedDialog.external.radioList = specialVal.radioList
            self.changeCmReadStatus(true)
          } catch (e) {
            self.$message.warning('JSON转换失败')
          }
          break
        case 6:
          try {
            let specialVal = JSON.parse(newObj.specialVal)
            self.filedDialog.external.fileList = specialVal.fileList
            self.changeCmReadStatus(true)
          } catch (e) {
            self.$message.warning('JSON转换失败')
          }
          break
        case 9:
          try {
            let specialVal = JSON.parse(newObj.specialVal)
            self.filedDialog.external.linkObj = specialVal.linkObj
            self.changeCmReadStatus(true)
          } catch (e) {
            self.$message.warning('JSON转换失败')
          }
          break
      }
      self.filedDialog.model = Object.assign({}, newObj)
    },
    modModule: function (tplType) {
      let self = this
      if (tplType === 0) {
        // 创建模块
        self.$confirm('是否修改当前模板模块？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$refs['tplDialog.model'].validate((valid) => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              eapi.updateTpl({
                data: {
                  'id': self.tplDialog.model.id,
                  'tempCode': self.tplDialog.model.tempCode,
                  'tempName': self.tplDialog.model.tempName,
                  'placeholder': '',
                  'systemId': self.companyObj.system.sysValue,
                  'userType': self.companyObj.role.roleValue,
                  'pTempId': '',
                  'remark': self.tplDialog.model.remark,
                  'type': tplType,
                  'dataSourceUrl': '',
                  'specialVal': self.tplDialog.model.specialVal || null,
                  'regex': self.tplDialog.model.regex,
                  'isRequired': self.tplDialog.model.isRequired,
                  'recVer': self.tplDialog.model.recVer
                },
                success: function (res) {
                  self.$message.success('修改成功')
                  self.queryTpl()
                  self.closeDialog()
                }
              })
            }
          })
        }).catch(() => {
        })
      } else {
        // 修改
        self.$confirm('是否修改当前模板字段？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$refs['filedDialog.model'].validate((valid) => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              // 校验特殊类型
              switch (self.filedDialog.model.type) {
                case 3:
                  // 下拉框
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (Array.isArray(specialVal.selectorStaticList) &&
                      specialVal.selectorStaticList.length > 1 &&
                      specialVal.selectorStaticList[0].name !== '静态选择' &&
                      specialVal.dataSourceUrl
                    ) {
                      self.$message.warning('在有静态数据的情况下将不会远程请求选项')
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
                case 4:
                  // 复选框
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (!Array.isArray(specialVal.checkboxList) ||
                      specialVal.checkboxList.length < 2
                    ) {
                      self.$message.error('请填写至少两条复选框')
                      return false
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
                case 5:
                  // 单选框
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (!Array.isArray(specialVal.radioList) ||
                      specialVal.radioList.length < 2
                    ) {
                      self.$message.error('请填写至少两条单选框')
                      return false
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
                case 6:
                  // 附件
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (!Array.isArray(specialVal.fileList) ||
                      specialVal.fileList.length < 1
                    ) {
                      self.$message.error('请填写至少一个附件')
                      return false
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
                case 9:
                  // 文本链接
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (specialVal.linkObj.link === '' || specialVal.linkObj.linkText === '' || specialVal.linkObj.tipText === '') {
                      self.$message.error('请完善文本链接信息')
                      return false
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
              }
              eapi.updateTpl({
                data: {
                  'id': self.filedDialog.model.id,
                  'tempCode': self.filedDialog.model.tempCode,
                  'tempName': self.filedDialog.model.tempName,
                  'placeholder': '',
                  'systemId': self.companyObj.system.sysValue,
                  'userType': self.companyObj.role.roleValue,
                  'parentId': self.moduleTable.currentRow.id,
                  'remark': self.filedDialog.model.remark,
                  'type': tplType,
                  'dataSourceUrl': self.filedDialog.model.dataSourceUrl,
                  'specialVal': self.filedDialog.model.specialVal || null,
                  'regex': self.filedDialog.model.regex,
                  'isRequired': self.filedDialog.model.isRequired,
                  'recVer': self.filedDialog.model.recVer
                },
                success: function (res) {
                  self.$message.success('修改成功')
                  self.queryTpl(true, function () {
                    self.$refs.moduleTable.setCurrentRow(self.moduleTable.data[self.moduleTable.currentRowIndex])
                  })
                  self.closeDialog(true)
                }
              })
            }
          })
        }).catch(() => {
        })
      }
    },
    translateTempName: function (val) {
      let self = this
      self.tplDialog.model.tempCode = pinyin.getFullChars(val).toLowerCase()
    },
    translateChildTempName: function (val) {
      let self = this
      self.filedDialog.model.tempCode = pinyin.getFullChars(val).toLowerCase()
    },
    createModule: function (tplType) {
      let self = this
      if (tplType === 0) {
        // 创建模块
        self.$confirm('是否创建当前模板模块？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$refs['tplDialog.model'].validate((valid) => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              eapi.createTpl({
                data: {
                  'tempCode': self.tplDialog.model.tempCode,
                  'tempName': self.tplDialog.model.tempName,
                  'placeholder': '',
                  'systemId': self.companyObj.system.sysValue,
                  'userType': self.companyObj.role.roleValue,
                  'parentId': '',
                  'remark': self.tplDialog.model.remark,
                  'type': tplType,
                  'dataSourceUrl': '',
                  'specialVal': self.tplDialog.model.specialVal || null,
                  'regex': self.tplDialog.model.regex,
                  'isRequired': self.tplDialog.model.isRequired
                },
                success: function (res) {
                  self.$message.success('创建成功')
                  self.queryTpl()
                  self.closeDialog()
                }
              })
            }
          })
        }).catch(() => {
        })
      } else {
        // 创建模块子字段
        self.$confirm('是否创建当前模板字段？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          self.$refs['filedDialog.model'].validate((valid) => {
            if (!valid) {
              self.$message.error('请完善表单')
            } else {
              // 校验特殊类型
              switch (self.filedDialog.model.type) {
                case 3:
                  // 下拉框
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (Array.isArray(specialVal.selectorStaticList) &&
                      specialVal.selectorStaticList.length > 1 &&
                      specialVal.selectorStaticList[0].name !== '静态选择' &&
                      specialVal.dataSourceUrl
                    ) {
                      self.$message.warning('在有静态数据的情况下将不会远程请求选项')
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
                case 4:
                  // 复选框
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (!Array.isArray(specialVal.checkboxList) ||
                      specialVal.checkboxList.length < 2
                    ) {
                      self.$message.error('请填写至少两条复选框')
                      return false
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
                case 5:
                  // 单选框
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (!Array.isArray(specialVal.radioList) ||
                      specialVal.radioList.length < 2
                    ) {
                      self.$message.error('请填写至少两条单选框')
                      return false
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
                case 6:
                  // 附件
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (!Array.isArray(specialVal.fileList) ||
                      specialVal.fileList.length < 1
                    ) {
                      self.$message.error('请填写至少一个附件')
                      return false
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
                case 9:
                  // 文本链接
                  try {
                    let specialVal = JSON.parse(self.filedDialog.model.specialVal)
                    if (specialVal.linkObj.link === '' || specialVal.linkObj.linkText === '' || specialVal.linkObj.tipText === '') {
                      self.$message.error('请完善文本链接信息')
                      return false
                    }
                  } catch (e) {
                    console.log(e)
                    self.$message.error('请填写正确的JSON格式')
                    return false
                  }
                  break
              }
              eapi.createTpl({
                data: {
                  'tempCode': self.filedDialog.model.tempCode,
                  'tempName': self.filedDialog.model.tempName,
                  'placeholder': '',
                  'systemId': self.companyObj.system.sysValue,
                  'userType': self.companyObj.role.roleValue,
                  'parentId': self.moduleTable.currentRow.id,
                  'remark': self.filedDialog.model.remark,
                  'type': tplType,
                  'dataSourceUrl': self.filedDialog.model.dataSourceUrl,
                  'specialVal': self.filedDialog.model.specialVal || null,
                  'regex': self.filedDialog.model.regex,
                  'isRequired': self.filedDialog.model.isRequired
                },
                success: function (res) {
                  self.$message.success('创建成功')
                  self.queryTpl(true, function () {
                    self.$refs.moduleTable.setCurrentRow(self.moduleTable.data[self.moduleTable.currentRowIndex])
                  })
                  self.closeDialog(true)
                }
              })
            }
          })
        }).catch(() => {
        })
      }
    },
    moveRecord: function (e, scope, moveType, isChild) {
      e.stopPropagation()
      let self = this
      if (moveType === 'up') {
        // 上移
        if (scope.$index === 0) {
          self.$message.error('已经到顶部了')
        } else {
          let id1 = isChild ? self.fieldTable.data[scope.$index].id : self.moduleTable.data[scope.$index].id
          let id2 = isChild ? self.fieldTable.data[scope.$index - 1].id : self.moduleTable.data[scope.$index - 1].id
          eapi.moveRecord({
            data: [id1, id2],
            success: function (res) {
              self.queryTpl(true, function () {
                if (isChild) {
                  self.$refs.moduleTable.setCurrentRow(self.moduleTable.data[self.moduleTable.currentRowIndex])
                }
              })
            }
          })
        }
      } else if (moveType === 'down') {
        // 下移
        if (scope.$index !== (isChild ? self.fieldTable.data.length : self.moduleTable.data.length) - 1) {
          let id1 = isChild ? self.fieldTable.data[scope.$index].id : self.moduleTable.data[scope.$index].id
          let id2 = isChild ? self.fieldTable.data[scope.$index + 1].id : self.moduleTable.data[scope.$index + 1].id
          eapi.moveRecord({
            data: [id1, id2],
            success: function (res) {
              self.queryTpl(true, function () {
                if (isChild) {
                  self.$refs.moduleTable.setCurrentRow(self.moduleTable.data[self.moduleTable.currentRowIndex])
                }
              })
            }
          })
        } else {
          self.$message.error('已经到底部了')
        }
      }
    },
    changeCurRowIndex: function (row, column, e) {
      let self = this
      self.moduleTable.currentRowIndex = row.idx
    },
    delRecord: function (row, isChild) {
      let self = this
      self.$confirm('是否删除当前记录？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        eapi.deleteTpl({
          data: [row.id],
          success: function (res) {
            self.$message.success('删除成功')
            if (isChild) {
              self.queryTpl(true, function () {
                if (isChild) {
                  self.$refs.moduleTable.setCurrentRow(self.moduleTable.data[self.moduleTable.currentRowIndex])
                }
              })
            } else {
              self.queryTpl()
            }
            self.closeDialog()
          }
        })
      }).catch(() => {
      })
    },
    addKeyValue: function (e, type) {
      let self = this
      let idx = parseInt(e.currentTarget.getAttribute('idx'))
      switch (type) {
        case 4:
          // 复选
          self.filedDialog.external.checkboxList.splice(idx + 1, 0, {
            name: '',
            value: '',
            defaultPicked: false
          })
          self.resetSpecialVal(type)
          break
        case 5:
          // 单选
          self.filedDialog.external.radioList.splice(idx + 1, 0, {
            name: '',
            value: '',
            defaultPicked: false
          })
          self.resetSpecialVal(type)
          break
        case 6:
          // 附件
          self.filedDialog.external.fileList.splice(idx + 1, 0, {
            filename: '',
            demolink: '',
            defaultPicked: false
          })
          self.resetSpecialVal(type)
          break
      }
    },
    removeKeyValue: function (e, type) {
      let self = this
      let idx = parseInt(e.currentTarget.getAttribute('idx'))
      switch (type) {
        case 4:
          self.filedDialog.external.checkboxList.splice(idx, 1)
          if (self.filedDialog.external.checkboxList.length === 0) {
            self.filedDialog.external.checkboxList = [
              {
                name: '',
                value: '',
                defaultPicked: false
              }
            ]
          }
          self.resetSpecialVal(type)
          break
        case 5:
          self.filedDialog.external.radioList.splice(idx, 1)
          if (self.filedDialog.external.radioList.length === 0) {
            self.filedDialog.external.radioList = [
              {
                name: '',
                value: '',
                defaultPicked: false
              }
            ]
          }
          self.resetSpecialVal(type)
          break
        case 6:
          self.filedDialog.external.fileList.splice(idx, 1)
          if (self.filedDialog.external.fileList.length === 0) {
            self.filedDialog.external.fileList = [
              {
                filename: '',
                demolink: '',
                defaultPicked: false
              }
            ]
          }
          self.resetSpecialVal(type)
          break
      }
    },
    resetSpecialVal: function (type, idx) {
      // 更新specialVal字段
      let self = this
      let jsonStr = self.filedDialog.model.specialVal || '{}'
      try {
        let jsonObj = JSON.parse(jsonStr)
        switch (type) {
          case 3:
            jsonObj.selectorQuery = {
              qkey: self.filedDialog.model.qkey,
              respath: self.filedDialog.model.respath,
              method: self.filedDialog.model.method,
              resname: self.filedDialog.model.resname,
              resval: self.filedDialog.model.resval
            }
            if (!Array.isArray(jsonObj.selectorStaticList) || jsonObj.selectorStaticList.length === 0) {
              jsonObj.selectorStaticList = [
                {
                  name: '静态选择',
                  value: '静态选择'
                }
              ]
            }
            self.filedDialog.model.specialVal = JSON.stringify(jsonObj, null, 4)
            break
          case 4:
            jsonObj.checkboxList = self.filedDialog.external.checkboxList
            self.filedDialog.model.specialVal = JSON.stringify(jsonObj, null, 4)
            break
          case 5:
            if (idx !== undefined) {
              let newList = self.filedDialog.external.radioList
              newList.forEach(function (item, index) {
                if (idx === index) {
                  item.defaultPicked = true
                } else {
                  item.defaultPicked = false
                }
              })
              self.filedDialog.external.radioList = newList
            }
            jsonObj.radioList = self.filedDialog.external.radioList
            self.filedDialog.model.specialVal = JSON.stringify(jsonObj, null, 4)
            break
          case 6:
            if (idx !== undefined) {
              let newList = self.filedDialog.external.fileList
              newList.forEach(function (item, index) {
                if (idx === index) {
                  item.defaultPicked = true
                } else {
                  item.defaultPicked = false
                }
              })
              self.filedDialog.external.fileList = newList
            }
            jsonObj.fileList = self.filedDialog.external.fileList
            self.filedDialog.model.specialVal = JSON.stringify(jsonObj, null, 4)
            break
          case 9:
            jsonObj.linkObj = self.filedDialog.external.linkObj
            self.filedDialog.model.specialVal = JSON.stringify(jsonObj, null, 4)
            break
          default:
            console.log('没有匹配的类型')
        }
      } catch (e) {
        self.$message.error('请填写正确的JSON格式')
      }
    },
    changeType: function (val) {
      let self = this
      self.filedDialog.model.specialVal = ''
      switch (val) {
        case 3:
          self.resetSpecialVal(val)
          self.changeCmReadStatus(false)
          // 修改rules
          self.filedDialog.rules = {
            isRequired: [
              {
                required: true, message: '请选择是否必填', trigger: 'blur'
              }
            ],
            tempName: [
              {
                required: true, message: '请输入模块名称', trigger: 'blur'
              }
            ],
            qkey: [
              {
                required: true, message: '请输入搜索参数', trigger: 'blur'
              }
            ],
            method: [
              {
                required: true, message: '请选择请求方式', trigger: 'blur'
              }
            ],
            respath: [
              {
                required: true, message: '请输入返回值路径', trigger: 'blur'
              }
            ],
            resname: [
              {
                required: true, message: '请输入返回name字段', trigger: 'blur'
              }
            ],
            resval: [
              {
                required: true, message: '请输入返回value字段', trigger: 'blur'
              }
            ],
            dataSourceUrl: [
              {
                required: true, message: '请输入查询接口', trigger: 'blur'
              }
            ]
          }
          break
        case 4:
          self.changeCmReadStatus(true)
          self.resetSpecialVal(val)
          break
        case 5:
          self.changeCmReadStatus(true)
          self.resetSpecialVal(val)
          break
        case 9:
          self.changeCmReadStatus(true)
          self.resetSpecialVal(val)
          break
        default:
          self.changeCmReadStatus(false)
      }
    },
    changeCmReadStatus: function (readOnly) {
      let self = this
      self.$refs.jsonCm.codemirror.setOption('readOnly', readOnly)
    },
    prevTpl: function () {
      let self = this
      if (self.companyObj.company.companyValue === '' || self.companyObj.system.sysValue === '' || self.companyObj.role.roleValue === '') {
        self.$message.error('请选择公司、系统及角色')
        return false
      } else {
        // 预览资质认证效果
        window.open(`${config.publicServerHostList.userSsoHost}/auth/register?cur_step=1&cp_id=${self.companyObj.company.companyValue}&sys_id=${self.companyObj.system.sysValue}&role_id=${self.companyObj.role.roleValue}&is_redirect=0`)
      }
    },
    clearCompany: function () {
      let self = this
      // 清空业务系统
      self.companyObj.system = {
        sysCode: '',
        sysValue: '',
        isLoading: false
      }
      self.companyObj.role = {
        roleCode: '',
        roleValue: '',
        roleList: [],
        isLoading: false
      }
      self.moduleTable.data = []
      self.fieldTable.data = []
    },
    clearSystem: function () {
      let self = this
      self.companyObj.role = {
        roleCode: '',
        roleValue: '',
        isLoading: false
      }
      self.moduleTable.data = []
      self.fieldTable.data = []
    },
    clearRole: function () {
      let self = this
      self.moduleTable.data = []
      self.fieldTable.data = []
      self.companyObj.role = {
        roleCode: '',
        roleValue: '',
        isLoading: false
      }
      self.queryRole()
    }
  }
}
</script>

<style lang="scss" scoped>
  .default-checked{
    padding-left: 20px;
  }
</style>
