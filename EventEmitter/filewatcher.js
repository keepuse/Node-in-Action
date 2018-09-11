var fs = require('fs')
var events = require('events')
var util = require('util')
var watchDir = './watch'
var processDir = './done'

function Watcher(watchDir, processDir) {
	this.watchDir = watchDir
	this.processDir = processDir
}
util.inherits(Watcher, events.EventEmitter)

Watcher.prototype.watch = function() {
	let watcher = this
	fs.readdir(this.watchDir, function(err, files) {
		if (err) throw err
		for (let index in files) {
			watcher.emit('process', files[index])
		}
	})
}

Watcher.prototype.start = function() {
	let watcher = this
	fs.watchFile(watchDir, function() {
		watcher.watch()
	})
}


var watcher = new Watcher(watchDir, processDir)
watcher.on('process', function process(file) {
	var watchFile      = this.watchDir + '/' + file;
	var processedFile  = this.processDir + '/' + file.toLowerCase();
	fs.rename(watchFile, processedFile, function(err) {
	  if (err) throw err;
	}); 
})

watcher.start()