import React from 'react'
import websocket from '../../websocket/websocket'
import { eventBusManager } from '../../core/event-bus-manager'

// ====== Constant ====== //
import { ROLE, CLEAR_RADUIS } from '../../constant'

import './style.scss'

export default class CanvasBoard extends React.Component {
	tracks = [] // 画笔轨迹
	canvasContainerRef = React.createRef()
	canvasRef = React.createRef()

	constructor(props) {
		super(props)
		this.state = {
			width: 0,
			height: 0
		}
	}

	componentDidMount() {
    const { role, onRef } = this.props
		if (role === ROLE.TEACHER) {
			this.handleDraw()
		} else {
			eventBusManager.add('PAINTING_BRUSH_DREW', this.handleReceivedDraw)
		}
		setTimeout(() => {
			onRef(this)
			const rect = this.canvasContainerRef.current.getBoundingClientRect()
			this.setState({
				width: rect.width,
				height: rect.height
			})
		}, 1000)
	}

	handleDrawClear = (point) => {
		const canvas = this.canvasRef.current
		const ctx = canvas.getContext('2d')
		const eraserRadius = CLEAR_RADUIS
		ctx.save()

		ctx.lineWidth = 2
		ctx.strokeStyle = '#000000'
		ctx.beginPath()
		ctx.arc(point.x, point.y, eraserRadius - 1, 0, Math.PI * 2, false)
		ctx.clip()
		ctx.stroke()
		ctx.restore()
	}

	handleDraw = () => {
		const canvas = this.canvasRef.current
		const context = canvas.getContext('2d')

		let track = []
		let originX = 0
		let originY = 0
		let beginDraw = false
		let _position = { x: 0, y: 0 }
		let canvasLeft = 0
		let canvasTop = 0

		const handleMouseDown = (e) => {
			e.preventDefault()
			if (!this.props.canBrush && !this.props.canClear) {
				return
			}
			const canvasRect = canvas.getBoundingClientRect()
			canvasLeft = canvasRect.left
			canvasTop = canvasRect.top
			const clientX = e.clientX || e.touches[0].clientX
			const clientY = e.clientY || e.touches[0].clientY
			originX = clientX - canvasLeft
			originY = clientY - canvasTop

			beginDraw = true
			_position = { x: Math.round(originX), y: Math.round(originY) }

			this.props.canClear && this.handleDrawClear(_position)
			track.push({ x: _position.x, y: _position.y })
		}
		const handleMouseMove = (e) => {
			e.preventDefault()
			const clientX = e.clientX || e.touches[0].clientX
			const clientY = e.clientY || e.touches[0].clientY
			originX = clientX - canvasLeft
			originY = clientY - canvasTop
			let curPos = { x: Math.round(originX), y: Math.round(originY) }

			const draw = () => {
				context.beginPath()
				context.moveTo(_position.x, _position.y)
				context.lineTo(curPos.x, curPos.y)

				track.push({ x: curPos.x, y: curPos.y })
				context.lineWidth = 5
				context.strokeStyle = '#000000'
				context.lineCap = 'round'
				context.stroke()
			}
			const clearDraw = () => {
				const radius = CLEAR_RADUIS
				context.save()
				context.beginPath()
				context.arc(_position.x, _position.y, radius, 0, Math.PI * 2, false)
				context.clip()
				context.clearRect(0, 0, this.state.width, this.state.height)
				context.restore()
			}
			if (beginDraw) {
				if (this.props.canBrush) {
					draw()
				} else if (this.props.canClear) {
					clearDraw()
					this.handleDrawClear(curPos)
				}
				_position = curPos
			}
		}
		const handleMouseUp = () => {
			const clearDraw = () => {
				const radius = CLEAR_RADUIS
				context.save()
				context.beginPath()
				context.arc(_position.x, _position.y, radius, 0, Math.PI * 2, false)
				context.clip()
				context.clearRect(0, 0, this.state.width, this.state.height)
				context.restore()
			}
			this.props.canClear && clearDraw()

			this.tracks.push(track)
			beginDraw = false
			canvas.onmousemove = null
			const { width, height } = this.state
			const param = {
				type: 'PAINTING_BRUSH_DREW',
				data: {
					tracks: canvas.toDataURL('image/png'),
					width,
					height
				}
			}
			websocket.send(param)
			track = []
		}
		canvas.addEventListener('mousedown', handleMouseDown)
		canvas.addEventListener('mousemove', handleMouseMove)
		canvas.addEventListener('mouseup', handleMouseUp)
	}

	handleReDraw = (tracks) => {
		const canvas = this.canvasRef.current ? this.canvasRef.current : document.querySelector('._canvas canvas')
		const { width, height } = this.state
		canvas.height = height
		canvas.width = width
		const context = canvas.getContext('2d')

		const image = new Image()
		image.src = tracks
		image.onload = function() {
			context.drawImage(image, 0, 0, width, height)
		}
	}

	handleReceivedDraw = (data) => {
		this.handleReDraw(data.tracks)
	}

	render() {
		const { width, height } = this.state
		return (
			<div className="blackboard__canvasboard _canvas" ref={this.canvasContainerRef}>
				<canvas width={width} height={height} ref={this.canvasRef} />
			</div>
		)
	}
}
