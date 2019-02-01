const fs = require('fs')
const path = require('path')
module.exports = {
  'GET /': async (ctx, next) => {
    let index = fs.readFileSync(path.join(__dirname, '../static/index.html'))
    ctx.response.type = 'text/html'
    ctx.response.body = index
  },
  'GET /admin': async (ctx, next) => {
    let admin = fs.readFileSync(path.join(__dirname, '../static/admin.html'))
    ctx.response.type = 'text/html'
    ctx.response.body = admin
  }
}
