const crypto = require('crypto')
const hash = crypto.createHash('md5')
// const APIError = require('../rest').APIError
const VideoInfo = require('../models/VideoInfo')
const ShareInfo = require('../models/ShareInfo')
const WatchInfo = require('../models/WatchInfo')
const CommentInfo = require('../models/CommentInfo')
const LikeInfo = require('../models/LikeInfo')
const UserRegister = require('../models/UserRegister')
const UserInfo = require('../models/UserInfo')
const UserRelation = require('../models/UserRelation')
const db = require('../db')
module.exports = {
  'GET /api/getUser/:userId': async (ctx, next) => {
    var userId = ctx.params.userId
    var user = await UserRegister.findOne({
      where: {
        userId
      }
    })
    var ui = await user.getUserInfo()
    ctx.rest(ui)
  },
  'GET /api/test/createUser': async (ctx, next) => {
    let id = db.generateId()
    let pswd = hash.digest('base64', 'asdwsx1234')
    let ur = await UserRegister.create({
      'userId': id,
      'userEmail': '814930498@qq.com',
      'userPassword': pswd,
      'userStatus': '离线'
    })
    let ui = await UserInfo.create({
      'userId': id,
      'userNickname': 'Well',
      'userDesc': 'test111',
      'userAge': 999,
      'userGender': '男',
      'userAddress': '测试'
    })
    let id1 = db.generateId()
    await UserRegister.create({
      'userId': id1,
      'userEmail': '814931111@qq.com',
      'userPassword': pswd,
      'userStatus': '离线'
    })
    await UserInfo.create({
      'userId': id1,
      'userNickname': 'Tian',
      'userDesc': 'test111',
      'userAge': 999,
      'userGender': '男',
      'userAddress': '测试'
    })

    let id2 = db.generateId()
    await UserRegister.create({
      'userId': id2,
      'userEmail': '814930000@qq.com',
      'userPassword': pswd,
      'userStatus': '离线'
    })
    await UserInfo.create({
      'userId': id2,
      'userNickname': 'Yu',
      'userDesc': 'test111',
      'userAge': 999,
      'userGender': '男',
      'userAddress': '测试'
    })
    ctx.rest({ 'UserRegister': ur, 'UserInfo': ui })
  },
  'GET /api/test/createVideo': async (ctx, next) => {
    for (let i = 0; i < 3; i++) {
      let videoId = db.generateId()
      await VideoInfo.create({
        videoId,
        videoDuration: '222',
        videoCover: 'path:videoCover',
        videoDesc: 'videoDesc',
        videoPath: 'path:video',
        videoStatus: '正常',
        userId: '1fa9dcc3-475f-4c86-9212-4157e5403235'
      })
    }
    ctx.rest('create 3 videos')
  },
  'GET /api/test/createVideoWSLC': async (ctx, next) => {
    const user = await UserRegister.findOne()
    const VideoInfolist = await VideoInfo.findAll()
    for (let i = 0, len = VideoInfolist.length; i < len; i++) {
      let videoId = VideoInfolist[i].videoId
      await ShareInfo.create({
        videoId,
        userId: user.userId
      })
      await LikeInfo.create({
        videoId,
        userId: user.userId
      })
      await WatchInfo.create({
        videoId,
        userId: user.userId
      })
      await CommentInfo.create({
        videoId,
        commentContent: `comment test`,
        commentReplyID: '',
        userId: user.userId
      })
    }
    ctx.rest('create 3 VideoWSLC')
  },
  'GET /api/createUserRelation': async (ctx, next) => {
    var fromuser = await UserRegister.findOne({
      where: {
        'userEmail': '814930498@qq.com'
      }
    })
    var touser1 = await UserRegister.findOne({
      where: {
        'userEmail': '814930000@qq.com'
      }
    })
    var touser2 = await UserRegister.findOne({
      where: {
        'userEmail': '814931111@qq.com'
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
  }
}
