<template>
<scroll ref="listview"
  class="listview"
  :listenScroll= "listenScroll"
  :data="data"
  :probeType = "probeType"
  @scroll="scroll"
  >
  <ul>
    <li class="list-group" v-for="group in data" :key="group.title" ref="listGroup">
      <h2 class="list-group-title" v-if="group.title !== '#search' && !querykey">{{group.title}}</h2>
      <div class="search-bar-wrap" v-else-if="group.title === '#search'">
        <search-bar
          @query="query"></search-bar>
      </div>
      <ul v-if="!querykey">
        <li @click="selectItem(item)" v-for="item in group.items" :key="item.id" class="list-group-item">
          <img class="avatar" :src="`${baseURL}${item.userAvatar}`" width="50" height="50">
          <div class="main">
            <span class="name">{{item.userNickname}}</span>
            <span class="desc">{{item.userDesc}}</span>
          </div>
          <span v-if="hasMessageBtn" class="iconfont icon-message" @click.stop="chatWith(item)"></span>
        </li>
      </ul>
    </li>
  </ul>
  <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
    <ul>
      <li v-for="(item,index) in shortcutList"
      :class="{'current':currentIndex===index}"
      :data-index="index"
      :key="item"
      class="item">
        <p v-if="item === '#search'" class="iconfont icon-search"></p>
        <p v-else>{{item}}</p>
      </li>
    </ul>
  </div>
  <div class="list-fixed" v-show="fixedTitle" ref="fixed">
    <div class="fixed-title">{{fixedTitle}} </div>
  </div>
  <scroll class="search-list-wrap" v-if="querykey">
    <search-list
    @select="selectItem"
    :searches="searches"
    :hasMessageBtn="hasMessageBtn">
    </search-list>
  </scroll>
</scroll>
</template>

<script>
import SearchBar from 'base/searchBar/searchBar'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/searchList/searchList'
import { baseURL } from 'common/js/config'
import { getData } from 'common/js/dom'
import { getPinYinStringFirstCharacter, getPinYin } from 'common/js/pinyin'
const ANCHOR_HEIGHT = 18
const TITLE_HEIGHT = 30
export default {
  props: {
    data: {
      type: Array,
      default () {
        return []
      }
    },
    list: {
      type: Array,
      default () {
        return []
      }
    },
    hasMessageBtn: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this._calculateHeight()
  },
  data () {
    return {
      scrollY: -1,
      currentIndex: 0,
      diff: -1,
      querykey: '',
      searches: [],
      baseURL
    }
  },
  computed: {
    shortcutList () {
      return this.data.map((group) => {
        return group.title
      })
    },
    fixedTitle () {
      if (this.scrollY > -64) {
        return ''
      }
      return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
    }
  },
  created () {
    this.touch = {}
    this.listenScroll = true
    this.listHeight = []
    this.probeType = 3
  },
  methods: {
    query (q) {
      this.querykey = q
      if (!q) return
      this.searches = this.list.filter((item, index, arr) => {
        return item.userNickname.includes(q) || getPinYinStringFirstCharacter(item.userNickname, '').includes(q) || getPinYin(item.userNickname, '').includes(q)
      })
    },
    scroll (pos) {
      this.scrollY = pos.y
    },
    selectItem (item) {
      this.$emit('select', item)
    },
    chatWith (item) {
      this.$router.push({ path: `/ChatWith/${item.userId}`, query: { userNickname: item.userNickname, userAvatar: item.userAvatar } })
    },
    onShortcutTouchStart (e) {
      let anchorIndex = getData(e.target, 'index')
      let firstTouch = e.touches[0]
      this.touch.y1 = firstTouch.pageY
      this.touch.anchorIndex = anchorIndex
      this._scrollTo(anchorIndex)
    },
    onShortcutTouchMove (e) {
      let firstTouch = e.touches[0]
      this.touch.y2 = firstTouch.pageY
      let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
      let anchorIndex = parseInt(this.touch.anchorIndex) + delta
      this._scrollTo(anchorIndex)
    },
    _scrollTo (index) {
      if (!index & index !== 0) {
        return
      }
      if (index < 0) {
        index = 0
      } else if (index > this.listHeight.length - 2) {
        index = this.listHeight.length - 2
      }
      this.scrollY = -this.listHeight[index]
      this.$refs.listview.scrollToElement(this.$refs.listGroup[index], 0)
    },
    _calculateHeight () {
      this.listHeight = []
      const list = this.$refs.listGroup || []
      let height = 0 // 第一个list-item的初始高度
      this.listHeight.push(height)
      for (let i = 0; i < list.length; i++) {
        let item = list[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    }
  },
  watch: {
    data () {
      this.$nextTick(() => {
        this._calculateHeight()
      })
    },
    scrollY (newY) {
      const listHeight = this.listHeight
      // 滚到顶部，newY>0
      if (newY > -64) {
        this.currentIndex = 0
        return
      }
      for (let i = 0; i < listHeight.length - 1; i++) {
        let height1 = listHeight[i]
        let height2 = listHeight[i + 1]
        if (-newY >= height1 && -newY < height2) {
          this.currentIndex = i
          this.diff = height2 + newY
          return
        }
        this.currentIndex = listHeight.length - 2
      }
    },
    diff (newVal) {
      let fixedTop = (newVal > 0 && newVal < TITLE_HEIGHT) ? newVal - TITLE_HEIGHT : 0
      if (this.fixedTop === fixedTop) {
        return
      }
      this.fixedTop = fixedTop
      this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
    }
  },
  components: {
    Scroll,
    SearchBar,
    SearchList
  }
}
</script>

<style scoped lang='stylus'>
@import '~@/common/stylus/variable'
.listview
  position absolute
  width 100%
  margin-top 44px
  top 0
  bottom 0
  overflow hidden
  background $color-background
  .list-shortcut
    position absolute
    right 5px
    top 50%
    transform translateY(-50%)
    width 20px
    padding 20px 0
    border-radius 10px
    text-align center
    background $color-background-a
    font-family Helvetica
    .item
      padding 3px
      line-height 1
      color $color-text
      font-size $font-size-small
      &.current
        color $color-point
  .list-fixed
    position absolute
    top 0
    left 0
    width 100%
    .fixed-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-medium
      color $color-text
      background $color-background
  .list-group
    padding-bottom 10px
    .list-group-title
      height 30px
      line-height 30px
      padding-left 20px
      font-size $font-size-medium
      color $color-text
      background $color-background
    .list-group-item
      display flex
      align-items center
      padding 20px 0 0 20px
      .avatar
        border-radius 50%
      .main
        flex 1
        display flex
        flex-direction column
        margin-left 10px
        .name
          color $color-text
          font-size $font-size-medium
        .desc
          margin-top 10px
          color $color-desc
          font-size $font-size-small
      .icon-message
        margin-right 30px
        padding 10px
        font-size $font-size-large
  .search-bar-wrap
    padding 10px 20px
  .search-list-wrap
    position fixed
    top 118px
    bottom 0
    width 100%
    overflow hidden
</style>
