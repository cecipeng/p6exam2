import React from 'react'

import './style.scss'

export default class Tool extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeTool: 'brush' // 当前使用工具，可选值“brush”，“clear”
    }
  }

  /**
   * 切换工具
   */
  handleChangeTool = (toolName) => {
    const { handleChangeTool } = this.props
    this.setState({
      activeTool: toolName
    })
    handleChangeTool(toolName)
  }

  render() {
    const { activeTool } = this.state
    const { handleMemberList } = this.props
    return (
      <div className="blackboard-tool">
        <div className="blackboard-tool__side">
          <button onClick={handleMemberList} className="blackboard-tool__btn">点击查看当前在线成员</button>
        </div>
        <div className="blackboard-tool__body">
          <span className={`blackboard-tool__tool blackboard-tool__tool--brush ${activeTool === 'brush' ? 'is-active' : ''}`} onClick={() => { this.handleChangeTool('brush') }} />
          <span className={`blackboard-tool__tool blackboard-tool__tool--clear ${activeTool === 'clear' ? 'is-active' : ''}`} onClick={() => { this.handleChangeTool('clear') }} />
        </div>
      </div>
    )
  }
}
