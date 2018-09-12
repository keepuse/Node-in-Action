var fs = require('fs');
var path = require('path');
var args = process.argv.splice(2); //去掉“node cli_tasks.js”，只留下参数
// args 获取的是当前node控制台里面的命令
var command = args.shift();  //取出第一个参数（命令）；
var taskDescription = args.join(' ');  //合并剩余的参数
// process.cwd()   returns the current working directory 
var file = path.join(process.cwd(), '/.tasks');  //根据当前的工作目录解析数据库的相对路径

console.log(file)
switch(command) {
	case 'list':
		listTasks(file)
		break
	case 'add':
		addTask(file, taskDescription)
		break
	default: 
		console.log('Usage: ' + process.argv[0]
		+ ' list|add [taskDescription]')
}

function loadOrInitializeTaskArray(file, cb) {
	fs.exists(file, function(exists) {
		let tasks = []
		if (exists) {
			fs.readFile(file, 'utf8', function(err, data) {
				if (err) throw err
				let dataStr = data.toString()
				tasks = JSON.parse(dataStr || '[]') 
				cb(tasks)
			})
		} else {
			cb([]) // 如果 .tasks文件不存在，则创建空的任务数组
		}
	})
}

function listTasks(file) {
	loadOrInitializeTaskArray(file, function(tasks) {
		for (let i in tasks) {
			console.log(tasks[i])
		}
	})
}

function storeTasks(file, tasks) {
	fs.writeFile(file, JSON.stringify(tasks), 'utf8', function(err) {
		if (err) throw err
		console.log('saved.')
	})
}

function addTask(file, taskDescription) {
	loadOrInitializeTaskArray(file, function(tasks) {
		tasks.push(taskDescription)
		storeTasks(file, tasks)
	})
}