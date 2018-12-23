import * as types from './mutation-types'

const mutations = {
  [types.SET_ISLOGGED] (state, isLogged) {
    state.isLogged = isLogged
  },
  [types.SET_LOGININFO] (state, loginInfo) {
    state.loginInfo = loginInfo
  },
  [types.SET_FOLLOWERLIST] (state, followerList) {
    state.followerList = followerList
  },
  [types.SET_FANLIST] (state, fanList) {
    state.fanList = fanList
  },
  [types.SET_LIKELIST] (state, likeList) {
    state.likeList = likeList
  },
  [types.SET_VIDEOLIST] (state, videoList) {
    state.videoList = videoList
  }
}

export default mutations
