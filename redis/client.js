var redis = require('redis')
var client = redis.createClient(6379, '127.0.0.1')
client.on('error', function(err) {
	console.log('error: ' + err)
})

client.set('color', 'red', redis.print)　//函数输出操作的结果，或在出错时输出错误
client.get('color', function(err, value) {
  if (err) throw err
  console.log('Got: ' + value)
})

 // hash表
client.hmset('camping', {  
	'shelter': '2-person tent',
	'cooking':'level two',
}, redis.print)

client.hget('camping', 'cooking', function(err, value) {
	if (err) throw err
	console.log('cooking: ' + value)
})

client.hkeys('camping', function(err, keys) {
	if(err) throw err
	keys.forEach(function(key, i){
		console.log('  ' + key)
	})
})

// 链表
client.lpush('tasks', 'Paint the bikeshed red.', redis.print)
client.lpush('tasks', 'Paint the bikeshed green.', redis.print)
client.lrange('tasks', 0, -1, function(err, items) {
  	if (err) throw err
  	items.forEach(function(item, i) {
   		console.log('  ' + item)
  	})
})

// 集合
client.sadd('ip_addresses', '204.10.37.96', redis.print)
client.sadd('ip_addresses', '204.10.37.96', redis.print)
client.sadd('ip_addresses', '72.32.231.8', redis.print)
client.smembers('ip_addresses', function(err, members) {
  	if (err) throw err
  	console.log(members)
})