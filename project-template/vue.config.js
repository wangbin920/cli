const path = require('path')
const resolve = dir => path.join(__dirname, dir)
const IS_PROD = process.env.NODE_ENV === 'production'
// 是否需要打包分析
const needBundleanalyze = false

module.exports = {
    transpileDependencies: ['/op-template/'],
    // source map作用是打印会显示代码具体行数位置。禁用生产环境下的map包 | default => true
    productionSourceMap: !IS_PROD,
    outputDir: 'dist',
    devServer: {
        disableHostCheck: true,
        hotOnly: true,
        open: true,
        port: 8080,
        https: false,
        // 配置跨域
        proxy: {
            '/api': {
                // 是否支持webSocket
                ws: true,
                // 代理目标地址
                // 测试环境
                target: 'https://odpmt.oceanpayment.com',
                // 跨域许可
                changOrigin: true
            }
        }
    },
    configureWebpack: config => {
        // 需要添加插件的数组
        const plugins = []
        if (IS_PROD) {
            const uglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
            const CompressionWebpackPlugin = require('compression-webpack-plugin')
            const BrotliPlugin = require('brotli-webpack-plugin')
            const zopfli = require('@gfx/zopfli')
            const CompressionProportionNumber = 0.9
            const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i
            // Gzip压缩项目
            // gz格式压缩
            plugins.push(
                new CompressionWebpackPlugin({
                    algorithm (input, compressionOptions, callback) {
                        return zopfli.gzip(input, compressionOptions, callback)
                    },
                    compressionOptions: {
                        numiterations: 15
                    },
                    minRatio: CompressionProportionNumber,
                    test: productionGzipExtensions
                }),

                new uglifyjsWebpackPlugin({
                    uglifyOptions: {
                        output: {
                            comments: false // 去掉注释
                        },
                        warnings: false,
                        compress: {
                            drop_console: true,
                            drop_debugger: false,
                            pure_funcs: ['console.log'] // 移除console
                        }
                    }
                }),

                // br格式压缩
                new BrotliPlugin({
                    test: productionGzipExtensions,
                    minRatio: CompressionProportionNumber
                })
            )

            // 配置开发工具
            config.devtool = false
            console.log('\n开启Gzip压缩项目\n')
        }
        // 添加配置
        config.plugins = config.plugins.concat(plugins)
    },

    chainWebpack: config => {
        config.module
            .rule('vue')
            .use('vue-loader')
            .tap(options => {
                options.compilerOptions = options.compilerOptions || {}
                options.compilerOptions.isCustomElement = tag => tag === 'iconpark-icon'
                return options
            })

        config.resolve.symlinks(true) // 修复热更新失效
        config.resolve.alias
            .set('vue-i18n', 'vue-i18n/dist/vue-i18n.cjs.js')
            .set('@', resolve('src'))
            .set('api', resolve('src/api'))
            .set('views', resolve('src/views'))

        // 压缩图片
        // config.module
        //     .rule('images')
        //     .use('image-webpack-loader')
        //     .loader('image-webpack-loader')
        //     .options({
        //         bypassOnDebug: true
        //     })
        //     .end()

        // 是否需要打包分析
        if (needBundleanalyze) {
            const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
            config.plugin('webpack-report').use(BundleAnalyzerPlugin, [{ analyzerMode: 'static' }])
        }
    },

    css: {
        loaderOptions: {
            less: {
                modifyVars: {
                    'primary-color': '#28A745',
                    'link-color': '#28A745',
                    'border-radius-base': '4px'
                },
                javascriptEnabled: true
            }
        }
    }
}
