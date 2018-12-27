const db = require('../db')
const crypto = require('crypto')
const redisClient = require('../redis')
const APIError = require('../rest').APIError
const utils = require('../utils/utils')
const UserInfo = require('../models/UserInfo')
const LikeInfo = require('../models/LikeInfo')
const ShareInfo = require('../models/ShareInfo')
const WatchInfo = require('../models/WatchInfo')
const VideoInfo = require('../models/VideoInfo')
const nodemailer = require('../utils/nodemailer')
const CommentInfo = require('../models/CommentInfo')
const PrivateLetter = require('../models/PrivateLetter')
const UserRegister = require('../models/UserRegister')
const UserRelation = require('../models/UserRelation')

const KEY_WATCH_NUM = 'videoWatchNum'
const KEY_SHARE_NUM = 'videoShareNum'
const KEY_LIKE_NUM = 'videoLikeNum'
const KEY_COMMENT_NUM = 'videoCommentNum'
const PER_PAGE_LIMIT_NUM = 21

const regEmail = /^([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/
module.exports = {
  'GET /api/common/user/detectEmail/:email': async (ctx, next) => {
    const email = ctx.params.email
    if (regEmail.test(email)) {
      const result = await UserRegister.findOne({
        where: {
          'userEmail': email
        }
      })
      if (result) {
        ctx.rest('ok')
      } else {
        throw new APIError('user:not_found', 'user not found by email.')
      }
    } else {
      throw new APIError('user:email_format_error', 'email_format_error.')
    }
  },
  'GET /api/common/user/getCode/:email': async (ctx, next) => {
    const email = ctx.params.email
    if (regEmail.test(email)) {
      let code = nodemailer.generateCode()
      let res = await nodemailer.sendMail(nodemailer.CreateMail(email, code))
      if (typeof res.code === 'undefined') {
        // 发送成功 将code存入redis等待验证 60s后自动过期删除
        let key = `register_${email}`
        redisClient.set(key, code)
        redisClient.expire(key, 120)
        ctx.rest(res)
      } else {
        throw new APIError('user:email_sent_failed', 'email_sent_failed.')
      }
    } else {
      throw new APIError('user:email_format_error', 'email_format_error.')
    }
  },
  'POST /api/common/user/register': async (ctx, next) => {
    const user = {
      email: ctx.request.body.email,
      password: crypto.createHash('md5').update(ctx.request.body.password).digest('base64'),
      code: ctx.request.body.code
    }
    const result = await UserRegister.findOne({
      where: {
        'userEmail': user.email
      }
    })
    if (result) {
      throw new APIError('user:email_existed', 'The email is registered.')
    } else {
      const code = await redisClient.get(`register_${user.email}`)
      if (user.code === code) {
        const id = db.generateId()
        const newUser = await UserRegister.create({
          'userId': id,
          'userEmail': user.email,
          'userPassword': user.password,
          'userStatus': '离线'
        })
        const newUserInfo = await UserInfo.create({
          userId: id,
          userAvatar: '/assets/avatar/default.png',
          userNickname: `用户${id.slice(0, 6)}`,
          userAddress: '未知',
          userGender: '男',
          userAge: 21,
          userDesc: '请设置个性签名'
        })
        ctx.rest({
          newUser,
          newUserInfo
        })
      } else {
        ctx.rest({
          message: '验证码错误'
        })
      }
    }
  },
  'POST /api/common/user/retrievePassword': async (ctx, next) => {
    const user = {
      email: ctx.request.body.email,
      password: crypto.createHash('md5').update(ctx.request.body.password).digest('base64'),
      code: ctx.request.body.code
    }
    const code = await redisClient.get(`register_${user.email}`)
    if (user.code !== code) throw new APIError('user:code_error', 'code_error')
    let result = await UserRegister.findOne({
      where: {
        'userEmail': user.email
      }
    })
    if (result) {
      result.userPassword = user.password
      await result.save()
      ctx.rest('retrieve password suc!')
    } else {
      throw new APIError('user:email_error', 'no such email')
    }
  },
  'POST /api/common/user/loginByPassword': async (ctx, next) => {
    const user = {
      email: ctx.request.body.email,
      password: ctx.request.body.password
    }
    let result = await UserRegister.findOne({
      where: {
        'userEmail': user.email,
        'userPassword': crypto.createHash('md5').update(user.password).digest('base64')
      }
    })
    if (result) {
      result.userStatus = '在线'
      await result.save()
      ctx.session.userId = result.userId
      ctx.rest(result)
    } else {
      throw new APIError('user:not_found', 'email or password error')
    }
  },
  'GET /api/user/:userId/logout': async (ctx, next) => {
    const userId = ctx.params.userId
    let ur = await UserRegister.findOne({
      where: {
        userId
      }
    })
    if (ur) {
      ur.userStatus = '离线'
      ctx.session = {}
      await ur.save()
      ctx.rest('ok')
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'PUT /api/user/:userId/modifyUserInfo': async (ctx, next) => {
    const user = {
      Id: ctx.params.userId,
      Nickname: ctx.request.body.nickName,
      Avatar: ctx.request.body.avatar,
      Address: ctx.request.body.address,
      Gender: ctx.request.body.gender,
      Age: ctx.request.body.age,
      Desc: ctx.request.body.desc
    }
    const ur = UserRegister.findOne({
      where: {
        userId: user.Id
      }
    })
    if (ur) {
      let userinfo = await ur.getUserInfo()
      userinfo.userNickname = user.Nickname
      userinfo.userAvatar = user.Avatar
      userinfo.userAddress = user.Address
      userinfo.userGender = user.Gender
      userinfo.userAge = user.Age
      userinfo.userDesc = user.Desc
      await userinfo.save()
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/common/user/:userId/getUserInfo': async (ctx, next) => {
    let userId = ctx.params.userId
    if (userId === 'persistent') {
      let session = JSON.parse(await redisClient.get(`SESSION:${ctx.cookies.get('koa:sess')}`))
      userId = session.userId
    }
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
  'GET /api/user/:userId/Fans/page/:page': async (ctx, next) => {
    const userId = ctx.params.userId
    let page = ctx.params.page
    if (page < 0 || !page) page = 1
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const fansList = await user.getFans({
        limit: PER_PAGE_LIMIT_NUM,
        offset: (page - 1) * PER_PAGE_LIMIT_NUM
      })
      let UserinfoList = []
      for (let i = 0, len = fansList.length; i < len; i++) {
        let temp = fansList[i]
        let userinfo = await temp.getFromUserInfo()
        UserinfoList.push(userinfo)
      }
      ctx.rest(UserinfoList)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/Followers/page/:page': async (ctx, next) => {
    const userId = ctx.params.userId
    let page = ctx.params.page
    if (page < 0 || !page) page = 1
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const FollowersList = await user.getFollowers({
        limit: PER_PAGE_LIMIT_NUM,
        offset: (page - 1) * PER_PAGE_LIMIT_NUM
      })
      let UserinfoList = []
      for (let i = 0, len = FollowersList.length; i < len; i++) {
        let temp = FollowersList[i]
        let userinfo = await temp.getToUserInfo()
        UserinfoList.push(userinfo)
      }
      ctx.rest(UserinfoList)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/FollowerVideo': async (ctx, next) => {
    const userId = ctx.params.userId
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const FollowersList = await user.getFollowers()
      let res = []
      for (let i = 0, len = FollowersList.length; i < len; i++) {
        let ur = FollowersList[i]
        let userInfo = await ur.getFromUserInfo()
        let videoInfos = await VideoInfo.findAll({
          where: {
            userId: userInfo.userId
          }
        })
        for (let j = 0, len = videoInfos.length; j < len; j++) {
          let videoInfo = videoInfos[j]
          if (!videoInfo) continue
          let shareNum = await redisClient.zscore(KEY_SHARE_NUM, videoInfo.videoId)
          let watchNum = await redisClient.zscore(KEY_WATCH_NUM, videoInfo.videoId)
          let commentNum = await redisClient.zscore(KEY_COMMENT_NUM, videoInfo.videoId)
          let likeNum = await redisClient.zscore(KEY_LIKE_NUM, videoInfo.videoId)
          res.push({
            userInfo,
            videoInfo,
            WSLCNum: {
              shareNum,
              watchNum,
              commentNum,
              likeNum
            }
          })
        }
      }
      ctx.rest(res)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/FansNum': async (ctx, next) => {
    const userId = ctx.params.userId
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const fansList = await user.getFans()
      ctx.rest(fansList.length)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/FollowersNum': async (ctx, next) => {
    const userId = ctx.params.userId
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const FollowersList = await user.getFollowers()
      ctx.rest(FollowersList.length)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/byLikesNum': async (ctx, next) => {
    const userId = ctx.params.userId
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const userVideos = await user.getVideos()
      const userComments = await user.getComments()
      let videoLikeSumNum = 0
      let commentLikeSumNum = 0
      for (let i = 0, len = userVideos.length; i < len; i++) {
        let videoInfo = userVideos[i]
        let videoLikeNum = await LikeInfo.findAndCount({
          where: {
            videoId: videoInfo.videoId
          }
        })
        videoLikeSumNum += videoLikeNum.count
      }
      for (let i = 0, len = userComments.length; i < len; i++) {
        let commentInfo = userComments[i]
        let commentLikeNum = await LikeInfo.findAndCount({
          where: {
            commentId: commentInfo.commentId
          }
        })
        commentLikeSumNum += commentLikeNum.count
      }
      ctx.rest(videoLikeSumNum + commentLikeSumNum)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/Likes/page/:page': async (ctx, next) => {
    const userId = ctx.params.userId
    let page = ctx.params.page
    if (page < 0 || !page) page = 1
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const userInfo = await user.getUserInfo()
      const LikeList = await user.getLikes({
        where: {
          commentId: null
        },
        limit: PER_PAGE_LIMIT_NUM,
        offset: (page - 1) * PER_PAGE_LIMIT_NUM
      })
      let VideoinfoList = []
      for (let i = 0, len = LikeList.length; i < len; i++) {
        let temp = LikeList[i]
        let video = await temp.getVideoInfo()
        if (!video) continue
        let shareNum = await redisClient.zscore(KEY_SHARE_NUM, video.videoId)
        let watchNum = await redisClient.zscore(KEY_WATCH_NUM, video.videoId)
        let commentNum = await redisClient.zscore(KEY_COMMENT_NUM, video.videoId)
        let likeNum = await redisClient.zscore(KEY_LIKE_NUM, video.videoId)
        VideoinfoList.push({
          videoInfo: video,
          userInfo,
          WSLCNum: {
            shareNum,
            watchNum,
            commentNum,
            likeNum
          }
        })
      }
      ctx.rest(VideoinfoList)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/Videos/page/:page': async (ctx, next) => {
    const userId = ctx.params.userId
    let page = ctx.params.page
    if (page < 0 || !page) page = 1
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const VideoList = await user.getVideos({
        limit: PER_PAGE_LIMIT_NUM,
        offset: (page - 1) * PER_PAGE_LIMIT_NUM
      })
      const userInfo = await user.getUserInfo()
      let res = []
      for (let i = 0, len = VideoList.length; i < len; i++) {
        let video = VideoList[i]
        let shareNum = await redisClient.zscore(KEY_SHARE_NUM, video.videoId)
        let watchNum = await redisClient.zscore(KEY_WATCH_NUM, video.videoId)
        let commentNum = await redisClient.zscore(KEY_COMMENT_NUM, video.videoId)
        let likeNum = await redisClient.zscore(KEY_LIKE_NUM, video.videoId)
        res.push({
          videoInfo: video,
          userInfo,
          WSLCNum: {
            shareNum,
            watchNum,
            commentNum,
            likeNum
          }
        })
      }
      ctx.rest(res)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/LikesNum': async (ctx, next) => {
    const userId = ctx.params.userId
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const LikeList = await user.getLikes({
        where: {
          commentId: null
        }
      })
      ctx.rest(LikeList.length)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'GET /api/user/:userId/VideosNum': async (ctx, next) => {
    const userId = ctx.params.userId
    const user = await UserRegister.findOne({
      where: {
        'userId': userId
      }
    })
    if (user) {
      const VideoList = await user.getVideos()
      ctx.rest(VideoList.length)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  /* 先查看数据库中关注者和被关注者是否存在
   * 在数据库中找出关注者和被关注者互相的关系
   * 如果关注者已经关注被关注者，则destroy该条记录，并将被关注者的bothStatus更新为false，save被关注者（如果被关注者关注了关注者）
   * 相反，如果未关注，则build这条记录（bothStatus默认为false），并将他们俩的bothStatus都更新为true，save被关注者（如果被关注者关注了关注者），save关注者
   */
  'GET /api/user/:fromUserId/triggerFollow/:toUserId': async (ctx, next) => {
    const fromUserId = ctx.params.fromUserId
    const toUserId = ctx.params.toUserId
    const toUser = await UserRegister.findOne({
      where: {
        'userId': toUserId
      }
    })
    const fromUser = await UserRegister.findOne({
      where: {
        'userId': fromUserId
      }
    })
    if (!toUser || !fromUser) {
      throw new APIError('user:not_existed', 'fromUser or toUser is not existed.')
    }
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
      ctx.rest('取消关注成功')
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
      ctx.rest('关注成功')
    }
  },
  'GET /api/user/:fromUserId/triggerLike/:toVideoId': async (ctx, next) => {
    const fromUserId = ctx.params.fromUserId
    const toVideoId = ctx.params.toVideoId
    const user = await UserRegister.findOne({
      where: {
        'userId': fromUserId
      }
    })
    const video = await VideoInfo.findOne({
      where: {
        'videoId': toVideoId
      }
    })

    if (!user || !video) {
      throw new APIError('user:not_existed', 'fromUser or toVideo is not existed.')
    }
    let li = await LikeInfo.findOne({
      where: {
        'videoId': toVideoId,
        'userId': fromUserId
      }
    })
    if (li) {
      utils.incrOrCut(KEY_LIKE_NUM, -1, toVideoId)
      await li.destroy()
      ctx.rest('取消喜欢成功')
    } else {
      utils.incrOrCut(KEY_LIKE_NUM, 1, toVideoId)
      await LikeInfo.create({
        'videoId': toVideoId,
        'userId': fromUserId
      })
      ctx.rest('喜欢成功')
    }
  },
  'GET /api/user/:fromUserId/watch/:toVideoId': async (ctx, next) => {
    const fromUserId = ctx.params.fromUserId
    const toVideoId = ctx.params.toVideoId
    const user = await UserRegister.findOne({
      where: {
        'userId': fromUserId
      }
    })
    const video = await VideoInfo.findOne({
      where: {
        'videoId': toVideoId
      }
    })

    if (!user || !video) {
      throw new APIError('user:not_existed', 'fromUser or toVideo is not existed.')
    }
    utils.incrOrCut(KEY_WATCH_NUM, 1, toVideoId)
    await WatchInfo.create({
      'videoId': toVideoId,
      'userId': fromUserId
    })
    ctx.rest('watch video')
  },
  'GET /api/user/:fromUserId/share/:toVideoId': async (ctx, next) => {
    const fromUserId = ctx.params.fromUserId
    const toVideoId = ctx.params.toVideoId
    const user = await UserRegister.findOne({
      where: {
        'userId': fromUserId
      }
    })
    const video = await VideoInfo.findOne({
      where: {
        'videoId': toVideoId
      }
    })

    if (!user || !video) {
      throw new APIError('user:not_existed', 'fromUser or toVideo is not existed.')
    }
    utils.incrOrCut(KEY_SHARE_NUM, 1, toVideoId)
    await ShareInfo.create({
      'videoId': toVideoId,
      'userId': fromUserId
    })
    ctx.rest('分享成功')
  },
  /* 先查看数据库中评论者和被评论视频是否存在，不存在则抛出用户或者视频不存在错误。
   * 然后根据url中的replyId判断是否为回复评论还是单纯的评论
   * 如果是回复，则取查询被回复的评论是否存在，不存在则抛出回复评论不存在错误。
   * 如果是单纯的评论，则将comment.commentReplyID = '',
   * 创建评论并插入数据库
   */
  'POST /api/user/:fromUserId/commentVideo/:toVideoId/comment/:replyId': async (ctx, next) => {
    let comment = {
      userId: ctx.params.fromUserId,
      commentReplyID: ctx.params.replyId,
      commentContent: ctx.request.body.content,
      videoId: ctx.params.toVideoId
    }
    const user = await UserRegister.findOne({
      where: {
        'userId': comment.userId
      }
    })
    const video = await VideoInfo.findOne({
      where: {
        'videoId': comment.videoId
      }
    })

    if (!user || !video) {
      throw new APIError('user:not_existed', 'fromUser or toVideo is not existed.')
    }
    if (!comment.commentReplyID) {
      comment.commentReplyID = ''
    } else {
      const replyComment = await CommentInfo.findOne({
        where: {
          id: comment.commentReplyID
        }
      })
      if (!replyComment) {
        throw new APIError('comment:not_existed', 'replyComment is not existed.')
      }
    }
    utils.incrOrCut(KEY_COMMENT_NUM, 1, comment.videoId)
    const c = await CommentInfo.create(comment)
    ctx.rest(c)
  },
  'POST /api/user/:fromUserId/privateLetter/:toUserId': async (ctx, next) => {
    let pl = {
      privateLetterContent: ctx.request.body.content,
      privateLetterStatus: '未读',
      fromId: ctx.params.fromUserId,
      toId: ctx.params.toUserId
    }
    const u1 = await UserRegister.findOne({
      where: {
        'userId': pl.fromId
      }
    })
    const u2 = await UserRegister.findOne({
      where: {
        'userId': pl.toId
      }
    })

    if (!u1 || !u2) {
      throw new APIError('user:not_existed', 'fromUser or toUser is not existed.')
    }
    const c = await PrivateLetter.create(pl)
    ctx.rest(c)
  }
}
