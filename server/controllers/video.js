const APIError = require('../rest').APIError
const VideoInfo = require('../models/VideoInfo')

module.exports = {
  'GET /api/video/getPopularVideo': async (ctx, next) => {
    let videoList = await VideoInfo.findAll({
      limit: 10
    })
    ctx.rest(videoList)
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
  'GET /api/video/:videoId/getVideoComment': async (ctx, next) => {
    const videoId = ctx.params.videoId
    let vi = await VideoInfo.findOne({
      where: {
        videoId
      }
    })
    if (vi) {
      const commentInfolist = await vi.getCommentInfos()
      ctx.rest(commentInfolist)
    } else {
      throw new APIError('video:not_found', 'video not found bt videoId.')
    }
  }
}
