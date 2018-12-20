const crypto = require('crypto')
const hash = crypto.createHash('md5')
const APIError = require('../rest').APIError
const UserRegister = require('../models/UserRegister')
const UserInfo = require('../models/UserInfo')
const UserRelation = require('../models/UserRelation')
const db = require('../db')
const redisClient = require('../redis')
const nodemailer = require('../utils/nodemailer')
module.exports = {
  'GET /api/user/getCode/:email': async (ctx, next) => {
    const email = ctx.params.email
    const regEmail = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
    if (regEmail.test(email)) {
      let code = nodemailer.generateCode()
      let res = await nodemailer.sendMail(nodemailer.CreateMail(email, code))
      if (typeof res.code === 'undefined') {
        // 发送成功 将code存入redis等待验证 60s后自动过期删除
        let key = `register_${email}`
        redisClient.set(key, code)
        redisClient.expire(key, 60)
        ctx.rest(res)
      } else {
        throw new APIError('user:email_sent_failed', 'email_sent_failed.')
      }
    } else {
      throw new APIError('user:email_error', 'email_error.')
    }
  },
  'POST /api/user/Register': async (ctx, next) => {
    const user = {
      email: ctx.request.body.email,
      password: hash.digest('base64', ctx.request.body.password),
      code: ctx.request.body.code
    }
    const result = await UserRegister.findOne({
      where: {
        'userEmail': user.email
      }
    })
    if (result) {
      throw new APIError('user:email_existed', 'The email is registed.')
    } else {
      const code = await redisClient.get(`register_${user.email}`)
      if (user.code === code) {
        const id = db.generateId()
        const newUser = await UserRegister.create({
          'userId': id,
          'userEmail': user.email,
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
      } else {
        throw new APIError('user:code_error', 'code_error')
      }
    }
  },
  'POST /api/user/LoginByPassword': async (ctx, next) => {
    const user = {
      email: ctx.request.body.email,
      password: ctx.request.body.password
    }
    const result = await UserRegister.findOne({
      where: {
        'userEmail': user.email,
        'userPassword': hash.digest('base64', user.password)
      }
    })
    if (result) {
      ctx.rest(result)
    } else {
      throw new APIError('user:not_found', 'email or password error')
    }
  },
  'GET /api/user/:userId/UserInfo': async (ctx, next) => {
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
  'GET /api/user/:fromUserId/triggerFollow/:toUserId': async (ctx, next) => {
    const fromUserId = ctx.params.fromUserId
    const toUserId = ctx.params.toUserId
    let toUr = await UserRelation.findOne({
      where: {
        'fromId': toUserId,
        'toId': fromUserId
      }
    })
    let bothStatus = false
    if (toUr) {
      bothStatus = true
      toUr.bothStatus = bothStatus
      await toUr.save()
    }
    let fromUr = await UserRelation.findOrCreate({
      where: {
        'fromId': fromUserId,
        'toId': toUserId
      }
    })
  }
}
