import io from 'socket.io-client'
import { eventBusManager } from '../core/event-bus-manager'

// ====== Constant ====== //
import { SOCKET_HOST } from '../constant'

export default class Websocket {
  static socket = null
  static role = ''

  static init(role) {
    this.role = role

    this.socket = io.connect(role == 'teacher' ?
      `${SOCKET_HOST}/teacher` : `${SOCKET_HOST}/student`)

    this.socket.on('connect', () => {
      console.log("连接成功")
    })
    //学生收到消息
    this.socket.on('message', (message) => {
      this.handleReceiveMessage(message)
    })
    this.socket.on('disconnect', reason => {
      console.log(`连接断开，原因：${reason}`)
    })
  }

  static send(data) {
    !this.socket && this.init(this.role)
    this.socket.send(JSON.stringify(data))
  }

  static handleReceiveMessage(message) {
    const data = JSON.parse(message)
    data.type && eventBusManager.dispatch(data.type, data.data)
  }

}
