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

export const getFollowerList = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/Followers`)
  if (res.data.code === 200) {
    let followerList = res.data.data
    commit(types.SET_FOLLOWERLIST, followerList)
  }
}

export const getFanList = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/Fans`)
  if (res.data.code === 200) {
    let fanList = res.data.data
    commit(types.SET_FANLIST, fanList)
  }
}

export const getLikeList = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/Likes`)
  if (res.data.code === 200) {
    let likeList = res.data.data
    commit(types.SET_LIKELIST, likeList)
  }
}

export const getVideoList = async ({ commit, state }, userId) => {
  let res = await instance.get(`/api/user/${userId}/Videos`)
  if (res.data.code === 200) {
    let videoList = res.data.data
    commit(types.SET_VIDEOLIST, videoList)
  }
}
