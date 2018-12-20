const db = require('../db')
const UserInfo = require('./UserInfo')
const VideoInfo = require('./VideoInfo')
const Likeinfo = require('./LikeInfo')
const ShareInfo = require('./ShareInfo')
const WatchInfo = require('./WatchInfo')
const CommentInfo = require('./CommentInfo')
const UserRelation = require('./UserRelation')
const AtUser = require('./AtUser')
const PrivateLetter = require('./PrivateLetter')
let UserRegister = db.defineModel('UserRegister', {
  userId: {
    primaryKey: true,
    type: db.ID,
    allowNull: false
  },
  userTel: {
    type: db.STRING(11),
    unique: true
  },
  userPassword: db.STRING(100)
})

UserRegister.hasOne(UserInfo, { foreignKey: 'userId' })
UserRegister.hasMany(UserRelation, { as: 'Followers', foreignKey: 'fromId' })
UserRegister.hasMany(UserRelation, { as: 'Fans', foreignKey: 'toId' })
UserRegister.hasMany(PrivateLetter, { as: 'SentMessages', foreignKey: 'fromId' })
UserRegister.hasMany(PrivateLetter, { as: 'ReceviedMessages', foreignKey: 'toId' })
UserRegister.hasMany(VideoInfo, { foreignKey: 'userId' })
UserRegister.hasMany(Likeinfo, { foreignKey: 'userId' })
UserRegister.hasMany(ShareInfo, { foreignKey: 'userId' })
UserRegister.hasMany(WatchInfo, { foreignKey: 'userId' })
UserRegister.hasMany(CommentInfo, { foreignKey: 'userId' })
VideoInfo.belongsTo(UserRegister, { foreignKey: 'userId' })
Likeinfo.belongsTo(UserRegister, { foreignKey: 'userId' })
ShareInfo.belongsTo(UserRegister, { foreignKey: 'userId' })
WatchInfo.belongsTo(UserRegister, { foreignKey: 'userId' })
CommentInfo.belongsTo(UserRegister, { foreignKey: 'userId' })
UserRelation.belongsTo(UserInfo, { as: 'FromUserInfo', foreignKey: 'fromId', targetKey: 'userId' })
UserRelation.belongsTo(UserInfo, { as: 'ToUserInfo', foreignKey: 'toId', targetKey: 'userId' })
PrivateLetter.belongsTo(UserInfo, { as: 'FromUserInfo', foreignKey: 'fromId', targetKey: 'userId' })
PrivateLetter.belongsTo(UserInfo, { as: 'ToUserInfo', foreignKey: 'toId', targetKey: 'userId' })
AtUser.belongsTo(UserRegister, { as: 'User', foreignKey: 'userId' })
AtUser.belongsTo(UserRegister, { as: 'atUser', foreignKey: 'atUserId' })

module.exports = UserRegister
