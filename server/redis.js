const Redis = require('ioredis')
const VideoInfo = require('./models/VideoInfo')
const LikeInfo = require('./models/LikeInfo')
const KEY_WATCH_NUM = 'videoWatchNum'
const KEY_SHARE_NUM = 'videoShareNum'
const KEY_LIKE_NUM = 'videoLikeNum'
const KEY_COMMENT_NUM = 'videoCommentNum'
const KEY_COMMENT_LIKE_NUM = 'commmentLikeNum'
const client = new Redis(6379, 'localhost', {
  lazyConnect: true
})
// 重启服务器还原redis的数据，防止redis被我自己关了之后丢失数据，因为暂时都是测试数据，先不考虑redis持久化
client.connect().then(async () => {
  const Videos = await VideoInfo.findAll()
  for (let i = 0, len = Videos.length; i < len; i++) {
    let video = Videos[i]
    let likeInfos = await video.getLikeInfos()
    let shareInfos = await video.getShareInfos()
    let watchInfos = await video.getWatchInfos()
    let commentInfos = await video.getCommentInfos()
    await client.zadd(KEY_LIKE_NUM, likeInfos.length, video.videoId)
    await client.zadd(KEY_SHARE_NUM, shareInfos.length, video.videoId)
    await client.zadd(KEY_WATCH_NUM, watchInfos.length, video.videoId)
    await client.zadd(KEY_COMMENT_NUM, commentInfos.length, video.videoId)
    for (let i = 0, len = commentInfos.length; i < len; i++) {
      let commentId = commentInfos[i].commentId
      let likeInfos = await LikeInfo.findAll({
        where: {
          commentId,
          videoId: null
        }
      })
      await client.zadd(`${KEY_COMMENT_LIKE_NUM}:${video.videoId}`, likeInfos.length, commentId)
    }
  }
  console.log('redis init suc!')
})

module.exports = client
