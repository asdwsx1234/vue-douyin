const APIError = require('../rest').APIError
const db = require('../db')
const PER_PAGE_LIMIT_NUM = 20
module.exports = {
  'POST /api/common/admin/loginByPassword': async (ctx, next) => {
    const user = {
      email: ctx.request.body.email,
      password: ctx.request.body.password
    }
    let result = false
    if (user.email === '814930498@qq.com' && user.password === 'asdwsx1234') {
      result = true
    }
    if (result) {
      ctx.session.userEmail = user.email
      ctx.rest(ctx.session)
    } else {
      throw new APIError('user:not_found', 'email or password error')
    }
  },
  'GET /api/admin/getNums': async (ctx, next) => {
    let result = {
      today: {},
      sum: {}
    }
    let r = await db.sequelize.query('select count(*) as num from UserRegister')
    result.sum.userSum = r[0][0].num
    let r1 = await db.sequelize.query('select count(*) as num from CommentInfo')
    result.sum.commentSum = r1[0][0].num
    let r2 = await db.sequelize.query('select count(*) as num from VideoInfo')
    result.sum.videoSum = r2[0][0].num
    let r3 = await db.sequelize.query('select count(*) as num from WatchInfo')
    result.sum.watchSum = r3[0][0].num
    let tr = await db.sequelize.query(`select count(*) as num from UserRegister Where date_format(from_unixtime(ROUND(createdAt / 1000)),'%Y-%m-%d') = date_format(now(),'%Y-%m-%d') `)
    result.today.userSum = tr[0][0].num
    let tr1 = await db.sequelize.query(`select count(*) as num from CommentInfo Where date_format(from_unixtime(ROUND(createdAt / 1000)),'%Y-%m-%d') = date_format(now(),'%Y-%m-%d') `)
    result.today.commentSum = tr1[0][0].num
    let tr2 = await db.sequelize.query(`select count(*) as num from VideoInfo Where date_format(from_unixtime(ROUND(createdAt / 1000)),'%Y-%m-%d') = date_format(now(),'%Y-%m-%d') `)
    result.today.videoSum = tr2[0][0].num
    let tr3 = await db.sequelize.query(`select count(*) as num from WatchInfo Where date_format(from_unixtime(ROUND(createdAt / 1000)),'%Y-%m-%d') = date_format(now(),'%Y-%m-%d') `)
    result.today.watchSum = tr3[0][0].num
    ctx.rest(result)
  },
  'GET /api/admin/getAllUser/:page': async (ctx, next) => {
    let page = ctx.params.page
    if (page < 0 || isNaN(Number(page))) page = 1
    let r = await db.sequelize.query(`select a.userId,a.userEmail,a.userStatus,b.userNickname,b.userAvatar,b.userAddress,b.userGender,b.userAge,b.userDesc from UserRegister a
    inner join UserInfo b
    on a.userId = b.userId
    order by a.createdAt desc
    limit ${PER_PAGE_LIMIT_NUM} offset ${(page - 1) * PER_PAGE_LIMIT_NUM}`)
    ctx.rest(r[0])
  }
}
