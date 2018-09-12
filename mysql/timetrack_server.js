var http = require('http')
var work = require('./lib/timetrack')
var mysql = require('mysql') //引入MySQL API

const db = mysql.createConnection({ // 连接MySQL
	host: '127.0.0.1',
	user: 'myuser',
	password: 'mypassword',
	database: 'timetrack',
})

var server = http.createServer(function (req, res) {
	switch (req.method) {
		case 'POST':
			switch (req.url) {
				case '/':
					work.add(db, req, res)
					break
				case '/archive':
					work.archive(db, req, res)
					break
				case '/delete':
					work.delete(db, req, res)
					break
			}
			break
		case 'GET':
			switch(req.url) {
				case '/':
					
			}
	}
})