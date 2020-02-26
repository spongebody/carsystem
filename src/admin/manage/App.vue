<template>
  <div class="main-ctx">
    <router-view></router-view>
  </div>
</template>

<script>
import Root from '@js/root'
import utils from '@js/utils'

export default {
  name: 'App',
  extends: Root,
  created: function () {
    window.Logline = utils.Logline
    this.checkUser()
  },
  methods: {
    checkUser () {
      let user = localStorage.getItem('user')
      if (!user) {
        this.$router.push('/login')
      }
    }
  }
}
</script>

<style lang="css">
  @import "../../assets/font/addicon/iconfont.css";
</style>

<style lang="scss">
  @import "../../assets/scss/common";
</style>
