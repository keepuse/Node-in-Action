var connect = require('connect')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var app = connect()
	.use(cookieParser('tobi is a cool ferret'))
	.use(bodyParser())
	.use(function(req, res) {
		console.log(req.cookies)
		console.log(req.signedCookies)
		console.log(req.body)
		res.setHeader('Set-Cookie', 'foo=bar')
		res.setHeader('Set-Cookie', 'tobi=ferret; Expires=Tue, 08 Jun 2021 10:18:14 GMT')
		res.end('Registered new user: ' + req.body.username)
	})
	.listen(3000)

