'use strict'
const glob = require('glob')
const buildConfig = require('../build/config')
const path = require('path')

// build tool set

module.exports = {
  getMultiFiles: function (globPath) {
    // get multi pages's entry and template
    let entries = {}

    glob.sync(globPath).forEach(function (entry) {
      let pathList = entry.split('/')
      let baseConfig = require('.' + entry)
      baseConfig.publicPath = buildConfig.publicPath
      pathList.splice(-1)
      let pathname = pathList.slice(-1)[0]
      let chunks
      if (process.env.NODE_ENV === 'production') {
        chunks = ['chunk-vendors', 'chunk-common', 'vendor-' + pathname, pathname]
        // 引入对应的apiConfig
        switch (process.env.BUILD_ENV) {
          case 'prod':
            baseConfig.externals.apiconfig.url = [`/static/js/apiConfigProd.js`]
            break
          case 'uat':
            baseConfig.externals.apiconfig.url = [`/static/js/apiConfig.js`]
            break
          default:
            baseConfig.externals.apiconfig.url = [`/static/js/apiConfigProd.js`]
        }
      } else {
        chunks = ['chunk-vendors', 'chunk-common', 'vendor-' + pathname, 'mock', pathname]
      }
      entries[pathname] = Object.assign({
        entry: pathList.join('/') + '/' + pathname + '.js',
        template: 'public/' + pathname + '.html',
        filename: pathname + '/' + pathname + '.html',
        chunks: chunks
      }, baseConfig)
    })
    return entries
  },
  getMultiEntries: function () {
    let self = this
    let pages = self.getMultiFiles('./src/' + buildConfig.moduleName + '/**/page.config.json')
    let chunks = Object.keys(pages)
    let chunksPlugin = {}
    let devRewriteUrl = []
    chunks.forEach(function (item, index) {
      let newName = 'vendor-' + item
      chunksPlugin[item] = {
        name: newName,
        test: (module) => {
          switch (item) {
            case 'manage':
              return /codemirror|mavon-editor|quill/.test(module.context)
            case 'portal':
              return /echarts/.test(module.context)
          }
        },
        chunks: 'initial',
        minChunks: 1,
        priority: index
      }
      devRewriteUrl.push(
        { from: new RegExp(`^/${buildConfig.publicPath}/${item}/?.*`), to: path.posix.join('/', `${buildConfig.publicPath}/${item}/${item}.html`) }
      )
    })
    return {
      pages: pages,
      plugins: chunksPlugin,
      devRewriteUrl: devRewriteUrl
    }
  }
}
