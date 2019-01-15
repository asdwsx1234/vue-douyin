<template>
<div class="contact-wrap">
  <my-header title="选择联系人" :hasBack="true" :goBack="goBack"></my-header>
  <list-view :data="groups" :list="list" @select="chooseUser"></list-view>
</div>
</template>

<script>
import MyHeader from 'components/MyHeader/MyHeader'
import ListView from 'base/listview/listview'
import { mapGetters } from 'vuex'
import { getPinYinFirstCharacter } from 'common/js/pinyin'
export default {
  created () {
    this.$axios.get(`/api/user/${this.loginInfo.userId}/getContact`).then(r => {
      this.list = r.data.data
      this.groups = this._normalizeContact(r.data.data)
    })
  },
  data () {
    return {
      groups: [],
      list: []
    }
  },
  methods: {
    goBack () {
      this.$router.push('/message')
    },
    chooseUser (item) {
      this.$router.push(`/profile/${item.userId}`)
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
.contact-wrap
  position fixed
  top 0
  bottom 0
  left 0
  right 0
</style>
