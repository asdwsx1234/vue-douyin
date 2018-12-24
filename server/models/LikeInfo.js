const db = require('../db')

module.exports = db.defineModel('LikeInfo', {
  videoId: {
    type: db.ID,
    allowNull: true,
    references: {
      model: 'VideoInfo',
      key: 'videoId'
    }
  },
  commentId: {
    type: db.ID,
    allowNull: true,
    references: {
      model: 'CommentInfo',
      key: 'commentId'
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
