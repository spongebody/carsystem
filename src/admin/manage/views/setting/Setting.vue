<template>
  <div class="com-page-ctx">
    <div class="com-table">
      <div class="s-form">
        <div class="table-header clear">
          <strong>首页快捷入口编辑</strong>
        </div>
        <div class="com-table-detail min-height bdt bdb bg">
          <el-transfer class="com-transfer" v-model="picked" :data="ablePick" :titles="['未选列表', '已选列表']"></el-transfer>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Base from '@js/base'
import { mapGetters } from 'vuex'

export default {
  name: 'Setting',
  extends: Base,
  data () {
    return {
      picked: [],
      ablePick: []
    }
  },
  created: function () {
    let self = this
    self.getMenu()
  },
  computed: {
    ...mapGetters([
      'homeQuickList',
      'menuInfo'
    ])
  },
  methods: {
    getMenu: function () {
      let self = this
      let key = 0
      for (let i = 0; i < self.menuInfo.menuList.length; i++) {
        let thisModule = self.menuInfo.menuList[i]
        for (let m = 0; m < thisModule.children.length; m++) {
          let thisItem = thisModule.children[m]
          if (thisItem.router) {
            self.ablePick.push({
              key: key,
              label: thisItem.title,
              cp: thisItem.router,
              icon: thisItem.icon
            })
            key++
            continue
          } else {
            for (let j = 0; j < thisItem.children.length; j++) {
              let thisSubItem = thisItem.children[j]
              if (thisSubItem.type !== 'wnode') {
                // 不是伪节点的时候
                if (thisSubItem.router) {
                  self.ablePick.push({
                    key: key,
                    label: thisSubItem.title,
                    cp: thisSubItem.router,
                    icon: thisItem.icon
                  })
                  key++
                  continue
                } else {
                  for (let l = 0; l < thisSubItem.children.length; l++) {
                    let thisSubSubItem = thisSubItem.children[l]
                    self.ablePick.push({
                      key: key,
                      label: thisSubSubItem.title,
                      cp: thisSubSubItem.router,
                      icon: thisItem.icon
                    })
                    key++
                  }
                }
              } else {
                for (let k = 0; k < thisSubItem.children.length; k++) {
                  let thisSubSubItem = thisSubItem.children[k]
                  if (thisSubSubItem.router) {
                    self.ablePick.push({
                      key: key,
                      label: thisSubSubItem.title,
                      cp: thisSubSubItem.router,
                      icon: thisItem.icon
                    })
                    key++
                    continue
                  } else {
                    for (let l = 0; l < thisSubSubItem.children.length; l++) {
                      let thisSubSubSubItem = thisSubSubItem.children[l]
                      self.ablePick.push({
                        key: key,
                        label: thisSubSubSubItem.title,
                        cp: thisSubSubSubItem.router,
                        icon: thisItem.icon
                      })
                      key++
                    }
                  }
                }
              }
            }
          }
        }
      }
      self.picked = self.homeQuickList.homeQuickIndex
    },
    updateHomeQuick: function () {
      let self = this
      let temArray = []
      self.picked.forEach(function (item, index) {
        temArray.push(self.ablePick[item])
      })
      self.$store.commit('updateHomeQuickList', { homeQuickList: temArray, homeQuickIndex: self.picked })
      localStorage.setItem('homeQuickList', JSON.stringify({ homeQuickList: temArray, homeQuickIndex: self.picked }))
    }
  },
  watch: {
    picked: function () {
      let self = this
      self.updateHomeQuick()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
