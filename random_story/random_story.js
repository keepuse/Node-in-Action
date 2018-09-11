var fs = require('fs')
var request = require('request')
var htmlparser = require('htmlparser')
var configFilename = './rss_feeds.txt'

function checkForRSSFile() {
	console.log('checkForRSSFile')
	fs.exists(configFilename, function(exists) {
		if (!exists) {
			return next(new Error('Missing RSS file: ' + configFilename))
		}
		next(null, configFilename)
	})
}

function readRSSFile(configFilename) {
	console.log('readRSSFile')
	fs.readFile(configFilename, function(err, feedlist) {
		if (err) return next(err)
		feedlist = feedlist.toString().replace(/^\s+|\s+$/g, '').split('\n')
		let random = Math.floor(Math.random() * feedlist.length)
		next(null, feedlist[random])
	})
}

function downloadRSSFeed(feedUrl) {
	console.log('downloadRSSFeed')
	request({uri:feedUrl}, function(err, res, body) {
		if (err) return next(err)
		if (res.statusCode !== 200) {
			return next(new Error('Abnormal response status code'))
		}
		next(null, body)
	})
}

function parseRSSFeed(rss) {
	console.log('parseRSSFeed')
	let handler = new htmlparser.RssHandler()
	let parser = new htmlparser.Parser(handler)
	parser.parseComplete(rss)
	if (!handler.dom.items.length)
	  return next(new Error('No RSS items found'))
	let item = handler.dom.items.shift()
	console.log(item.title) // 如果有数据，显示第一个预订源条目的标题和URL
	console.log(item.link)
}

let tasks = [checkForRSSFile, readRSSFile, downloadRSSFeed, parseRSSFeed]

function next(err, result) {
	if (err) throw err 
	let currentTask = tasks.shift()
	if (currentTask) {
		currentTask(result)
	}
}

next()