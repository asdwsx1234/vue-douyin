const db = require('../db')

module.exports = db.defineModel('PrivateLetter', {
  privateLetterContent: db.STRING(255),
  privateLetterStatus: db.STRING(20),
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
  }
})
