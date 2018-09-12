var http = require('http')
var formidable = require('formidable')
var server = http.createServer(function (req, res) {
	switch (req.method) {
		case 'GET':
			show(req, res)
			break
		case 'POST':
			upload(req, res)
			break
	}
})

server.listen(3000, '127.0.0.1')

function show(req, res) { //提供带有文件上传控件的HTML表单
	var html = '' +
		'<form method="post" action="/" enctype="multipart/form-data">' +
		'<p><input type="text" name="name" /></p>' +
		'<p><input type="file" name="file" /></p>' +
		'<p><input type="submit" value="Upload" /></p>' +
		'</form>';
	res.setHeader('Content-Type', 'text/html')
	res.setHeader('Content-Length', Buffer.byteLength(html))
	res.end(html)
}

function upload(req, res) {
	if (!isFormData(req)) {
		res.statusCode = 400
		res.end('Bad Request: expecting multipart/form-data')
		return
	}

	let form = new formidable.IncomingForm()
	// 这里可以添加form的事件监听

	form.on('field', function(field, value) {
		console.log(field)
		console.log(value)
	})

	form.on('file', function(name, file) {
		console.log(name)
		console.log(file)
	})

	form.on('end', function() {
		res.end('upload complete!')
	})

	// 也可以这样写
	// form.parse(req, function(err, fields, files) {
	// 	console.log(fields)
	// 	console.log(files)
	// 	res.end('upload complete!')
	// })

	// 显示上传进度
	form.on('progress', function(bytesReceived, bytesExpected) {
		let percent = Math.floor(bytesReceived / bytesExpected * 100)
		// 可以创建一个socket连接返回上传进度
		// socket.emit('message', percent)
		// 在前端加事件监听socket.on('message', function(percent) {showpercent()})
		console.log(percent)
	})
	form.parse(req)
	
	
	
}

function isFormData(req) {
	var type = req.headers['content-type'] || ''
	return type.indexOf('multipart/form-data') === 0 // 是否是文件上传的请求
}