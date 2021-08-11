const { createProxyMiddleware } = require('http-proxy-middleware')

const proxyOptions = {
    target: 'tuho.tv',
    secure: false,
    changeOrigin: true,
    router: {
        'www.tuho.tv:3333': 'https://www.tuho.tv',
        'm.tuho.tv:3333': 'https://m.tuho.tv'
    }
}

const serverOptions = {
    host: 'tuho.tv',
    port: 3333,
    https: true,
    open: false,
    notify: false,
    ui: false,
    logLevel: 'silent',
    middleware: [createProxyMiddleware(proxyOptions)]
}

module.exports = serverOptions
