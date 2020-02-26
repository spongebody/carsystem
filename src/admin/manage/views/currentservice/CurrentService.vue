<template>
  <div class="com-page">
    <div class="card-container">
      <el-card class="box-card" v-for="(card, index) in cards" :key="index" shadow="hover">
        <div class="card-content">
          <div class="profile">
            <el-form
              class="com-form"
              size="mini"
            >
              <div class="com-pannel">
                <el-col :span="24">
                  <el-form-item label-width="110px" label="日期：" prop="driver">
                    <!--               logo -->
                    <span>2019年11月19日</span>
                  </el-form-item>
                </el-col>
              </div>
              <div class="com-pannel">
                <el-col :span="24">
                  <el-form-item label-width="110px" label="用车时间：">
                    <span>16:29</span>
                  </el-form-item>
                </el-col>
              </div>
              <div class="com-pannel">
                <el-col :span="24">
                  <el-form-item label-width="110px" label="从：">
                    <span>长城万富汇</span> <span>      到： 市政府</span> <span>    经停： 空</span>
                  </el-form-item>
                </el-col>
              </div>
              <div class="com-pannel">
                <el-col :span="24">
                  <el-form-item label-width="110px" label="车型：" prop="tel">
                    <span>舒适5座</span>
                  </el-form-item>
                </el-col>
              </div>
              <div class="com-pannel">
                <el-col :span="24">
                  <el-form-item label-width="110px" label="备注：" prop="tel">
                    <span>需使用半天</span>
                  </el-form-item>
                </el-col>
              </div>
              <div class="com-pannel">
                <el-col :span="24">
                  <el-form-item label-width="110px" label="乘车人：" prop="tel">
                    <span>小芳</span>
                  </el-form-item>
                </el-col>
              </div>
              <div class="com-pannel">
                <el-col :span="24">
                  <el-form-item label-width="110px" label="电话：" prop="tel">
                    <span>13507318888</span>
                  </el-form-item>
                </el-col>
              </div>
              <div class="com-pannel">
                <el-col :span="12">
                  <el-form-item label-width="110px" label="公里数：" prop="tel">
                    <el-input disabled="true"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label-width="110px" label="时长：" prop="tel">
                    <el-input disabled="true"></el-input>
                  </el-form-item>
                </el-col>
              </div>
              <div class="com-pannel op-btn-list">
                  <el-row class="search-row">
                    <el-col  :span="24" style="text-align:center;">
                      <el-form-item>
                        <el-button type="primary" size="mini" @click="toggleService"
                        >{{isService ? '服务结束' : '开始服务'}}</el-button
                        >
                        <el-button size="mini" @click="cleanQuery">{{ isService ? '经停' : '取消' }}</el-button>
                      </el-form-item>
                    </el-col>
                  </el-row>
              </div>
            </el-form>
          </div>
        </div>
      </el-card>
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
      cards: [],
      isService: false
    }
  },
  created: function () {
    let self = this
    self.getCards()
  },
  mounted: function () {},
  computed: {
    ...mapGetters(['isMobile'])
  },
  methods: {
    getCards: function (isRefresh) {
      let self = this
      api.getCards({
        data: {
        },
        success: function (res) {
          console.log(res)
          self.cards = res.data.data.records || []
        },
        fail: function (err) {
          console.log(err)
          self.$message.error(err.data.message)
        }
      })
    },
    toggleService: function () {
      let self = this
      self.isService = !self.isService
    }
  }
}
</script>

<style scoped lang="scss">
  .box-card {
    margin: 5px;
    width: 30%;
  }
  .card-container {
    display: flex;
    padding: 20px;
    flex-wrap: wrap;
  }

  @media screen and (max-width: 760px) {
    .card-container {
      display: flex;
      padding: 20px;
      flex-direction: column;
      .box-card {
        width: 100%;
      }
    }
  }

</style>
<style lang="scss"></style>
