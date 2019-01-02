const fs = require('fs')
const path = require('path')
module.exports = {
  'GET /': async (ctx, next) => {
    var index = fs.readFileSync(path.join(__dirname, '../static/index.html'))
    ctx.response.type = 'text/html'
    ctx.response.body = index
  }
}
