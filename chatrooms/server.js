const http = require('http')　
const fs = require('fs')
const path = require('path')
const mime = require('mime')
const chatServer = require('./lib/chat_server')

var cache = {}

function send404(response) {
	response.writeHead(404, {'Content-Type': 'text/plain'})
	response.write('Error 404: resource not found.')
	response.end()
}

function sendFile(response, filePath, fileContents) {
	response.writeHead(200, {'Content-Type': mime.lookup(path.basename(filePath))})
	response.end(fileContents)
}

function serveStatic(response, cache, absPath) {
	if (cache[absPath]) { // 文件在内存中
		sendFile(response, absPath, cache[absPath])
	} else {
		fs.exists(absPath, function(exists) { // 文件是否存在
			if (exists) {
				fs.readFile(absPath, function(err,data) {
					if(err) {
						send404(response)
					} else {
						cache[absPath] = data
						sendFile(response, absPath, data)
					}
				})
			} else {
				send404(response)
			}
		})
	}
}

var server = http.createServer(function(request, response) {
	// 创建HTTP服务器，用匿名函数定义对每个请求的处理行为
	var filePath = false
	if (request.url === '/') {
		filePath = 'public/index.html'
	} else {
		filePath = 'public' + request.url
	}

	var absPath = './' + filePath
	serveStatic(response, cache, absPath)  //返回静态文件
})

server.listen(3000, function() {
	console.log('Server listening on port 3000.')
})

chatServer.listen(server)