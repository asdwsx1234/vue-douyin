const APIError = require('../rest').APIError
const VideoInfo = require('../models/VideoInfo')
const redisClient = require('../redis')
const db = require('../db')

const KEY_WATCH_NUM = 'videoWatchNum'
const KEY_SHARE_NUM = 'videoShareNum'
const KEY_LIKE_NUM = 'videoLikeNum'
const KEY_COMMENT_NUM = 'videoCommentNum'
const KEY_COMMENT_LIKE_NUM = 'commmentLikeNum'

const VIDEO_NUM = 250
const PER_PAGE_LIMIT_NUM = 20
const TOP_LIKE_COMMENT_NUM = 3
module.exports = {
  'GET /api/common/video/getPopularVideo': async (ctx, next) => {
    let key = 'popularVideoList'
    let isExists = await redisClient.exists(key)
    if (!isExists) {
      let topWatchVid = await redisClient.zrevrange(KEY_WATCH_NUM, 0, VIDEO_NUM)
      // let topShareVid = await redisClient.zrevrange(KEY_SHARE_NUM, 0, VIDEO_NUM)
      // let topLikeVid = await redisClient.zrevrange(KEY_LIKE_NUM, 0, VIDEO_NUM)
      // let topCommentVid = await redisClient.zrevrange(KEY_COMMENT_NUM, 0, VIDEO_NUM)
      // let summary = [...topWatchVid, ...topShareVid, ...topLikeVid, ...topCommentVid]
      let VideoSetId = new Set()
      for (let i of topWatchVid) {
        VideoSetId.add(i)
      }
      for (let videoId of VideoSetId) {
        let res = await db.sequelize.query(`select VideoInfo.userId,UserInfo.userAvatar,UserInfo.userNickname,VideoInfo.videoId,VideoInfo.videoCover,VideoInfo.videoDesc,VideoInfo.videoPath from VideoInfo
        inner join UserInfo
        on VideoInfo.userId = UserInfo.userId
        where VideoInfo.videoId = '${videoId}'
        `)
        let Video = res[0][0]
        let shareNum = await redisClient.zscore(KEY_SHARE_NUM, videoId)
        let watchNum = await redisClient.zscore(KEY_WATCH_NUM, videoId)
        let commentNum = await redisClient.zscore(KEY_COMMENT_NUM, videoId)
        let likeNum = await redisClient.zscore(KEY_LIKE_NUM, videoId)
        await redisClient.sadd(key, JSON.stringify({
          Video,
          WSLCNum: {
            shareNum,
            watchNum,
            commentNum,
            likeNum
          }
        }))
      }
      // 5分钟超时
      redisClient.expire(key, 300)
    }
    let res = await redisClient.srandmember(key, 20)
    ctx.rest(res)
  },
  'GET /api/video/:videoId/getVideoInfo': async (ctx, next) => {
    const videoId = ctx.params.videoId
    let vi = await VideoInfo.findOne({
      where: {
        videoId
      }
    })
    if (vi) {
      ctx.rest(vi)
    } else {
      throw new APIError('video:not_found', 'video not found bt videoId.')
    }
  },
  'GET /api/video/:videoId/getVideoLike': async (ctx, next) => {
    const videoId = ctx.params.videoId
    let vi = await VideoInfo.findOne({
      where: {
        videoId
      }
    })
    if (vi) {
      const likeInfolist = await vi.getLikeInfos()
      ctx.rest(likeInfolist)
    } else {
      throw new APIError('video:not_found', 'video not found bt videoId.')
    }
  },
  'GET /api/video/:videoId/getVideoShare': async (ctx, next) => {
    const videoId = ctx.params.videoId
    let vi = await VideoInfo.findOne({
      where: {
        videoId
      }
    })
    if (vi) {
      const shareInfolist = await vi.getShareInfos()
      ctx.rest(shareInfolist)
    } else {
      throw new APIError('video:not_found', 'video not found bt videoId.')
    }
  },
  'GET /api/video/:videoId/getVideoWatch': async (ctx, next) => {
    const videoId = ctx.params.videoId
    let vi = await VideoInfo.findOne({
      where: {
        videoId
      }
    })
    if (vi) {
      const watchInfolist = await vi.getWatchInfos()
      ctx.rest(watchInfolist)
    } else {
      throw new APIError('video:not_found', 'video not found bt videoId.')
    }
  },
  'GET /api/video/:videoId/getVideoComment/page/:page': async (ctx, next) => {
    const videoId = ctx.params.videoId
    let page = ctx.params.page
    if (page < 0 || isNaN(Number(page))) page = 1
    let vi = await VideoInfo.findOne({
      where: {
        videoId
      }
    })
    if (vi) {
      let result = []
      if (Number(page) === 1) {
        let topCommentId = await redisClient.zrevrange(`${KEY_COMMENT_LIKE_NUM}:${vi.videoId}`, 0, TOP_LIKE_COMMENT_NUM - 1)
        for (let i = 0, len = topCommentId.length; i < len; i++) {
          let res = await db.sequelize.query(`select CommentInfo.commentId,CommentInfo.videoId,CommentInfo.commentContent,CommentInfo.commentReplyID,CommentInfo.createdAt,UserInfo.userId,UserInfo.userNickname,UserInfo.userAvatar from CommentInfo
          inner join UserInfo
          on CommentInfo.userId = UserInfo.userId
          where CommentInfo.commentId = '${topCommentId[i]}'`)
          let comment = res[0][0]
          let replyComment
          let likeNum = await redisClient.zscore(`${KEY_COMMENT_LIKE_NUM}:${vi.videoId}`, topCommentId[i])
          if (comment.commentReplyID !== '') {
            let res = await db.sequelize.query(`select CommentInfo.commentId,CommentInfo.videoId,CommentInfo.commentContent,CommentInfo.commentReplyID,CommentInfo.createdAt,UserInfo.userId,UserInfo.userNickname,UserInfo.userAvatar from CommentInfo
            inner join UserInfo
            on CommentInfo.userId = UserInfo.userId
            where CommentInfo.commentId = '${comment.commentReplyID}'`)
            replyComment = res[0][0]
          }
          if (typeof replyComment === 'undefined') {
            result.push({
              Comment: comment,
              likeNum
            })
          } else {
            result.push({
              Comment: comment,
              replyComment,
              likeNum
            })
          }
        }
        let res1 = await db.sequelize.query(`select CommentInfo.commentId,CommentInfo.commentContent,CommentInfo.commentReplyID,CommentInfo.createdAt,UserInfo.userId,UserInfo.userNickname,UserInfo.userAvatar from VideoInfo
        inner join CommentInfo
        on VideoInfo.videoId = CommentInfo.videoId
        inner join UserInfo
        on CommentInfo.userId = UserInfo.userId
        where VideoInfo.videoId = '${videoId}'
        order by CommentInfo.createdAt desc
        limit ${PER_PAGE_LIMIT_NUM - TOP_LIKE_COMMENT_NUM}`)
        const commentInfolist = res1[0]
        for (let i = 0, len = commentInfolist.length; i < len; i++) {
          let comment = commentInfolist[i]
          let replyComment
          let likeNum = await redisClient.zscore(`${KEY_COMMENT_LIKE_NUM}:${vi.videoId}`, comment.commentId)
          if (comment.commentReplyID !== '') {
            let res = await db.sequelize.query(`select CommentInfo.commentId,CommentInfo.commentContent,CommentInfo.commentReplyID,CommentInfo.createdAt,UserInfo.userId,UserInfo.userNickname,UserInfo.userAvatar from CommentInfo
            inner join UserInfo
            on CommentInfo.userId = UserInfo.userId
            where CommentInfo.commentId = '${comment.commentReplyID}'`)
            replyComment = res[0][0]
          }
          if (typeof replyComment === 'undefined') {
            result.push({
              Comment: comment,
              likeNum
            })
          } else {
            result.push({
              Comment: comment,
              replyComment,
              likeNum
            })
          }
        }
      } else {
        let res = await db.sequelize.query(`select CommentInfo.commentId,CommentInfo.commentContent,CommentInfo.commentReplyID,CommentInfo.createdAt,UserInfo.userId,UserInfo.userNickname,UserInfo.userAvatar from VideoInfo
        inner join CommentInfo
        on VideoInfo.videoId = CommentInfo.videoId
        inner join UserInfo
        on CommentInfo.userId = UserInfo.userId
        where VideoInfo.videoId = '${videoId}'
        order by CommentInfo.createdAt desc
        limit ${PER_PAGE_LIMIT_NUM - TOP_LIKE_COMMENT_NUM} offset ${PER_PAGE_LIMIT_NUM * (page - 1)}`)
        const commentInfolist = res[0]
        for (let i = 0, len = commentInfolist.length; i < len; i++) {
          let comment = commentInfolist[i]
          let replyComment
          let likeNum = await redisClient.zscore(`${KEY_COMMENT_LIKE_NUM}:${vi.videoId}`, comment.commentId)
          if (comment.commentReplyID !== '') {
            let res = await db.sequelize.query(`select CommentInfo.commentId,CommentInfo.commentContent,CommentInfo.commentReplyID,CommentInfo.createdAt,UserInfo.userId,UserInfo.userNickname,UserInfo.userAvatar from CommentInfo
            inner join UserInfo
            on CommentInfo.userId = UserInfo.userId
            where CommentInfo.commentId = '${comment.commentReplyID}'`)
            replyComment = res[0][0]
          }
          if (typeof replyComment === 'undefined') {
            result.push({
              Comment: comment,
              likeNum
            })
          } else {
            result.push({
              Comment: comment,
              replyComment,
              likeNum
            })
          }
        }
      }
      ctx.rest(result)
    } else {
      throw new APIError('video:not_found', 'video not found bt videoId.')
    }
  },
  'GET /api/common/video/:videoId/getVideoWSLCNum': async (ctx, next) => {
    const videoId = ctx.params.videoId
    let shareNum = await redisClient.zscore(KEY_SHARE_NUM, videoId)
    let watchNum = await redisClient.zscore(KEY_WATCH_NUM, videoId)
    let commentNum = await redisClient.zscore(KEY_COMMENT_NUM, videoId)
    let likeNum = await redisClient.zscore(KEY_LIKE_NUM, videoId)
    ctx.rest({
      shareNum,
      watchNum,
      commentNum,
      likeNum
    })
  }
}
