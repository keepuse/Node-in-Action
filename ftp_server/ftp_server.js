var http = require('http')
var parse = require('url').parse
var join = require('path').join
var fs = require('fs')

var root = __dirname

var server = http.createServer(function (req, res) {
	var url = parse(req.url)
	var path = join(root, url.pathname)
	fs.stat(path, function (err, stat) {
		if (err) {
			if ('ENOENT' == err.code) {
				res.statusCode = 404
				res.end('Not Found')
			} else { //其他错误
				res.statusCode = 500
				res.end('Internal Server Error')
			}
		} else {
			res.setHeader('Content-Length', stat.size) // 用stat对象的属性设置Content-Length
			var stream = fs.createReadStream(path)
			stream.pipe(res)
			stream.on('error', function (err) {
				res.statusCode = 500
				res.end('Internal Server Error')
			})
		}
	})
})

server.listen(3000, '127.0.0.1')