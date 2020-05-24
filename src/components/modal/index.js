import React from 'react'

// ====== Components ====== //
import Members from '../members'

import './style.scss'

export default class Modal extends React.Component {
	render() {
		const { members, closeMemberListModal } = this.props
		return (
			<div className="com-modal-wrap">
				<div className="com-modal">
					<div className="com-modal__header">
						<span className="com-modal__close" onClick={closeMemberListModal}>
							关闭弹窗
						</span>
						<p className="com-modal__title">在线成员列表</p>
					</div>
					<div className="com-modal__body">
						<div className="com-modal__content">
							<Members members={members} />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
