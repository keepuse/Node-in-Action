var http = require('http')
var url = require('url')
var items = []

var server = http.createServer(function (req, res) {
	switch (req.method) { // req.method是请求所用的HTTP方法
		case 'POST':
			var item = '' // 为进来的事项设置字符串缓存
			req.setEncoding('utf8') // 将进来的data事件编码为UTF-8字符串
			req.on('data', function (chunk) {
				item += chunk // 将数据块拼接到缓存上
			})
			req.on('end', function () {
				items.push(item) // 将完整的新事项压入事项数组中
				res.end('OK\n')
			})
			break
		case 'GET':
			let body = items.map(function (item, i) {
				return i + ') ' + item
			}).join('\n')
			res.setHeader('Content-Length', Buffer.byteLength(body))
			res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
			res.end(body)
			break
		case 'DELETE':
			let path = url.parse(req.url).pathname
			let i = parseInt(path.slice(1), 10)
			if (isNaN(i)) {
				res.statusCode = 400
				res.end('Invalid item id')
			} else if (!items[i]) {
				res.statusCode = 404
				res.end('Item not found')
			} else {
				items.splice(i, 1)
				res.end('ok\n')
			}
			break

		case 'PUT':
			let path = url.parse(req.url).pathname
			let i = parseInt(path.slice(1), 10) // 需要修改的todo_list元素的下标
			if (isNaN(i)) {
				res.statusCode = 400
				res.end('Invalid item id')
			} else if (!items[i]) {
				res.statusCode = 404
				res.end('Item not found')
			} else {
				let item = ''
				req.on('data', function (chunk) {
					item += chunk // 将数据块拼接到缓存上
				})
				req.on('end', function () {
					items[i] = item // 将完整的新事项压入事项数组中
					let body = i + ') ' + item[i] // 返回这条数据
					res.setHeader('Content-Length', Buffer.byteLength(body))
					res.setHeader('Content-Type', 'text/plain; charset="utf-8"')
					res.end(body)
				})
			}
			break
	}
})

server.listen(3000, '127.0.0.1')