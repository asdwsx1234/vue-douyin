<template>
<transition name="up">
  <div class="atList-wrap" v-if="showFlag">
    <my-header title="@好友" :hasBack="true" :goBack="hide"></my-header>
    <list-view :hasMessageBtn="false" :data="groups" :list="list" @select="chooseUser"></list-view>
  </div>
</transition>
</template>

<script>
import MyHeader from 'components/MyHeader/MyHeader'
import ListView from 'base/listview/listview'
import { mapGetters } from 'vuex'
import { getPinYinFirstCharacter } from 'common/js/pinyin'
export default {
  data () {
    return {
      showFlag: false,
      groups: [],
      list: []
    }
  },
  methods: {
    show () {
      this.$axios.get(`/api/user/${this.loginInfo.userId}/getContact`).then(r => {
        this.list = r.data.data
        this.groups = this._normalizeContact(r.data.data)
      })
      this.showFlag = true
    },
    hide () {
      this.showFlag = false
    },
    chooseUser (item) {
      this.$emit('chooseUser', item)
    },
    _normalizeContact (list) {
      let map = {
        character: {
          title: '#',
          items: []
        }
      }
      list.forEach((item, index) => {
        let key = getPinYinFirstCharacter(item.userNickname).toUpperCase()
        if (key.match(/[a-zA-Z]/)) {
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
        } else {
          key = 'character'
        }
        map[key].items.push(item)
      })
      let character = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === '#') {
          character.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      ret = [{ title: '#search' }].concat(ret)
      return ret.concat(character)
    }
  },
  computed: {
    ...mapGetters([
      'loginInfo'
    ])
  },
  components: {
    MyHeader,
    ListView
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.up-enter-active, .up-leave-active
  transition all .5s
.up-enter, .up-leave-to
  opacity 0
  transform translateY(100%)
.atList-wrap
  position fixed
  top 0
  bottom 0
  left 0
  right 0
</style>
