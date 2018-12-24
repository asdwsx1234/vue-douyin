const db = require('../db')
const LikeInfo = require('./LikeInfo')

const CommentInfo = db.defineModel('CommentInfo', {
  commentId: {
    type: db.ID,
    allowNull: false,
    primaryKey: true
  },
  commentContent: db.STRING(255),
  commentReplyID: db.ID,
  videoId: {
    type: db.ID,
    references: {
      model: 'VideoInfo',
      key: 'videoId'
    }
  },
  userId: {
    type: db.ID,
    references: {
      model: 'UserRegister',
      key: 'userId'
    }
  }
})

module.exports = CommentInfo

CommentInfo.hasMany(LikeInfo, { foreignKey: 'commentId' })
LikeInfo.belongsTo(CommentInfo, { foreignKey: 'commentId' })
