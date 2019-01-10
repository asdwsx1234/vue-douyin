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
  [types.SET_BYCOMMENTUNREADNUM] (state, byCommentUnreadNum) {
    state.byCommentUnreadNum = byCommentUnreadNum
  },
  [types.SET_ALLPRIVATELETTER] (state, allPrivateLetter) {
    state.allPrivateLetter = allPrivateLetter
  },
  [types.SET_POPULARVIDEO] (state, popularVideo) {
    state.popularVideo = popularVideo
  },
  [types.SET_PLAYLIST] (state, playList) {
    state.playList = playList
  }
}

export default mutations
