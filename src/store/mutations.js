import * as types from './mutation-types'

const mutations = {
  [types.SET_ISLOGGED] (state, isLogged) {
    state.isLogged = isLogged
  },
  [types.SET_LOGININFO] (state, loginInfo) {
    state.loginInfo = loginInfo
  },
  [types.SET_FANUNREADNUM] (state, fanUnreadNum) {
    state.fanUnreadNum = fanUnreadNum
  },
  [types.SET_BYLIKEUNREADNUM] (state, byLikeUnreadNum) {
    state.byLikeUnreadNum = byLikeUnreadNum
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
  },
  [types.SET_POPULARVIDEO] (state, popularVideo) {
    state.popularVideo = popularVideo
  },
  [types.SET_PLAYLIST] (state, playList) {
    state.playList = playList
  }
}

export default mutations
