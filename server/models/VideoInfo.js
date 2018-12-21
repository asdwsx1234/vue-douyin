const db = require('../db')
const LikeInfo = require('./LikeInfo')
const ShareInfo = require('./ShareInfo')
const WatchInfo = require('./WatchInfo')
const CommentInfo = require('./CommentInfo')
const AtUser = require('./AtUser')

let VideoInfo = db.defineModel('VideoInfo', {
  videoId: {
    type: db.ID,
    allowNull: false,
    primaryKey: true
  },
  videoDuration: db.STRING(100),
  videoCover: db.STRING(200),
  videoDesc: db.STRING(200),
  videoPath: db.STRING(200),
  videoStatus: db.STRING(20)
})

VideoInfo.hasMany(LikeInfo, { foreignKey: 'videoId' })
VideoInfo.hasMany(ShareInfo, { foreignKey: 'videoId' })
VideoInfo.hasMany(WatchInfo, { foreignKey: 'videoId' })
VideoInfo.hasMany(CommentInfo, { foreignKey: 'videoId' })
LikeInfo.belongsTo(VideoInfo, { foreignKey: 'videoId' })
ShareInfo.belongsTo(VideoInfo, { foreignKey: 'videoId' })
WatchInfo.belongsTo(VideoInfo, { foreignKey: 'videoId' })
CommentInfo.belongsTo(VideoInfo, { foreignKey: 'videoId' })
AtUser.belongsTo(VideoInfo, { foreignKey: 'videoId' })
module.exports = VideoInfo
