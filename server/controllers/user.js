const crypto = require('crypto')
const hash = crypto.createHash('md5')
const APIError = require('../rest').APIError
const UserRegister = require('../models/UserRegister')
const UserInfo = require('../models/UserInfo')
const db = require('../db')
module.exports = {
  'GET /api/user/:userId/UserInfo/': async (ctx, next) => {
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
  'GET /api/user/:userId/Fans': async (ctx, next) => {
    const userId = ctx.params.userId
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const fansList = await user.getFans()
      let UserinfoList = []
      for (let i = 0, len = fansList.length; i < len; i++) {
        let temp = fansList[i]
        let userinfo = await temp.getToUserInfo()
        UserinfoList.push(userinfo)
      }
      ctx.rest(UserinfoList)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/Followers': async (ctx, next) => {
    const userId = ctx.params.userId
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const FollowersList = await user.getFollowers()
      let UserinfoList = []
      for (let i = 0, len = FollowersList.length; i < len; i++) {
        let temp = FollowersList[i]
        let userinfo = await temp.getFromUserInfo()
        UserinfoList.push(userinfo)
      }
      ctx.rest(UserinfoList)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'POST /api/user/Register': async (ctx, next) => {
    const user = {
      tel: ctx.request.body.tel,
      password: hash.digest('base64', ctx.request.body.password)
    }
    const result = await UserRegister.findOne({
      where: {
        'userTel': user.tel
      }
    })
    if (result) {
      throw new APIError('user:tel_existed', 'The tel is existed')
    } else {
      const id = db.generateId()
      const newUser = await UserRegister.create({
        'userId': id,
        'userTel': user.tel,
        'userPassword': user.password
      })
      const newUserInfo = await UserInfo.create({
        userId: id,
        userNickname: `用户${id}`,
        userAddress: '未知',
        userGender: '男',
        userAge: 0,
        userDesc: '请设置个性签名',
        userStatus: '离线'
      })
      ctx.rest({
        newUser,
        newUserInfo
      })
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
        'userPassword': hash.digest('base64', user.password)
      }
    })
    if (result) {
      ctx.rest(result)
    } else {
      throw new APIError('user:not_found', 'tel or password error')
    }
  }
}
