<template>
  <div class="com-page">
    <el-form class="com-form" ref="form" size="mini" label-width="110px">
      <div class="com-pannel-wrp">
        <div class="com-pannel">
          <el-row class="search-row">
            <el-col :xs="24" :sm="12" :md="8" :lg="4">
              <el-form-item label="日志范围：" label-width="90px">
                <el-select v-model="dateRange" placeholder="日志范围" @change="changeDateRange">
                  <el-option :title="item.name" :label="item.name" :value="item.value" v-for="(item, index) in dateList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="com-table mt">
        <div class="table-header clear">
          <strong>前端日志</strong>
          <ul>
            <li :class="[index % 2 === 0 ? 'double' : 'single']" v-for="(item, index) in dataOp" :key="index" v-html="item.text" @click="togger(item.method, item.params)">
            </li>
          </ul>
        </div>
        <div class="com-table-detail">
          <el-table
            v-loading="logTable.isLoading"
            :data="logTable.data"
            header-row-class-name="com-table-header"
            header-cell-class-name="com-table-header-cell"
            border
            :max-height="maxHeight"
            ref="table"
            style="width: 100%;">
            <el-table-column fixed label="序号" width="50" align="center">
              <template slot-scope="scope">
                <span>{{ (logTable.pagingInfo.currentPage - 1) * logTable.pagingInfo.pageSize + scope.$index + 1 }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="descriptor"
              label="日志描述"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="level"
              label="日志类型"
              show-overflow-tooltip
              width="120"
            >
            </el-table-column>
            <el-table-column
              prop="time"
              label="日志时间"
              show-overflow-tooltip
              :formatter="changeTime"
              width="180"
            >
            </el-table-column>
            <el-table-column
              label="操作"
              width="60"
              align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small"  @click="showDetail(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="com-pagination">
          <el-pagination
            @size-change="paginationOnSizeChange"
            @current-change="paginationOnCurrentPageChange"
            :current-page="logTable.pagingInfo.currentPage"
            :page-sizes="[10, 30, 50]"
            :page-size="logTable.pagingInfo.pageSize"
            :layout="isMobile ? 'total, sizes, prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
            :total="logTable.pagingInfo.totalRows">
          </el-pagination>
        </div>
      </div>
    </el-form>
    <el-dialog :title="logDialog.props.title" :visible.sync="logDialog.props.visible"
               :close-on-click-modal="false" @close="closeDetailDialog">
      <div class="com-dialog-s-title">基础数据</div>
      <el-form class="com-form" ref="form" size="mini">
        <div class="com-pannel">
          <el-col :span="12">
            <el-form-item label-width="82px" label="日志描述：">
              <el-input v-model="logDialog.model.level" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label-width="82px" label="日志时间：">
              <el-input v-model="logDialog.model.time" :disabled="true">

              </el-input>
            </el-form-item>
          </el-col>
        </div>
        <div class="com-pannel">
          <el-col :span="24">
            <el-form-item label-width="82px" label="日志描述：">
              <el-input type="textarea" :rows="3" resize="none" v-model="logDialog.model.descriptor" :disabled="true">
              </el-input>
            </el-form-item>
          </el-col>
        </div>
      </el-form>
      <div class="com-dialog-s-title">自定义数据</div>
      <codemirror v-model="logDialog.model.data" :options="cmOptions"></codemirror>
    </el-dialog>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import 'codemirror/addon/hint/javascript-hint.js'
import 'codemirror/lib/codemirror.css'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/mode/javascript/javascript.js'
import { mapGetters } from 'vuex'

export default {
  name: 'Logline',
  extends: Base,
  data () {
    return {
      maxHeight: 1000,
      dataOp: [
        {
          text: '清空',
          method: 'cleanLog',
          params: null
        },
        {
          text: '导出',
          method: 'exportLog',
          params: null
        }
      ],
      logTable: {
        isLoading: false,
        data: [],
        columnList: ['序号', '日志描述', '日志类型', '日志时间', '数据'],
        pagingInfo: {
          currentPage: 1,
          pageSize: 10,
          totalRows: 0
        }
      },
      logDialog: {
        model: {},
        props: {
          title: '日志详情',
          visible: false
        }
      },
      dateList: [
        {
          name: '半天内',
          value: '.5d'
        },
        {
          name: '一天内',
          value: '1d'
        },
        {
          name: '七天内',
          value: '7d'
        }
      ],
      dateRange: '',
      cmOptions: {
        readOnly: true,
        tabSize: 4,
        mode: 'application/json',
        lineNumbers: true,
        line: true
      }
    }
  },
  created: function () {
    let self = this
    self.getLog()
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
    getLog: function () {
      let self = this
      self.logTable.isLoading = true
      window.Logline.getLog(self.dateRange, null, function (res) {
        res = res.reverse()
        self.logTable.pagingInfo.totalRows = res.length
        self.logTable.data = res.splice((self.logTable.pagingInfo.currentPage - 1) * self.logTable.pagingInfo.pageSize, self.logTable.pagingInfo.pageSize)
        self.logTable.isLoading = false
      })
    },
    exportLog: function () {
      let self = this
      window.Logline.getLog(self.dateRange, null, function (res) {
        let dataList = []
        res = res.reverse()
        res.forEach(function (item, index) {
          dataList.push({
            idx: index + 1,
            descriptor: item.descriptor,
            level: item.level,
            time: utils.timestampToDateString(item.time, '-', false, false),
            data: JSON.stringify(item.data)
          })
        })
        utils.exportExcel(self.logTable.columnList, dataList, '前端日志')
      })
    },
    cleanLog: function () {
      let self = this
      self.$confirm('是否清空日志？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.Logline.cleanLog()
        self.logTable.pagingInfo.currentPage = 1
        self.getLog()
        self.$message({
          type: 'success',
          message: '清空成功'
        })
      }).catch(() => {
      })
    },
    changeTime: function (row, column, cellValue, index) {
      if (cellValue) {
        return utils.timestampToDateString(cellValue, '-', false, false)
      } else {
        return '暂无修改时间'
      }
    },
    showDetail: function (row) {
      let self = this
      self.logDialog.props.visible = true
      let newObj = Object.assign({}, row)
      newObj.data = JSON.stringify(newObj.data, null, 4)
      newObj.time = utils.timestampToDateString(newObj.time, '-', false, false)
      self.logDialog.model = Object.assign({}, newObj)
    },
    paginationOnSizeChange: function (val) {
      let self = this
      self.logTable.pagingInfo.pageSize = val
      self.logTable.pagingInfo.currentPage = 1
      self.getLog()
    },
    paginationOnCurrentPageChange: function (val) {
      let self = this
      self.logTable.pagingInfo.currentPage = val
      self.getLog()
    },
    changeDateRange: function () {
      let self = this
      self.logTable.pagingInfo.currentPage = 1
      self.getLog()
    },
    closeDetailDialog: function () {
      let self = this
      self.logDialog.props.visible = false
      self.logDialog.model.data = ''
    }
  }
}
</script>

<style scoped lang="scss">
</style>
