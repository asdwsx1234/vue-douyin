import * as types from './mutation-types'
import axios from 'axios'
import { baseURL } from 'common/js/config'
const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true
})

export const loginByPassword = async ({ dispatch, commit, state }, user) => {
  let res = await instance.post('/api/common/user/loginByPassword', user)
  if (res.data.code === 200) {
    let userId = res.data.data.userId
    commit(types.SET_ISLOGGED, true)
    let res1 = await instance.get(`/api/user/${userId}/getUserInfo/undefined`)
    if (res1.data.code === 200) {
      let loginInfo = res1.data.data
      commit(types.SET_LOGININFO, loginInfo)
      dispatch('getFanUnreadNum', loginInfo.userId)
      dispatch('getByLikeUnreadNum', loginInfo.userId)
      dispatch('getByCommentUnreadNum', loginInfo.userId)
      dispatch('getAtUnreadNum', loginInfo.userId)
      dispatch('getFollowedNewsNum', loginInfo.userId)
      dispatch('getAllPrivateLetter', loginInfo.userId)
    }
  }
}

export const persistentConnection = async ({ dispatch, commit, state }) => {
  let res = await instance.get('/api/user/persistent/getUserInfo/undefined')
  if (res.data.code === 200) {
    let loginInfo = res.data.data
    commit(types.SET_ISLOGGED, true)
    commit(types.SET_LOGININFO, loginInfo)
    dispatch('getFanUnreadNum', loginInfo.userId)
    dispatch('getByLikeUnreadNum', loginInfo.userId)
    dispatch('getByCommentUnreadNum', loginInfo.userId)
    dispatch('getAtUnreadNum', loginInfo.userId)
    dispatch('getFollowedNewsNum', loginInfo.userId)
    dispatch('getAllPrivateLetter', loginInfo.userId)
    return {
      code: 200
    }
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
      popularVideo.push(video)
    }
    let resultList = state.popularVideo
    commit(types.SET_POPULARVIDEO, resultList.concat(popularVideo))
  }
}

export const getFanUnreadNum = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/FanUnreadNum`)
  if (res.data.code === 200) {
    commit(types.SET_FANUNREADNUM, res.data.data)
  } else {
  }
}

export const getByLikeUnreadNum = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/byLikeUnreadNum`)
  if (res.data.code === 200) {
    commit(types.SET_BYLIKEUNREADNUM, res.data.data)
  } else {
  }
}

export const getByCommentUnreadNum = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/byCommentUnreadNum`)
  if (res.data.code === 200) {
    commit(types.SET_BYCOMMENTUNREADNUM, res.data.data)
  } else {
  }
}

export const getAtUnreadNum = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/getAtUnreadNum`)
  if (res.data.code === 200) {
    commit(types.SET_ATNUM, res.data.data)
  } else {
  }
}

export const getFollowedNewsNum = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/followedNewsNum`)
  if (res.data.code === 200) {
    commit(types.SET_FOLLOWEDNEWSNUM, res.data.data)
  } else {
  }
}

export const getAllPrivateLetter = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/getAllPrivateLetter`)
  if (res.data.code === 200) {
    let list = res.data.data
    list.sort((a, b) => b.createdAt - a.createdAt)
    commit(types.SET_ALLPRIVATELETTER, res.data.data)
  }
}
