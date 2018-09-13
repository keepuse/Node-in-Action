var mongodb = require('mongodb')
var server = new mongodb.Server('127.0.0.1', 27017, {})

var client = new mongodb.Db('mydatabase', server, {
	w: 1,
})

client.open(function (err) {
	if (err) throw err
	client.collection('test_insert', function (err, collection) {
		if (err) throw err
		console.log('We are now able to perform queries.') // 把MongoDB操作放在这后面
		// 插入一条新数据
		collection.insert( 
			{
			  	"title": "I like cake",
			  	"body": "It is quite good."
			},
			{safe: true},  // 安全模式表明数据库操作应该在回调执行之前完成
			function(err, documents) {
			  	if (err) throw err
			  	console.log('Document ID is: ' + documents[0]._id)
		})

		// t通过id进行更新
		let _id = new client.bson_serializer.ObjectID('7bf50djh3iou4b57g8000001');
		collection.update(
        	{_id: _id},
          	{$set: {"title": "I ate too much cake"}},
          	{safe: true},
          	function(err) {
            	if (err) throw err
          	}
		)
			
		// 查找
		collection.find({"title": "I like cake"}).toArray(
			function(err, results) {
				if (err) throw err
		        console.log(results)
		})

		// 删除
		let _id = new client.bson_serializer.ObjectID('7bf50djh3iou4b57g8000001');
		collection.remove({_id: _id}, {safe: true}, function(err) {
			if (err) throw err
		})
	})
})

// client.close() 关闭数据库