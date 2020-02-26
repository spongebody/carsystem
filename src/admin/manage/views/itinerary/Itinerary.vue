<template>
  <div class="com-page">
    <div class="card-container">
      <el-card class="box-card" v-for="(card, index) in cards" :key="index" shadow="hover">
        <div class="card-content">
          <div>
            <p>订单编号：201911XXXXXXXX</p>
            <p>日期：2019年11月19日 </p>
            <p>
              <span>乘车人：小芳  </span>
              <sapn class="ml30">乘车人电话：13507318888</sapn>
            </p>
            <p>
              <span>上车地点：长城万富汇 </span>
              <sapn class="ml30">上车时间：16:29</sapn>
            </p>
            <p>
              <span>结束地点：市政府      </span>
              <sapn class="ml30">预计结束时间：18:29</sapn>
            </p>
            <p>
              <span>车型： 舒适5座   </span>
              <sapn class="ml30">车牌号： 湘A98N16</sapn>
            </p>
            <p>
              <span>驾驶员： 李师傅 </span>
              <sapn class="ml30">驾驶员电话：13507316666</sapn>
            </p>
            <p>
              <span>预计公里数：11 Km</span>
              <span class="ml30">经停点一：长沙南站</span>
            </p>
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
      }
    }
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
        p {
          display: block;
        }
        p span {
          display: block;
        }
      }
    }
  }
</style>
<style lang="scss"></style>
