const db = require('../db')

let UserInfo = db.defineModel('UserInfo', {
  userNickname: db.STRING(50),
  userAvatar: {
    type: db.STRING(255),
    allowNull: true
  },
  userAddress: db.STRING(100),
  userGender: db.STRING(4),
  userAge: db.INTEGER(3),
  userDesc: db.STRING(200)
})

module.exports = UserInfo
