const fs = require('fs')
const path = require('path')
const db = require('./db')
function addMapping (router, mapping) {
  for (var url in mapping) {
    if (url.startsWith('GET ')) {
      let path = url.substring(4)
      router.get(path, mapping[url])
      console.log(`register URL mapping: GET ${path}`)
    } else if (url.startsWith('POST ')) {
      let path = url.substring(5)
      router.post(path, mapping[url])
      console.log(`register URL mapping: POST ${path}`)
    } else if (url.startsWith('PUT ')) {
      let path = url.substring(4)
      router.put(path, mapping[url])
      console.log(`register URL mapping: PUT ${path}`)
    } else if (url.startsWith('DELETE ')) {
      let path = url.substring(7)
      router.del(path, mapping[url])
      console.log(`register URL mapping: DELETE ${path}`)
    } else {
      console.log(`invalid URL: ${url}`)
    }
  }
}

function addControllers (router, dir) {
  var files = fs.readdirSync(path.join(__dirname, dir))
  var jsFile = files.filter(f => {
    return f.endsWith('.js')
  })
  for (let f of jsFile) {
    console.log(`Process controller: ${f}...`)
    let mapping = require(path.join(__dirname, dir, f))
    addMapping(router, mapping)
  }
}

function addUploadFile (router) {
  const multer = require('koa-multer')
  let storage = multer.diskStorage({
    destination: path.join(__dirname, `./static/assets/videoPath/`),
    filename: function (req, file, cb) {
      let fileFormat = (file.originalname).split('.')
      cb(null, db.generateId() + '.' + fileFormat[fileFormat.length - 1])
    }
  })
  let upload = multer({ storage })
  router.post('/api/user/uploadFile', upload.single('videoPath'), async (ctx, next) => {
    if (ctx.req.file) {
      ctx.body = ctx.req.file
    } else {
      ctx.body = 'upload error'
    }
  })
}

function addUploadCover (router) {
  const multer = require('koa-multer')
  let storage = multer.diskStorage({
    destination: path.join(__dirname, `./static/assets/videoCover/`),
    filename: function (req, file, cb) {
      cb(null, req.body.videoId + '.jpg')
    }
  })
  let upload = multer({ storage })
  router.post('/api/user/uploadCover', upload.single('videoCover'), async (ctx, next) => {
    if (ctx.req.file) {
      ctx.body = ctx.req.file
    } else {
      ctx.body = 'upload error'
    }
  })
}

module.exports = function (dir) {
  let controllersDir = dir || 'controllers'
  let router = require('koa-router')()
  addControllers(router, controllersDir)
  addUploadFile(router)
  addUploadCover(router)
  return router.routes()
}
