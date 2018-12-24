import * as types from './mutation-types'

const mutations = {
  [types.SET_ISLOGGED] (state, isLogged) {
    state.isLogged = isLogged
  },
  [types.SET_LOGININFO] (state, loginInfo) {
    state.loginInfo = loginInfo
  },
  [types.SET_FOLLOWERNUM] (state, followerNum) {
    state.followerNum = followerNum
  },
  [types.SET_FANNUM] (state, fanNum) {
    state.fanNum = fanNum
  },
  [types.SET_LIKENUM] (state, likeNum) {
    state.likeNum = likeNum
  },
  [types.SET_VIDEONUM] (state, videoNum) {
    state.videoNum = videoNum
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
  }
}

export default mutations
