var connect = require('connect')
var app = connect()
// res是同一个引用对象
// 中间件的执行是有顺序的
app.use(logger)
app.use('/admin', restrict)
app.use('/admin', admin)
app.use(hello)
app.listen(3000)

function logger(req, res, next) { // next是一个参数，代表将要执行的下一个函数
	res.setHeader('Content-Type', 'text/plain')
	console.log('%s, %s', req.method, req.url)
	next()
}

function hello(req, res) {
	res.end('hello world')
}

function restrict(req, res, next) {
	let authorization = req.headers.authorization
	if (!authorization) {
		return next(new Error('Unauthorized'))
		let parts = authorization.split(' ')
		let scheme = parts[0]
		let auth = new Buffer(parts[1], 'base64').toString().split(':')
		let user = auth[0]
		let pass = auth[1]

		// 根据数据库中的记录检查认证信息的函数
		authenticateWithDatabase(user , pass, function(err) {
			if (err) throw err
			next()
		})
	}
}

function admin(req, res, next) {
	switch (req.url) {
		case '/':
		  res.end('try /users')
		  break
		case '/users':
		  res.setHeader('Content-Type', 'application/json')
		  res.end(JSON.stringify(['tobi', 'loki', 'jane']))
		  break
	} 
}