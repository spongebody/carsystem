<template>
  <div class="com-page">
    <div class="card-container">
        <div class="profile">
          <el-form
            class="com-form"
            size="mini"
          >
          <div class="com-pannel">
            <el-col :span="24">
              <el-form-item label-width="110px" label="长沙市政府：" prop="driver">
<!--               logo -->
                <el-image src=""></el-image>
              </el-form-item>
            </el-col>
           </div>
            <div class="com-pannel">
              <el-col :span="24">
                <el-form-item label-width="110px" label="常用部门列表：">
                  <span>销售部  行政部  技术部  商务部</span>
                </el-form-item>
              </el-col>
            </div>
            <div class="com-pannel">
              <el-col :span="24">
                <el-form-item label-width="110px" label="默认出发地点：" prop="tel">
                  <span>长城万富汇</span>
                </el-form-item>
              </el-col>
            </div>
            <div class="com-pannel">
              <el-col :span="24">
                <el-form-item label-width="110px" label="常用目的地：" prop="tel">
                  <span>城万富汇  长沙南站  市政府  省人民医院  黄花机场</span>
                </el-form-item>
              </el-col>
            </div>
            <div class="com-pannel">
              <el-col :span="24">
                <el-form-item label-width="110px" label="常用车型：" prop="tel">
                  <span>商务7座  舒适5座</span>
                </el-form-item>
              </el-col>
            </div>
            <div class="com-pannel">
              <el-col :span="24">
                <el-form-item label-width="110px" label="常用订车人：" prop="tel">
                  <span>米米 小芳 小白 </span>
                </el-form-item>
              </el-col>
            </div>
            <div class="com-pannel">
              <el-col :span="24">
                <el-form-item label-width="110px" label="管理员：" prop="tel">
                  <span>米米</span>
                </el-form-item>
              </el-col>
            </div>
          </el-form>
        </div>
    </div>
  </div>
</template>

<script>
import Base from '@/assets/js/base'
import api from '@api/usecar/apiMethod'
import { mapGetters } from 'vuex'

export default {
  name: 'SendCar',
  extends: Base,
  data () {
    return {
      cards: []
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
    }
  }
}
</script>

<style scoped lang="scss">
  .box-card {
    margin: 5px;
    width: 30%;
    .card-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      p {
        display: flex;
        justify-content: space-between;
        line-height: 24px;
        span:nth-child(1) {
          flex: 1;
        }
      }
    }
  }
  .card-container {
    margin: 20px;
    background: #FFFFFF;
    padding: 30px;
  }

</style>
<style lang="scss"></style>
