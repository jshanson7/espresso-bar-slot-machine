const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConf = require('./webpack.config');
const config = require('./config');
const devServer = new WebpackDevServer(webpack(webpackConf), webpackConf.devServer);

module.exports = devServer;

if (!module.parent) {
  devServer.listen(config.port, config.host, () =>
    console.log('devServer listening at ' + config.host + ':' + config.port + /webpack-dev-server/)
  );
}
