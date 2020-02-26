const webpack = require('webpack')
const utils = require('./build/utils')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const SpriteSmithPlugin = require('webpack-spritesmith')
const UglifyJSPlugin = require('terser-webpack-plugin')
const path = require('path')
const buildConfig = require('./build/config')

const { pages, plugins, devRewriteUrl } = utils.getMultiEntries()

module.exports = {
  assetsDir: 'static',
  pages: pages,
  publicPath: `/${buildConfig.publicPath}/`,
  // publicPath: '/userportrait',
  // 配置merge
  configureWebpack: process.env.NODE_ENV === 'production' ? {
    optimization: {
      minimizer: [
        new UglifyJSPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        cacheGroups: Object.assign({
          common: {
            name: 'chunk-common',
            priority: 1,
            chunks: 'all',
            minChunks: 2
          }
        }, plugins)
      }
    },
    performance: {
      hints: false,
      maxEntrypointSize: 5000000,
      maxAssetSize: 3000000
    },
    plugins: [
      new CompressionWebpackPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(js|css|html)$'),
        threshold: 10240,
        minRatio: 0.8
      }),
      new SpriteSmithPlugin({
        src: {
          cwd: path.resolve(__dirname, './src/assets/image/icon/'),
          glob: '**/*.png'
        },
        target: {
          image: path.resolve(__dirname, './src/assets/image/sprite/sprite.png'),
          css: path.resolve(__dirname, './src/assets/css/sprite.css')
        },
        // 样式文件中调用雪碧图地址写法
        apiOptions: {
          cssImageRef: '../image/sprite/sprite.png'
        },
        spritesmithOptions: {
          algorithm: 'left-right',
          padding: 10
        }
      }),
      new webpack.ProvidePlugin({
        buildConfig: [path.resolve(path.join(__dirname, 'build/config.js'))]
      })
    ],
    externals: {
      apiConfig: 'window.apiConfig',
      AMap: 'window.AMap',
      BMap: 'window.BMap'
    }
  } : {
    plugins: [
      new SpriteSmithPlugin({
        src: {
          cwd: path.resolve(__dirname, './src/assets/image/icon/'),
          glob: '**/*.png'
        },
        target: {
          image: path.resolve(__dirname, './src/assets/image/sprite/sprite.png'),
          css: path.resolve(__dirname, './src/assets/css/sprite.css')
        },
        // 样式文件中调用雪碧图地址写法
        apiOptions: {
          cssImageRef: '../image/sprite/sprite.png'
        },
        spritesmithOptions: {
          algorithm: 'left-right',
          padding: 10
        }
      }),
      new webpack.ProvidePlugin({
        buildConfig: [path.resolve(path.join(__dirname, 'build/config.js'))]
      })
    ],
    externals: {
      apiConfig: 'window.apiConfig',
      AMap: 'window.AMap'
    }
  },
  chainWebpack: config => {
    if (process.env.ANALYZE) {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer')
          .BundleAnalyzerPlugin)
        .end()
    }
    config
      .plugin('copy')
      .tap(options => {
        options[0][0].ignore.push('index.html')
        return options
      })
    config.module.rule('md')
      .test(/\.md/)
      .use('vue-loader')
      .loader('vue-loader')
      .end()
      .use('vue-markdown-loader')
      .loader('vue-markdown-loader/lib/markdown-compiler')
      .options({
        raw: true
      })
    config.resolve.alias
      .set('vue$', 'vue/dist/vue.esm.js')
      .set('@', path.resolve('src'))
      .set('@api', path.resolve('src/assets/js/api'))
      .set('@js', path.resolve('src/assets/js'))
      .set('@store', path.resolve('src/store'))
      .set('@mock', path.resolve('src/mock'))
      .set('@css', path.resolve('src/assets/css'))
      .set('@components', path.resolve('src/components'))
  },
  devServer: {
    proxy: {
      '/userportrait/portrait': {
        target: 'http://172.28.31.129:8093',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/userportrait/portrait': '/portrait'
        }
      },
      '/userportrait/centersso': {
        target: 'http://172.28.31.129:8881',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/userportrait/centersso': '/centersso'
        }
      }
    },
    historyApiFallback: {
      rewrites: devRewriteUrl
    },
    allowedHosts: [buildConfig.host]
  }
}
