<template>
<div>
  <profile></profile>
</div>
</template>

<script>
import Profile from 'components/Profile/Profile'
export default {
  name: 'me',
  data () {
    return {
    }
  },
  methods: {
  },
  components: {
    Profile
  },
  beforeRouteEnter (to, from, next) {
    let names = ['InterestList', 'FanList']
    if (!names.includes(from.name) && typeof (from.params.id) === 'undefined') {
      localStorage.setItem('Routefrom', from.path)
    }
    next()
  }
}
</script>

<style scoped lang='stylus'>
</style>
