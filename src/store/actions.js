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
    let res1 = await instance.get(`/api/user/${userId}/getUserInfo`)
    if (res1.data.code === 200) {
      let loginInfo = res1.data.data
      commit(types.SET_LOGININFO, loginInfo)
    }
  }
}

export const register = async ({ commit, state }, user) => {
  let res = await instance.post('/api/common/user/Register', user)
  if (res.data.code === 200) {
    let newUser = res.data.data.newUser
    loginByPassword(newUser)
  }
}

export const persistentConnection = async ({ commit, state }) => {
  let res = await instance.get('/api/user/persistent/getUserInfo')
  if (res.data.code === 200) {
    let loginInfo = res.data.data
    commit(types.SET_ISLOGGED, true)
    commit(types.SET_LOGININFO, loginInfo)
  } else {
    commit(types.SET_ISLOGGED, false)
    commit(types.SET_LOGININFO, {})
  }
}

export const getFollowerNum = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/FollowersNum`)
  if (res.data.code === 200) {
    let followerNum = res.data.data
    commit(types.SET_FOLLOWERNUM, followerNum)
  }
}

export const getFanNum = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/FansNum`)
  if (res.data.code === 200) {
    let fanNum = res.data.data
    commit(types.SET_FANNUM, fanNum)
  }
}

export const getLikeNum = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/LikesNum`)
  if (res.data.code === 200) {
    let likeNum = res.data.data
    commit(types.SET_LIKENUM, likeNum)
  }
}

export const getVideoNum = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/VideosNum`)
  if (res.data.code === 200) {
    let videoNum = res.data.data
    commit(types.SET_VIDEONUM, videoNum)
  }
}

export const getPopularVideo = async ({ commit, state }) => {
  let res = await instance.get('/api/common/video/getPopularVideo')
  if (res.data.code === 200) {
    let popularVideo = res.data.data
    commit(types.SET_POPULARVIDEO, popularVideo)
  }
}
