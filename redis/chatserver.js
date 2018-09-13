var net = require('net')
var redis = require('redis')

const server = net.createServer(function(socket) {
	let subscriber = redis.createClient(6379, '127.0.0.1')
	let publisher = redis.createClient(6379, '127.0.0.1')
	
	socket.on('connect', function() {
		console.log('connect')
		// subscriber = redis.createClient(6379, '127.0.0.1')  // 订阅客户端
		subscriber.subscribe('main_chat_room')   // 订阅频道
		subscriber.on('message', function(channel, message) {
			socket.write('Channel ' + channel + ':' + message) // 接收到消息时，通过socket发送给用户
		})

		// publisher = redis.createClient(6379, '127.0.0.1') // 发布客户端
	})

	socket.on('data', function(data) {
		publisher.publish('main_chat_room', data) // 发布消息
	})

	socket.on('end', function() { // 用户断开连接， redis也断开连接
		subscriber.unsubscribe('main_chat_room')
		subscriber.end()
		publisher.end()
	})
})

server.listen(3000, '127.0.0.1')