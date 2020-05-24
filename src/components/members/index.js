import React from 'react'

import './style.scss'

export default class Members extends React.Component {
	render() {
		const { members } = this.props
		return (
			<ul className="blackboard-member__list">
				{members &&
					members.length > 0 &&
					members.map((item, index) => {
						return (
							<li key={index} className={`blackboard-member__item is-active`} data-id={item.id}>
								<img src={require('../../assets/images/defalut-head.png')} />
								<span>{item.name}</span>
							</li>
						)
					})}
				{members && members.length === 0 && <div>TIP：当前没有学生连接</div>}
			</ul>
		)
	}
}
