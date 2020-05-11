const {mockList} = require('./mock/index')
const os = require('os')
let localhost = ''
try {
  const network = os.networkInterfaces()
  localhost = network[Object.keys(network)[0]][1].address
} catch (e) {
  localhost = 'localhost';
}

module.exports = {
	publicPath: "./",
	outputDir: "dist",
	assetsDir: "static",
	configureWebpack: {
		devServer: {
			contentBase: "./build", //项目基本访问目录
			host: localhost, //服务器ip地址
			port: 8080, //端口
			open: true, //自动打开页面
			hot: true, //模块热替换
			hotOnly: true, //只有热更新不会刷新页面
			//mock数据接口部分 关键部分
			before(app) {

				app.get("/api/test/getList", (req, res) => {
					res.json({
						code: 200,
						data: mockList
					});
				});

			}
		}
  },
  // 扩展 webpack 配置，使 packages 加入编译
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
        .add('/packages/')
        .end()
      .use('babel')
        .loader('babel-loader')
        .tap(options => {
          // 修改它的选项...
          return options
        })
  }
};