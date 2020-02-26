<template>
  <div class="com-page">
    <div class="send-car-form">
      <el-form ref="form" :model="form" label-width="100px" label-position="left">
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用车单位">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="乘车人电话">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="乘车人">
              <el-input v-model="form.person"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用车部门">
              <el-select v-model="form.dept" placeholder="请选择用车部门">
                <el-option label="销售部" value="seal"></el-option>
                <el-option label="技术部" value="teach"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="用车时间">
              <el-col :span="11">
                <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
              </el-col>
              <el-col class="line" :span="2" style="text-align: center">-</el-col>
              <el-col :span="11">
                <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
              </el-col>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="预计用车时长">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="结束时间">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="form.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center">-</el-col>
          <el-col :span="11">
            <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="接车位置">
              <el-select v-model="form.location" placeholder="请选择接车位置">
                <el-option label="长城万富汇" value="seal"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="经停点">
              <el-select v-model="form.stopLocation" placeholder="请选择经停点">
                <el-option label="长沙南站" value="seal"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="目的地">
              <el-select v-model="form.target" placeholder="请选择目的地">
                <el-option label="市政府" value="seal"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="订车人">
              <el-input v-model="form.admin"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="车型与人数">
              <el-select v-model="form.carPerson" placeholder="请选择车型">
                <el-option label="舒适五座" value="seal"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :xs="24" :sm="12" :md="8" :lg="6">
            <el-form-item label="其他要求">
              <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import utils from '@/assets/js/utils'
import api from '@api/usecar/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'SendCar',
  extends: Base,
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  created: function () {
  },
  mounted: function () {
  },
  computed: {
    ...mapGetters(['isMobile'])
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    }
  }
}
</script>

<style scoped lang="scss">
  .send-car-form {
    background: #FFFFFF;
    padding: 20px;
  }
</style>
<style lang="scss">
  .send-car-form {
    padding: 10px;
    margin: 10px;
    .el-select {
      width: 100%;
    }
  }
</style>
