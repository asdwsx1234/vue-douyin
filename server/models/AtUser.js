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
  userId: {
    type: db.ID,
    references: {
      model: 'UserRegister',
      key: 'userId'
    }
  }
})
