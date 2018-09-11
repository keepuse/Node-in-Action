var socketio = require('socket.io') 
var io
var guestNumber = 1
var nickNames = {}
var namesUsed = []
var currentRoom = {}

exports.listen = function(server) {
	io = socketio.listen(server) //启动Socket.IO服务器，允许它搭载在已有的HTTP服务器上
	io.set('log level', 1)
	io.sockets.on('connection', function(socket){
		guestNumber = assignGuestName(socket, guestNumber, nickNames, namesUsed) //在用户连接上来时赋予其一个访客名
		joinRoom(socket, 'Lobby')  //在用户连接上来时把他放入聊天室Lobby里
		handleMessageBroadcasting(socket, nickNames) //处理用户的消息，更名，以及聊天室的创建和变更
		handleNameChangeAttepts(socket, nickNames, namesUsed) 
		handleRoomJoining(socket)
		socket.on('rooms', function(){ //当用户发出请求时，向其提供已经被占用的聊天室的列表
			socket.emit('rooms', io.sockets.manager.rooms)
		})
		handleClientDisconnection(socket, nickNames, namesUsed) //定义用户断开连接后的清除逻辑
	}) 
}
// 分配用户昵称
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
	let name = 'Guest' + guestNumber
	nickNames[socket.id] = name
	socket.emit('nameResult', {
		success: true,
		name: name,
	})
	namesUsed.push(name)
	return guestNumber + 1
}

// 进入聊天室
function joinRoom(socket, room) {
	socket.join(room)
	currentRoom[socket.id] = room  // 记录用户的当前房间
	socket.emit('joinResult', {room: room})
	socket.broadcast.to(room).emit('message', { // 让房间里的其他用户知道有新用户进入了房间
		text: nickNames[socket.id] + ' has joined ' + room + '.'
	})
	let userInRoom = io.sockets.clients(room) // 确定有哪些用户在这个房间里
	if (userInRoom.length > 1) {
		let usersInRoomSummary = 'Users currently in ' + room + ":"
		for (let index in userInRoom) {
			let userSocketId = userInRoom[index].id
			if (userSocketId !== socket.id) {
				usersInRoomSummary += index > 0 ? ', ' : nickNames[userSocketId] 
			}
		}
		usersInRoomSummary += '.'
		socket.emit('message', {text: usersInRoomSummary}) // 将房间里其他用户的汇总发送给这个用户
	}
}

// 处理昵称变更请求
function handleNameChangeAttepts(socket, nickNames, namesUsed) {
	socket.on('nameAttempt', function(name) {
		if (name.indexOf('Guest') === 0) {
			socket.emit('nameResult', {
				success: false,
				message: 'Names cannot begin with "Guest".',
			})
		} else {
			if (namesUsed.indexOf(name) === -1) { // 如果昵称还没注册就注册上
				let previousName = nickNames[socket.id]
				let previousNameIndex = namesUsed.indexOf(previousName)
				namesUsed.push(name)
				nickNames[socket.id] = name
				delete namesUsed[previousNameIndex]
				socket.emit('nameResult',{
					success: true,
					name: name,
				})
				socket.broadcast.to(currentRoom[socket.id]).emit('message', {
					text: previousName + ' is now known as ' + name + '.'
				})
			} else {
				socket.emit('nameResult', {
					success: false,
					message: 'That name is already in use.'
				})
			}
		}
	})
}

// 发送聊天消息
function handleMessageBroadcasting(socket) {
    socket.on('message', function(message) {
        socket.broadcast.to(message.room).emit('message', {
            text: nickNames[socket.id] + ': ' + message.text
        })
    })
}

// 创建房间
function handleRoomJoining(socket) {
	socket.on('join', function(room) {
		socket.leave(currentRoom[socket.id])
		joinRoom(socket, room.newRoom)
	})
}

// 用户断开连接
function handleClientDisconnection(socket) {
    socket.on('disconnect', function() {
        let nameIndex = namesUsed.indexOf(nickNames[socket.id])
        delete namesUsed[nameIndex]
        delete nickNames[socket.id]
    })
}