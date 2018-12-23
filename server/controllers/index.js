const fs = require('fs')
module.exports = {
  'GET /': async (ctx, next) => {
    var index = fs.readFileSync('./static/index.html')
    ctx.response.type = 'text/html'
    ctx.response.body = index
  }
}
