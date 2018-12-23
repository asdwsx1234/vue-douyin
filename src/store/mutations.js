import * as types from './mutation-types'

const mutations = {
  [types.SET_LOGININFO] (state, loginInfo) {
    state.loginInfo = loginInfo
  }
}

export default mutations
