const db = require('../db')

let UserInfo = db.defineModel('UserInfo', {
  userNickname: db.STRING(50),
  userAddress: db.STRING(100),
  userGender: db.STRING(4),
  userAge: db.INTEGER(3),
  userDesc: db.STRING(200),
  userStatus: db.STRING(20)
})

module.exports = UserInfo
