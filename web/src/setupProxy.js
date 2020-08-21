
const proxy = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(proxy('/api/', {
    target: 'http://172.168.1.114:8000',
    changeOrigin: true,
    ws: true,
    headers: {'X-Real-IP': '172.168.1.114'},
    pathRewrite: {
      '^/api': ''
    }
  }))
};
