var port = 3000
const express = require('express')
const axios = require('axios')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)

const JSON_SERVER_URL = 'http://localhost:8888'
const Role = {
	TEACHER: 'teacher',
	STUDENT: 'student'
}

//学生列表
//{"whsmHZFMafQE2lMgAAAB": {role: "0|1", id: "whsmHZFMafQE2lMgAAAB", name: "学生"}}
var userListMap = {}
var userIndex = 0
const createUser = (sid, role) => {
	userIndex++
	return {
		id: userIndex,
		sid: sid,
		role: role,
		name: "学生" + userIndex
	}
}

const studentIo = io.of('/student').on('connection', (socket) => {
	//会话唯一标识，区分用户
	var socketID = socket.id
	//学生上线
	const user = createUser(socketID, Role.STUDENT)
	userListMap[socketID] = user
	console.log(`学生（${socketID}）连接`)
	//添加学生（json-server）
	axios.post(JSON_SERVER_URL + '/students', user)
		.then((res) => {
			console.log(`学生（${socketID}）新增成功`)
		})
		.catch((error) => {
			console.log(`学生（${socketID}）新增失败，原因：${error}`)
		})
	//发送信息给学生socket
	//socket.emit('connectSuccess', user)
	//发送消息列表给学生socket
	// if(messageList.length != 0) {
	//   socket.emit('updateMessageList', messageList)
	// }
	//广播用户列表通知老师socket
	//teacherIo.emit("updateUserList", Object.values(userListMap))

	//学生下线，客户端异常断开，比如用户直接关掉浏览器
	socket.on('disconnect', (reason) => {
		console.log(`学生（${socketID}）下线，原因：${reason}`)
		if (userListMap.hasOwnProperty(socketID)) {
			//socket.broadcast.emit('userLeave', userListMap[socketID])
			const user = userListMap[socketID]
			delete userListMap[socketID]
			//删除学生（json-server）
			axios.delete(JSON_SERVER_URL + '/students/' + user.id)
				.then((res) => {
					console.log(`学生（${socketID}）删除成功`)
				})
				.catch(function (error) {
					console.log(`学生（${socketID}）删除失败，原因：${error}`)
				})
			//广播用户列表通知老师socket
			//teacherIo.emit("updateUserList", Object.values(userListMap))
		}
	})
})

const teacherIo = io.of('/teacher').on('connection', (socket) => {
	//会话唯一标识，区分用户
	var socketID = socket.id
	//老师上线
	console.log(`老师（${socketID}）连接`)
	//用户列表，老师登录直接调用json-server查询接口
	//socket.emit("updateUserList", Object.values(userListMap))
	//消息列表
	//if(messageList.length != 0) {
	//  socket.emit('updateMessageList', messageList)
	//}

	//接受消息，并转发给学生
	socket.on('message', (message) => {
		if (message) {
			console.log(`接收到老师（${socketID}）发送的消息`)
			studentIo.emit('message', message)
		}
	})
})

server.listen(port, function (err) {
	//删除JSON-SERVER学生数据
	axios.get(JSON_SERVER_URL + '/students').then(res => {
		res.data.forEach(item => {
			axios.delete(JSON_SERVER_URL + '/students/' + item.id)
		})
	})
	console.log('Listening port:' + port)
})