const APIError = require('../rest').APIError
const VideoInfo = require('../models/VideoInfo')
const redisClient = require('../redis')

const KEY_WATCH_NUM = 'videoWatchNum'
const KEY_SHARE_NUM = 'videoShareNum'
const KEY_LIKE_NUM = 'videoLikeNum'
const KEY_COMMENT_NUM = 'videoCommentNum'
const VIDEO_NUM = 15
const PER_PAGE_LIMIT_NUM = 20
const TOP_LIKE_COMMENT_NUM = 3
module.exports = {
  'GET /api/common/video/getPopularVideo': async (ctx, next) => {
    let key = 'popularVideoList'
    let isExists = await redisClient.exists(key)
    if (!isExists) {
      let topWatchVid = await redisClient.zrevrange(KEY_WATCH_NUM, 0, VIDEO_NUM)
      let topShareVid = await redisClient.zrevrange(KEY_SHARE_NUM, 0, VIDEO_NUM)
      let topLikeVid = await redisClient.zrevrange(KEY_LIKE_NUM, 0, VIDEO_NUM)
      let topCommentVid = await redisClient.zrevrange(KEY_COMMENT_NUM, 0, VIDEO_NUM)
      let summary = [...topWatchVid, ...topShareVid, ...topLikeVid, ...topCommentVid]
      let VideoSetId = new Set()
      for (let i of summary) {
        VideoSetId.add(i)
      }
      summary = []
      for (let videoId of VideoSetId) {
        let videoInfo = await VideoInfo.findOne({
          where: {
            videoId
          }
        })
        let ur = await videoInfo.getUserRegister()
        let userInfo = await ur.getUserInfo()
        let shareNum = await redisClient.zscore(KEY_SHARE_NUM, videoId)
        let watchNum = await redisClient.zscore(KEY_WATCH_NUM, videoId)
        let commentNum = await redisClient.zscore(KEY_COMMENT_NUM, videoId)
        let likeNum = await redisClient.zscore(KEY_LIKE_NUM, videoId)
        await redisClient.sadd(key, JSON.stringify({
          videoInfo,
          userInfo,
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
  // 'GET /api/video/:videoId/getVideoComment/:page': async (ctx, next) => {
  //   const videoId = ctx.params.videoId
  //   const page = ctx.params.page || 0
  //   let vi = await VideoInfo.findOne({
  //     where: {
  //       videoId
  //     }
  //   })
  //   if (vi) {
  //     let result = []
  //     if (page === 0) {
  //       const commentInfolist = await vi.getCommentInfos({
  //         where: {

  //         },
  //         limit: TOP_LIKE_COMMENT_NUM
  //       })
  //     }

  //     ctx.rest(commentInfolist)
  //   } else {
  //     throw new APIError('video:not_found', 'video not found bt videoId.')
  //   }
  // },
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
