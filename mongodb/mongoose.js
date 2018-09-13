var mongoose = require('mongoose')
var db = mongoose.connect('mongodb://localhost/tasks') // 默认端口27017
// mongoose.disconnect() 关闭

// 注册schema
var Schema = mongoose.Schema
var Tasks = new Schema({
  	project: String,
  	description: String
})
mongoose.model('Task', Tasks)

// 添加任务(插入)
var Task = mongoose.model('Task');
var task = new Task();
task.project = 'Bikeshed';
task.description = 'Paint the bikeshed red.';
task.save(function(err) {
  	if (err) throw err;
  	console.log('Task saved.');
})

// 查找
Task.find({'project' : 'Bikeshed'}, function(err, tasks) {
	for (let i = 0;i < tasks.length; i++) {
		console.log('ID:' + tasks[i]._id)
    	console.log(tasks[i].description)
	}
})

// 更新
Task.update(
	{_id: '7bf50djh3iou4b57g8000001'},　　//用内部ID更新
	{description: 'Paint the bikeshed green.'},
	{multi: false},  //只更新一个文档
	function(err, rows_updated) {
		if (err) throw err
		console.log('Updated.')
	}
)

// 删除
Task.findById('7bf50djh3iou4b57g8000001', function(err, task) { // task是找到的这条记录
   	task.remove()
})
