const db = require('../db')

module.exports = db.defineModel('CommentInfo', {
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
