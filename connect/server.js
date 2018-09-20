var connect = require('connect')
var contentType = require('content-type')
var bodyParser = require('body-parser')
var getRawBody = require('raw-body')
var app = connect()
	// .use(limit)
		  .use(type('application/x-www-form-urlencoded',bodyParser({limit:'64kb'})))
		  .use(type('application/json',bodyParser({limit:'32kb'})))
		  .use(type('image',bodyParser({limit:'2mb'})))
		  .use(type('video',bodyParser({limit:'300mb'})))
	 	// .use(bodyParser.raw({limit: '100kb'}))
	  	.use(hello)
app.listen(3000)

// connect.limit在未来版本抽出, 使用raw-body替换
// 现在在bodyParser中可以直接设置限制大小

function hello(req, res, next) {
	console.log('end')
	res.end('hello')
}

function type(type,fn) {
	return function(req, res, next) {
		let ct  = req.headers['content-type'] || ''
		if (0!==ct.indexOf(type)) {
			// 首先检查content-type
			return next()
		}
		fn(req,res,next)

	}
}

// function limit(req, res, next) {
// 	getRawBody(req, 
// 		{
// 			length: req.headers['content-length'],
// 			limit: '32kb',
// 			encoding: contentType.parse(req).parameters.charset
// 		},
// 		function(err, string) {
// 			if (err) return next(err)
// 			next()
// 		})
// }