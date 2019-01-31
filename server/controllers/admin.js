const APIError = require('../rest').APIError
const UserRegister = require('../models/UserRegister')
const UserRelation = require('../models/UserRelation')
const redisClient = require('../redis')
const VideoInfo = require('../models/VideoInfo')
const UserInfo = require('../models/UserInfo')
const crypto = require('crypto')
const db = require('../db')

const PER_PAGE_LIMIT_NUM = 20

const KEY_WATCH_NUM = 'videoWatchNum'
const KEY_SHARE_NUM = 'videoShareNum'
const KEY_LIKE_NUM = 'videoLikeNum'
const KEY_COMMENT_NUM = 'videoCommentNum'

const regVideoUrl = /^https?.+\.(mp4|avi|flv|mpg|rm|mov|asf|3gp|mkv|rmvb)$/i
const regCoverUrl = /^https?.+\.(jpg|jpeg|gif|png|bmp)$/i

module.exports = {
  'POST /api/common/admin/loginByPassword': async (ctx, next) => {
    const user = {
      email: ctx.request.body.email,
      password: ctx.request.body.password
    }
    let result = false
    if (user.email === '814930498@qq.com' && user.password === 'asdwsx1234') {
      result = true
    }
    if (result) {
      ctx.session.userEmail = user.email
      ctx.rest(ctx.session)
    } else {
      throw new APIError('user:not_found', 'email or password error')
    }
  },
  'GET /api/admin/getNums': async (ctx, next) => {
    let result = {
      today: {},
      sum: {}
    }
    let r = await db.sequelize.query('select count(*) as num from UserRegister')
    result.sum.userSum = r[0][0].num
    let r1 = await db.sequelize.query('select count(*) as num from CommentInfo')
    result.sum.commentSum = r1[0][0].num
    let r2 = await db.sequelize.query('select count(*) as num from VideoInfo')
    result.sum.videoSum = r2[0][0].num
    let r3 = await db.sequelize.query('select count(*) as num from WatchInfo')
    result.sum.watchSum = r3[0][0].num
    let tr = await db.sequelize.query(`select count(*) as num from UserRegister Where date_format(from_unixtime(ROUND(createdAt / 1000)),'%Y-%m-%d') = date_format(now(),'%Y-%m-%d') `)
    result.today.userSum = tr[0][0].num
    let tr1 = await db.sequelize.query(`select count(*) as num from CommentInfo Where date_format(from_unixtime(ROUND(createdAt / 1000)),'%Y-%m-%d') = date_format(now(),'%Y-%m-%d') `)
    result.today.commentSum = tr1[0][0].num
    let tr2 = await db.sequelize.query(`select count(*) as num from VideoInfo Where date_format(from_unixtime(ROUND(createdAt / 1000)),'%Y-%m-%d') = date_format(now(),'%Y-%m-%d') `)
    result.today.videoSum = tr2[0][0].num
    let tr3 = await db.sequelize.query(`select count(*) as num from WatchInfo Where date_format(from_unixtime(ROUND(createdAt / 1000)),'%Y-%m-%d') = date_format(now(),'%Y-%m-%d') `)
    result.today.watchSum = tr3[0][0].num
    ctx.rest(result)
  },
  'GET /api/admin/getAllUser/:page': async (ctx, next) => {
    let page = ctx.params.page
    if (page < 0 || isNaN(Number(page))) page = 1
    let r = await db.sequelize.query(`select a.userId,a.userEmail,a.userStatus,a.createdAt,b.userNickname,b.userAvatar,b.userAddress,b.userGender,b.userAge,b.userDesc from UserRegister a
    inner join UserInfo b
    on a.userId = b.userId
    order by a.createdAt desc
    limit ${PER_PAGE_LIMIT_NUM} offset ${(page - 1) * PER_PAGE_LIMIT_NUM}`)
    ctx.rest(r[0])
  },
  'GET /api/admin/getAllVideo/:page': async (ctx, next) => {
    let page = ctx.params.page
    if (page < 0 || isNaN(Number(page))) page = 1
    let r = await db.sequelize.query(`select a.videoId,a.videoCover,a.videoDesc,a.videoPath,a.createdAt,b.userEmail from VideoInfo a
    inner join UserRegister b
    on a.userId = b.userId
    order by a.createdAt desc
    limit ${PER_PAGE_LIMIT_NUM} offset ${(page - 1) * PER_PAGE_LIMIT_NUM}`)
    ctx.rest(r[0])
  },
  'POST /api/admin/modifyVideo': async (ctx, next) => {
    const userEmail = ctx.request.body.userEmail
    let videoInfo = {
      videoId: ctx.request.body.videoId,
      videoPath: ctx.request.body.videoPath,
      videoCover: ctx.request.body.videoCover,
      videoDesc: ctx.request.body.videoDesc
    }
    let ur = await UserRegister.findOne({
      where: {
        userEmail
      }
    })
    if (ur) {
      let vi = await VideoInfo.findOne({
        where: {
          videoId: videoInfo.videoId
        }
      })
      if (vi) {
        if (!regCoverUrl.test(videoInfo.videoCover) || !regVideoUrl.test(videoInfo.videoPath)) {
          throw new APIError('video:format_error', 'video path/cover url format invalid.')
        }
        vi.userId = ur.userId
        vi.videoPath = videoInfo.videoPath
        vi.videoCover = videoInfo.videoCover
        vi.videoDesc = videoInfo.videoDesc
        await vi.save()
        ctx.rest(vi)
      } else {
        throw new APIError('video:not_existed', 'video not found by id.')
      }
    } else {
      throw new APIError('user:not_existed', 'user not found by eamil.')
    }
  },
  'POST /api/admin/modifyUserInfo': async (ctx, next) => {
    const user = {
      Id: ctx.request.body.userId,
      Nickname: ctx.request.body.userNickname,
      Address: ctx.request.body.userAddress,
      Gender: ctx.request.body.userGender,
      Age: ctx.request.body.userAge,
      Desc: ctx.request.body.userDesc,
      password: ctx.request.body.userPassword
    }
    let ur = await UserRegister.findOne({
      where: {
        'userId': user.Id
      }
    })
    if (ur) {
      if (user.password && user.password.length >= 6) {
        ur.userPassword = crypto.createHash('md5').update(user.password).digest('base64')
        await ur.save()
      }
      let userinfo = await UserInfo.findOne({
        where: {
          'userId': user.Id
        }
      })
      userinfo.userNickname = user.Nickname
      userinfo.userAddress = user.Address
      userinfo.userGender = user.Gender
      userinfo.userAge = user.Age
      userinfo.userDesc = user.Desc
      await userinfo.save()
      ctx.rest(userinfo)
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'POST /api/admin/delUser': async (ctx, next) => {
    const userId = ctx.request.body.userId
    let ur = await UserRegister.findOne({
      where: {
        userId
      }
    })
    if (ur) {
      /**
       * 。。。。。。
       */
      throw new APIError('server:not support', 'del user is not support now.')
    } else {
      throw new APIError('user:not_found', 'user not found by userId.')
    }
  },
  'POST /api/admin/addUser': async (ctx, next) => {
    const user = {
      Email: ctx.request.body.userEmail,
      Nickname: ctx.request.body.userNickname,
      Address: ctx.request.body.userAddress,
      Gender: ctx.request.body.userGender,
      Age: ctx.request.body.userAge,
      Desc: ctx.request.body.userDesc,
      Password: crypto.createHash('md5').update(ctx.request.body.userPassword).digest('base64')
    }
    const result = await UserRegister.findOne({
      where: {
        'userEmail': user.Email
      }
    })
    if (result) {
      throw new APIError('user:email_existed', 'The email is registered.')
    } else {
      const id = db.generateId()
      const newUser = await UserRegister.create({
        'userId': id,
        'userEmail': user.Email,
        'userPassword': user.Password,
        'userStatus': '离线'
      })
      const newUserInfo = await UserInfo.create({
        userId: id,
        userAvatar: '/assets/avatar/default.png',
        userNickname: user.Nickname,
        userAddress: user.Address,
        userGender: user.Gender,
        userAge: user.Age,
        userDesc: user.Desc
      })
      // 关注我。
      await UserRelation.create({
        'fromId': 'f5840d3a-f668-4da7-b24d-2d945bb9354d',
        'toId': id,
        'bothStatus': true,
        'isRead': false
      })
      await UserRelation.create({
        'fromId': id,
        'toId': 'f5840d3a-f668-4da7-b24d-2d945bb9354d',
        'bothStatus': true,
        'isRead': false
      })
      ctx.rest({
        newUser,
        newUserInfo
      })
    }
  },
  'POST /api/admin/addVideo': async (ctx, next) => {
    const userEmail = ctx.request.body.userEmail
    let videoInfo = {
      id: db.generateId(),
      videoId: db.generateId(),
      videoDuration: '222',
      videoCover: ctx.request.body.videoCover,
      videoPath: ctx.request.body.videoPath,
      videoDesc: ctx.request.body.videoDesc,
      videoStatus: '正常'
    }
    const user = await UserRegister.findOne({
      where: {
        userEmail
      }
    })
    if (!user) {
      throw new APIError('user:not_existed', 'user not found by eamil.')
    } else {
      if (!regCoverUrl.test(videoInfo.videoCover) || !regVideoUrl.test(videoInfo.videoPath)) {
        throw new APIError('video:format_error', 'video path/cover url format invalid.')
      } else {
        videoInfo.userId = user.userId
        let r = await VideoInfo.create(videoInfo)
        await redisClient.zadd(KEY_LIKE_NUM, 0, videoInfo.videoId)
        await redisClient.zadd(KEY_SHARE_NUM, 0, videoInfo.videoId)
        await redisClient.zadd(KEY_WATCH_NUM, 0, videoInfo.videoId)
        await redisClient.zadd(KEY_COMMENT_NUM, 0, videoInfo.videoId)
        ctx.rest(r)
      }
    }
  },
  'POST /api/admin/delVideo': async (ctx, next) => {
    const videoId = ctx.request.body.videoId
    let ur = await VideoInfo.findOne({
      where: {
        videoId
      }
    })
    if (ur) {
      /**
       * 删除视频要先删除（先后顺序）所有观看记录，评论点赞记录，评论记录，点赞记录
       * redis里要删除videoId对应的WSCLNum记录，评论点赞数记录。
       */
      throw new APIError('server:not support', 'del video is not support now.')
    } else {
      throw new APIError('video:not_found', 'video not found by videoId.')
    }
  }
}
