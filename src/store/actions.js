import * as types from './mutation-types'
import axios from 'axios'
import { baseURL } from 'common/js/config'
const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true
})

export const loginByPassword = async ({ commit, state }, user) => {
  let res = await instance.post('/api/common/user/loginByPassword', user)
  if (res.data.code === 200) {
    let userId = res.data.data.userId
    commit(types.SET_ISLOGGED, true)
    let res1 = await instance.get(`/api/common/user/${userId}/getUserInfo`)
    if (res1.data.code === 200) {
      let loginInfo = res1.data.data
      commit(types.SET_LOGININFO, loginInfo)
    }
  }
}

export const persistentConnection = async ({ commit, state }) => {
  let res = await instance.get('/api/common/user/persistent/getUserInfo')
  if (res.data.code === 200) {
    let loginInfo = res.data.data
    commit(types.SET_ISLOGGED, true)
    commit(types.SET_LOGININFO, loginInfo)
  } else {
    commit(types.SET_ISLOGGED, false)
    commit(types.SET_LOGININFO, {})
  }
}

export const getPopularVideo = async ({ commit, state }) => {
  let res = await instance.get('/api/common/video/getPopularVideo')
  if (res.data.code === 200) {
    const list = res.data.data
    let popularVideo = []
    for (let i = 0; i < list.length; i++) {
      let video = JSON.parse(list[i])
      let WSLC = await instance.get(`/api/common/video/${video.videoInfo.videoId}/getVideoWSLCNum`)
      video.commentNum = WSLC.data.data.commentNum
      video.likeNum = WSLC.data.data.likeNum
      video.shareNum = WSLC.data.data.shareNum
      video.watchNum = WSLC.data.data.watchNum
      popularVideo.push(video)
    }
    commit(types.SET_POPULARVIDEO, popularVideo)
  }
}
