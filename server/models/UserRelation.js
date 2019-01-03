const db = require('../db')

module.exports = db.defineModel('UserRelation', {
  fromId: {
    type: db.ID,
    references: {
      model: 'UserRegister',
      key: 'userId'
    }
  },
  toId: {
    type: db.ID,
    references: {
      model: 'UserRegister',
      key: 'userId'
    }
  },
  bothStatus: db.BOOLEAN,
  isRead: {
    type: db.BOOLEAN,
    allowNull: false,
    default: false
  }
})
