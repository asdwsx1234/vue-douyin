const db = require('../db')

module.exports = db.defineModel('AtUser', {
  atUserId: {
    type: db.ID,
    references: {
      model: 'UserRegister',
      key: 'userId'
    }
  },
  videoId: {
    type: db.ID,
    references: {
      model: 'VideoInfo',
      key: 'videoId'
    }
  },
  commentId: {
    type: db.ID,
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
  },
  isRead: {
    type: db.BOOLEAN,
    allowNull: false,
    default: false
  }
})
