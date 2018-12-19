const APIError = require('../rest').APIError
const UserRegister = require('../models/UserRegister')
const UserInfo = require('../models/UserInfo')
const UserRelation = require('../models/UserRelation')
const db = require('../db')

module.exports = {
  'GET /api/user/getUserInfo/:userId': async (ctx, next) => {
    const userId = ctx.params.userId
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const userInfo = await user.getUserInfo()
      ctx.rest(userInfo)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'POST /api/user/LoginByPassword': async (ctx, next) => {
    const user = {
      tel: ctx.request.body.tel,
      password: ctx.request.body.password
    }
    const result = await UserRegister.findOne({
      where: {
        'userTel': user.tel,
        'userPassword': user.password
      }
    })
    if (result) {
      ctx.rest(result)
    } else {
      throw new APIError('user:not_found', 'tel or password error')
    }
  }
}
