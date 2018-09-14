var connect = require('connect')
// db 的数据格式不对， db.users应该是一个对象，不是一个数组
const db = {
	users: [
		{ name: 'tobi' },
		{ name: 'loki' },
		{ name: 'jane' },
	]
}

var api = connect()
	.use(users)
	.use(pets)
	.use(errorHandler)

var app = connect()
	.use(hello)
	.use('/api', api)
	.use(errorPage)

app.listen(3000)

function hello(req, res, next) {
	if (req.url.match(/^\/hello/)) {
		res.end('hello world\n')
	} else {
		next()
	}
}

function users(req, res, next) {
	console.log(req.url)
	let match = req.url.match(/^\/user\/(.+)/)
	console.log(match)
	if (match) {
		console.log(db.users)
		let user = db.users[match[1]]
		if (user) {
			res.setHeader('Content-Type', 'application/json')
			res.end(JSON.stringify(user))
		} else {
			let err = new Error('User not found')
			err.notFound = true
			next(err)
		}
	} else {
		next()
	}
}

function pets(req, res, next) {
	if (req.url.match(/^\/pet\/(.+)/)) {
		foo()
	} else {
		next()
	}
}

function errorHandler(err, req, res, next) {
	console.error(err.stack)
	res.setHeader('Content-Type', 'application/json')
	if (err.notFound) {
		res.statusCode = 404
		res.end(JSON.stringify({ error: err.message}))
	} else {
		res.statusCode = 500
		res.end(JSON.stringify({error: 'Internal Server Error'}))
	}
}

function errorPage(req, res, next) {
	res.setHeader('Content-Type', 'application/json')
	res.end('errrrr')
}