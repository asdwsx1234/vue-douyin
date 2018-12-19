const Koa = require('koa')
const path = require('path')
const restify = require('./rest').restify
const controller = require('./controller')
let staticFiles = require('./staticFiles')
const bodyParser = require('koa-bodyparser')

const app = new Koa()

app.use(async (ctx, next) => {
  console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
  await next()
})

app.use(staticFiles('/assets', path.join(__dirname, 'static/assets')))
app.use(bodyParser())
app.use(restify())
app.use(controller())
app.listen(3000)

console.log('listening at port 3000...')
