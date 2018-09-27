var connect = require('connect')
var app = connect()
		.use(connect.directory('../connect'))
		.use(connect.static('../connect'))
app.listen(3000)

// 当前版本不支持 connect.satatic 和 connect.directory
// 安装 serve-static（加载静态文件） 和 serve-index（加载目录）