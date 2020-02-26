<template>
  <div class="com-title clear">
    <div class="com-title-text">{{ title }}</div>
    <ul>
      <li v-for="(item, index) in btnlist" :key="index" v-html="item.text" @click="togger(item.method)">
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ComTitle',
  props: {
    title: {
      type: String
    },
    btnlist: {
      type: Array
    }
  },
  methods: {
    togger: function (method) {
      let self = this
      self.$emit('togger', method)
    }
  }
}
</script>

<style scoped lang="scss">
  @import "../../../../assets/scss/manage/comtitle";
</style>
