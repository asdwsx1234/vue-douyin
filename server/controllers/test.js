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
const utils = require('../utils/utils')

const MAX_USER_NUM = 50
const MAX_VIDEO_NUM = MAX_USER_NUM * 5
const MAX_USER_RELATION_NUM = MAX_USER_NUM * 2

const MAX_VIDEO_WATCH_NUM = MAX_USER_NUM * 50
const MAX_VIDEO_SHARE_NUM = MAX_USER_NUM * 10
const MAX_VIDEO_LIKE_NUM = MAX_USER_NUM * 50
const MAX_VIDEO_COMMENT_NUM = MAX_USER_NUM * 50
const MAX_COMMENT_LIKE_NUM = MAX_USER_NUM * 50

const USER_PSWD = hash.update('asdwsx1234').digest('base64')

const KEY_WATCH_NUM = 'videoWatchNum'
const KEY_SHARE_NUM = 'videoShareNum'
const KEY_LIKE_NUM = 'videoLikeNum'
const KEY_COMMENT_NUM = 'videoCommentNum'

module.exports = {
  'GET /api/common/testlogin': async (ctx, next) => {
    ctx.session.userId = 'aaaaaaaa'
    ctx.rest('login suc!')
  },
  'GET /api/common/testupdate': async (ctx, next) => {
    ctx.session.name = 'haha'
    ctx.rest('update suc!')
  },
  'GET /api/common/testupdate1': async (ctx, next) => {
    ctx.session.refresh()
    ctx.rest('update suc!')
  },
  'GET /api/common/testlogout': async (ctx, next) => {
    ctx.session = {}
    ctx.rest('logout suc!')
  },
  'GET /api/test/createUsers': async (ctx, next) => {
    for (let i = 0; i < MAX_USER_NUM; i++) {
      let id = db.generateId()
      await UserRegister.create({
        'userId': id,
        'userEmail': `${id.slice(0, 8)}@qq.com`,
        'userPassword': USER_PSWD,
        'userStatus': '离线'
      })
      await UserInfo.create({
        'userId': id,
        'userAvatar': '/assets/avatar/default.png',
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
  'GET /api/test/createVideoLike': async (ctx, next) => {
    const users = await UserRegister.findAll()
    const videos = await VideoInfo.findAll()
    for (let i = 0; i < MAX_VIDEO_LIKE_NUM; i++) {
      let UserRandomIndex = Math.floor(Math.random() * MAX_USER_NUM)
      let VideoRandomIndex = Math.floor(Math.random() * MAX_VIDEO_NUM)
      let userId = users[UserRandomIndex].userId
      let videoId = videos[VideoRandomIndex].videoId
      let li = await LikeInfo.findOne({
        where: {
          videoId,
          userId
        }
      })
      if (li) {
        utils.incrOrCut(KEY_LIKE_NUM, -1, videoId)
        await li.destroy()
      } else {
        utils.incrOrCut(KEY_LIKE_NUM, 1, videoId)
        await LikeInfo.create({
          videoId,
          userId
        })
      }
    }
    ctx.rest('createVideoLike suc.')
  },
  'GET /api/test/createWatch': async (ctx, next) => {
    const users = await UserRegister.findAll()
    const videos = await VideoInfo.findAll()
    for (let i = 0; i < MAX_VIDEO_WATCH_NUM; i++) {
      let UserRandomIndex = Math.floor(Math.random() * MAX_USER_NUM)
      let VideoRandomIndex = Math.floor(Math.random() * MAX_VIDEO_NUM)
      let userId = users[UserRandomIndex].userId
      let videoId = videos[VideoRandomIndex].videoId
      utils.incrOrCut(KEY_WATCH_NUM, 1, videoId)
      await WatchInfo.create({
        videoId,
        userId
      })
    }
    ctx.rest('createWatch suc.')
  },
  'GET /api/test/createShare': async (ctx, next) => {
    const users = await UserRegister.findAll()
    const videos = await VideoInfo.findAll()
    for (let i = 0; i < MAX_VIDEO_SHARE_NUM; i++) {
      let UserRandomIndex = Math.floor(Math.random() * MAX_USER_NUM)
      let VideoRandomIndex = Math.floor(Math.random() * MAX_VIDEO_NUM)
      let userId = users[UserRandomIndex].userId
      let videoId = videos[VideoRandomIndex].videoId
      utils.incrOrCut(KEY_SHARE_NUM, 1, videoId)
      await ShareInfo.create({
        videoId,
        userId
      })
    }
    ctx.rest('createShare suc.')
  },
  'GET /api/test/createComment': async (ctx, next) => {
    const users = await UserRegister.findAll()
    const videos = await VideoInfo.findAll()
    for (let i = 0; i < MAX_VIDEO_COMMENT_NUM; i++) {
      let UserRandomIndex = Math.floor(Math.random() * MAX_USER_NUM)
      let VideoRandomIndex = Math.floor(Math.random() * MAX_VIDEO_NUM)
      let userId = users[UserRandomIndex].userId
      let videoId = videos[VideoRandomIndex].videoId
      utils.incrOrCut(KEY_COMMENT_NUM, 1, videoId)
      await CommentInfo.create({
        commentId: db.generateId(),
        videoId,
        commentContent: `comment test`,
        commentReplyID: '',
        userId
      })
    }
    ctx.rest('createComment suc.')
  },
  'GET /api/test/createCommentLike': async (ctx, next) => {
    const users = await UserRegister.findAll()
    const comments = await CommentInfo.findAll()
    for (let i = 0; i < MAX_COMMENT_LIKE_NUM; i++) {
      let UserRandomIndex = Math.floor(Math.random() * MAX_USER_NUM)
      let CommentRandomIndex = Math.floor(Math.random() * MAX_VIDEO_COMMENT_NUM)
      let userId = users[UserRandomIndex].userId
      let commentId = comments[CommentRandomIndex].commentId
      let li = await LikeInfo.findOne({
        where: {
          commentId,
          userId
        }
      })
      if (li) {
        await li.destroy()
      } else {
        await LikeInfo.create({
          commentId,
          userId
        })
      }
    }
    ctx.rest('createCommentLike suc.')
  }
}
