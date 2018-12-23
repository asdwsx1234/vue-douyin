import * as types from './mutation-types'

export const Login = ({ commit, state }, data) => {
  // post
  let loginInfo = {}
  commit(types.SET_LOGININFO, loginInfo)
}
