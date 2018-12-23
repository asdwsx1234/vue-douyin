const Koa = require('koa')
const path = require('path')
const session = require('koa-session2')
const Store = require('./Store')
const restify = require('./rest').restify
const controller = require('./controller')
let staticFiles = require('./staticFiles')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')

const app = new Koa()

app.use(session({
  store: new Store()
}))

app.use(staticFiles('/assets', path.join(__dirname, 'static/assets')))
app.use(restify())
app.use(bodyParser())
app.use(cors({
  origin: function (ctx) {
    if (ctx.url === '/test') {
      return '*' // 允许来自所有域名请求
    }
    return 'http://localhost:8080'
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

app.listen(3000)
console.log('listening at port 3000...')
