const Koa = require('koa')
const path = require('path')
const session = require('koa-session2')
const Store = require('./Store')
const restify = require('./rest').restify
const controller = require('./controller')
const staticFiles = require('./staticFiles')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const redisClient = require('./redis')
const VideoInfo = require('./models/VideoInfo')
const CommentInfo = require('./models/CommentInfo')
const app = new Koa()
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)

io.on('connection', socket => {
  const socketId = socket.id
  socket.on('login', async userId => {
    await redisClient.set(`SOCKET:${userId}`, socketId, 'EX', 1000000 / 1000)
    io.to(socketId).emit('responselogin', {
      userId,
      socketId
    })
  })
  socket.on('sendPrivateLetter', async data => {
    const { toId } = data
    const socketId = await redisClient.get(`SOCKET:${toId}`)
    io.to(socketId).emit('receivePrivateLetter', data)
  })
  socket.on('sendComment', async data => {
    const { toVideoId, replyId } = data
    if (replyId) {
      const commmentInfo = await CommentInfo.findOne({
        where: {
          commentId: replyId
        }
      })
      const toCommentOwnerId = commmentInfo.userId
      const toCUserSocketId = await redisClient.get(`SOCKET:${toCommentOwnerId}`)
      io.to(toCUserSocketId).emit('receiveComment', {
        toCommentOwnerId,
        toCUserSocketId
      })
    }
    const toVideoInfo = await VideoInfo.findOne({
      where: {
        videoId: toVideoId
      }
    })
    const toVideoOwnerId = toVideoInfo.userId
    const toUserSocketId = await redisClient.get(`SOCKET:${toVideoOwnerId}`)
    io.to(toUserSocketId).emit('receiveComment', {
      toVideoOwnerId,
      toUserSocketId
    })
  })
  socket.on('sendTriggerLike', async data => {
    const { toUserId } = data
    const toUserSocketId = await redisClient.get(`SOCKET:${toUserId}`)
    io.to(toUserSocketId).emit('receiveTriggerLike', {
      toUserId,
      toUserSocketId
    })
  })
  socket.on('sendTriggerFollow', async data => {
    const { toUserId } = data
    const toUserSocketId = await redisClient.get(`SOCKET:${toUserId}`)
    io.to(toUserSocketId).emit('receiveTriggerFollow', {
      toUserId,
      toUserSocketId
    })
  })
  socket.on('logout', async userId => {
    // 删除
    const socketId = await redisClient.get(`SOCKET:${userId}`)
    io.to(socketId).emit('responselogout', {
      userId,
      socketId
    })
    await redisClient.del(`SOCKET:${userId}`)
  })
})

app.use(session({
  store: new Store(),
  maxAge: 8 * 60 * 60 * 1000 + 1000000
}))

app.use(staticFiles('/assets', path.join(__dirname, 'static/assets')))
app.use(restify())
app.use(bodyParser())
app.use(cors({
  origin: function (ctx) {
    return ctx.request.header.origin || '*' // 允许来自所有域名请求
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET', 'POST', 'DELETE'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}))

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${rt}`)
})

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now()
  await next()
  const ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
})
// 拦截
app.use(async (ctx, next) => {
  if (!ctx.cookies.get('koa:sess') && !ctx.path.startsWith('/api/common/') && ctx.path !== '/') {
    ctx.response.status = 400
    ctx.response.type = 'application/json'
    ctx.response.body = {
      code: 'auth:not logged in',
      message: 'please login first.'
    }
    return
  }
  // 访问其他api更新session 保持身份不过期
  if (typeof ctx.cookies.get('koa:sess') !== 'undefined') ctx.session.refresh()
  await next()
})

app.use(controller())

server.listen(3000)

console.log('listening at port 3000...')
