var connect = require('connect')
var contentType = require('content-type')
var bodyParser = require('body-parser')
var getRawBody = require('raw-body')
var app = connect()
	// .use(limit)
	  .use(bodyParser.raw({limit: '100kb'}))
	  .use(hello)
app.listen(3000)

// connect.limit在未来版本抽出, 使用raw-body替换

function hello(req, res, next) {
	console.log('end')
	res.end('hello')
}

function limit(req, res, next) {
	getRawBody(req, 
		{
			length: req.headers['content-length'],
			limit: '32kb',
			encoding: contentType.parse(req).parameters.charset
		},
		function(err, string) {
			if (err) return next(err)
			next()
		})
}