const crypto = require('crypto')
const hash = crypto.createHash('md5')
const VideoInfo = require('../models/VideoInfo')
const ShareInfo = require('../models/ShareInfo')
const WatchInfo = require('../models/WatchInfo')
const CommentInfo = require('../models/CommentInfo')
const LikeInfo = require('../models/LikeInfo')
const UserRegister = require('../models/UserRegister')
const UserInfo = require('../models/UserInfo')
const UserRelation = require('../models/UserRelation')
const db = require('../db')

const MAX_USER_NUM = 50
const MAX_VIDEO_NUM = MAX_USER_NUM * 5
const MAX_USER_RELATION_NUM = MAX_USER_NUM * 2
const MAX_VIDEO_WSLC_NUM = MAX_USER_NUM * 10
const USER_PSWD = hash.digest('base64', 'asdwsx1234')
module.exports = {
  'GET /api/test/createUsers': async (ctx, next) => {
    for (let i = 0; i < MAX_USER_NUM; i++) {
      let id = db.generateId()
      await UserRegister.create({
        'userId': id,
        'userEmail': `${id.slice(0, 9)}@qq.com`,
        'userPassword': USER_PSWD,
        'userStatus': '离线'
      })
      await UserInfo.create({
        'userId': id,
        'userNickname': `${id.slice(10, 15)}`,
        'userDesc': 'test111',
        'userAge': 999,
        'userGender': '男',
        'userAddress': '测试'
      })
    }
    ctx.rest(`Create ${MAX_USER_NUM} users.`)
  },
  'GET /api/test/createVideo': async (ctx, next) => {
    const users = await UserRegister.findAll()
    for (let i = 0; i < MAX_VIDEO_NUM; i++) {
      let randomIndex = Math.floor(Math.random() * MAX_USER_NUM)
      let userId = users[randomIndex].userId
      await VideoInfo.create({
        videoId: db.generateId(),
        videoDuration: '222',
        videoCover: 'path:videoCover',
        videoDesc: 'videoDesc',
        videoPath: 'path:video',
        videoStatus: '正常',
        userId
      })
    }
    ctx.rest(`create ${MAX_VIDEO_NUM} videos`)
  },
  'GET /api/test/createUserRelation': async (ctx, next) => {
    if (MAX_USER_NUM < 2) return
    const users = await UserRegister.findAll()
    for (let i = 0; i < Math.floor(MAX_USER_RELATION_NUM / 2); i++) {
      let FromIndex = Math.floor(Math.random() * MAX_USER_NUM)
      let ToIndex = Math.floor(Math.random() * MAX_USER_NUM)
      while (ToIndex === FromIndex) {
        ToIndex = Math.floor(Math.random() * MAX_USER_NUM)
      }

      let fromUserId = users[FromIndex].userId
      let toUserId = users[ToIndex].userId
      let toUr = await UserRelation.findOne({
        where: {
          'fromId': toUserId,
          'toId': fromUserId
        }
      })
      let fromUr = await UserRelation.findOne({
        where: {
          'fromId': fromUserId,
          'toId': toUserId
        }
      })
      if (fromUr) {
        fromUr.destroy()
        if (toUr) {
          toUr.bothStatus = false
          await toUr.save()
        }
      } else {
        let newUr = await UserRelation.build({
          'fromId': fromUserId,
          'toId': toUserId,
          'bothStatus': false
        })
        if (toUr) {
          toUr.bothStatus = true
          newUr.bothStatus = true
          await toUr.save()
        }
        await newUr.save()
      }
    }
    ctx.rest(`create user relations suc.`)
  },
  'GET /api/test/createVideoWSLC': async (ctx, next) => {
    const users = await UserRegister.findAll()
    const videos = await VideoInfo.findAll()
    for (let i = 0; i < MAX_VIDEO_WSLC_NUM; i++) {
      let UserRandomIndex = Math.floor(Math.random() * MAX_USER_NUM)
      let VideoRandomIndex = Math.floor(Math.random() * MAX_VIDEO_NUM)
      let userId = users[UserRandomIndex].userId
      let videoId = videos[VideoRandomIndex].videoId
      let OperationCase = Math.floor(Math.random() * 3)
      if (OperationCase === 0) {
        await ShareInfo.create({
          videoId,
          userId
        })
      } else if (OperationCase === 1) {
        let li = await LikeInfo.findOne({
          where: {
            videoId,
            userId
          }
        })
        if (li) {
          await li.destroy()
        } else {
          await LikeInfo.create({
            videoId,
            userId
          })
        }
      } else if (OperationCase === 2) {
        await CommentInfo.create({
          videoId,
          commentContent: `comment test`,
          commentReplyID: '',
          userId
        })
      }
      await WatchInfo.create({
        videoId,
        userId
      })
    }
    ctx.rest('create VideoWSLC suc.')
  }
}
