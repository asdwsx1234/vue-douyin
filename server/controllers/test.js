const crypto = require('crypto')
const hash = crypto.createHash('md5')
const APIError = require('../rest').APIError
const UserRegister = require('../models/UserRegister')
const UserInfo = require('../models/UserInfo')
const UserRelation = require('../models/UserRelation')
const db = require('../db')
module.exports = {
  'GET /api/getUser/:tel': async (ctx, next) => {
    var tel = ctx.params.tel
    var user = await UserRegister.findOne({
      where: {
        'userTel': tel
      }
    })
    var ui = await user.getUserInfo()
    ctx.rest(ui)
  },
  'GET /api/getRelations/:tel': async (ctx, next) => {
    var tel = ctx.params.tel
    var user = await UserRegister.findOne({
      where: {
        'userTel': tel
      }
    })
    var ui = await user.getFromUser()
    ctx.rest(ui)
  },
  'GET /api/createUser': async (ctx, next) => {
    let id = db.generateId()
    let pswd = hash.digest('base64', 'asdwsx1234')
    let ur = await UserRegister.create({
      'userId': id,
      'userTel': '13587416958',
      'userPassword': pswd
    })
    let ui = await UserInfo.create({
      'userId': id,
      'userNickname': 'Well',
      'userStatus': '离线',
      'userDesc': 'test111',
      'userAge': 999,
      'userGender': '男',
      'userAddress': '测试'
    })
    let id1 = db.generateId()
    await UserRegister.create({
      'userId': id1,
      'userTel': '13587413333',
      'userPassword': pswd
    })
    await UserInfo.create({
      'userId': id1,
      'userStatus': '离线',
      'userNickname': 'Tian',
      'userDesc': 'test111',
      'userAge': 999,
      'userGender': '男',
      'userAddress': '测试'
    })

    let id2 = db.generateId()
    await UserRegister.create({
      'userId': id2,
      'userTel': '13587411111',
      'userPassword': pswd
    })
    await UserInfo.create({
      'userId': id2,
      'userNickname': 'Yu',
      'userStatus': '离线',
      'userDesc': 'test111',
      'userAge': 999,
      'userGender': '男',
      'userAddress': '测试'
    })
    ctx.rest({ 'UserRegister': ur, 'UserInfo': ui })
  },
  'GET /api/createUserRelation': async (ctx, next) => {
    var fromuser = await UserRegister.findOne({
      where: {
        'userTel': 13587416958
      }
    })
    var touser1 = await UserRegister.findOne({
      where: {
        'userTel': 13587411111
      }
    })
    var touser2 = await UserRegister.findOne({
      where: {
        'userTel': 13587413333
      }
    })
    await UserRelation.create({
      fromId: fromuser.userId,
      toId: touser1.userId,
      bothStatus: false
    })
    await UserRelation.create({
      fromId: fromuser.userId,
      toId: touser2.userId,
      bothStatus: false
    })
  },
  'DELETE /api/products/:id': async (ctx, next) => {
    console.log(`delete product ${ctx.params.id}`)
    var p = {}
    if (p) {
      ctx.rest(p)
    } else {
      throw new APIError('product:not_found', 'product not found by id.')
    }
  }
}
