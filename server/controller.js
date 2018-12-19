const fs = require('fs')
const path = require('path')

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

module.exports = function (dir) {
  let controllersDir = dir || 'controllers'
  let router = require('koa-router')()
  addControllers(router, controllersDir)
  return router.routes()
}
