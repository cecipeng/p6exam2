import React from 'react'
import axios from 'axios'
import Websocket from '../../websocket/websocket'

// ====== Constant ====== //
import { ROLE, HOST } from '../../constant'

// ====== Components ====== //
import Tool from '../tool'
import CanvasBoard from '../canvasBoard'
import Modal from '../modal'

import './style.scss'

export default class Blackboard extends React.Component {
	canvasboardRef = null

	constructor(props) {
		super(props)
		this.state = {
			members: [], // 成员列表
			canBrush: true, // 可绘制
			canClear: false, // 可擦除
			showMembersListModal: false // 在线成员列表弹窗
		}
		Websocket.init(props.role)
	}

	/**
   * 打开在线成员列表弹窗
   */
	openMemberListModal = () => {
		axios.get(`${HOST}/students`).then((res) => {
			this.setState({
				members: res.data,
				showMembersListModal: true
			})
		})
	}

	/**
   * 关闭在线成员列表弹窗
   */
	closeMemberListModal = () => {
		this.setState({
			showMembersListModal: false
		})
	}

	changeTool = (tooName) => {
		this.setState({
			canBrush: tooName === 'brush',
			canClear: tooName === 'clear'
		})
	}

	render() {
		const { role } = this.props
		const { canBrush, canClear, members, showMembersListModal } = this.state
		return (
			<div className="blackboard">
				{role === ROLE.TEACHER && (
					<Tool handleMemberList={this.openMemberListModal} handleChangeTool={this.changeTool} />
				)}

				<CanvasBoard
					onRef={(ref) => {
						this.canvasboardRef = ref
					}}
					role={role}
					canBrush={canBrush}
					canClear={canClear}
				/>
				{showMembersListModal && <Modal members={members} closeMemberListModal={this.closeMemberListModal} />}
			</div>
		)
	}
}
