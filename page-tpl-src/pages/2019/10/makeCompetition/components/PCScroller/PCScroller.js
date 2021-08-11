import { Component, createRef } from 'react'
import './PCScroller.less'

export default class PCScroller extends Component {
    constructor (props) {
        super(props)

        this.draging = false
        this.dragSY = 0
        this.boxSize = {}
        this.isFF = false

        this.refsWrapper = createRef()
        this.refsSsThumb = createRef()
        this.refsSs = createRef()
    }

    componentDidMount () {
        this.init()

        document.body.addEventListener('mouseup', () => {
            this.draging = false
        })

        document.body.addEventListener('mouseleave', () => {
            this.draging = false
        })
    }

    _resetBox () {
        this.boxSize = {
            height: this.refsWrapper.current.scrollHeight,
            clientHeight: this.refsWrapper.current.clientHeight,
            h: this.refsWrapper.current.scrollHeight - this.refsWrapper.current.clientHeight,
            top: 0,
            ssTop: 0,
            ssHeight: 60 // 默认滚动条高度
        }
    }

    /**
     * @private
     * @method init
     * @desc 初始化
     */
    init () {
        this._resetBox()

        this.isFF = typeof this.refsWrapper.current.onmousewheel === 'undefined' // firefox unsupport event 'onmousewheel'

        this._reset()
        this._refresh()

        this._addMWEvent(this.refsWrapper.current, this._scroll)
        this._addDragEvent(this.refsSsThumb.current)
    }

    /**
     * @private
     * @method _reset
     * @desc 默认滚动条样式置空
     */
    _reset () {
        this.refsWrapper.current.style.overflow = 'hidden'
        this.refsWrapper.current.style.position = 'relative'
    }

    _refreshH () {
        this.boxSize.height = this.refsWrapper.current.scrollHeight
        this.boxSize.clientHeight = this.refsWrapper.current.clientHeight
    }

    /**
     * @private
     * @method _scroll
     * @param {event} evt
     * @desc onmousewheel 事件处理: node滚动位置scrollTop滚动
     * @return {void}
     */
    _scroll (evt) {
        // this.boxSize.top -= evt.wheelDeltaY
        this._refreshH()
        let delta = -1
        if (this.isFF) {
            if (evt.detail > 0) {
                delta = 1
            }
        } else {
            if (evt.wheelDelta < 0) {
                delta = 1
            }
        }
        this.boxSize.top += 40 * delta

        if (this.boxSize.top <= 0) {
            this.boxSize.top = 0
        } else if (this.boxSize.top >= this.boxSize.h) {
            this.boxSize.top = this.boxSize.h
        } else {
            evt.preventDefault()
            evt.stopPropagation()
            evt.cancelBubble = true
        }

        this.boxSize.ssTop = (this.boxSize.top / this.boxSize.h) * (this.refsSs.current.clientHeight - this.boxSize.ssHeight)

        this._refresh()

        return false
    }

    /**
     * @private
     * @param {event} evt
     * @desc 拖拽滚动滑块处理方法
     */
    _dragScroller (evt) {
        if (!this.draging) return

        const deltaY = evt.pageY - this.dragSY // 滚动差值
        this.dragSY = evt.pageY

        this.boxSize.ssTop += deltaY

        if (this.boxSize.ssTop <= 0) {
            this.boxSize.ssTop = 0
        }

        const maxH = this.refsSs.current.clientHeight - this.boxSize.ssHeight
        if (this.boxSize.ssTop >= maxH) {
            this.boxSize.ssTop = maxH
        }

        // 计算百分比
        this.boxSize.top = (this.boxSize.ssTop / (this.refsSs.current.clientHeight - this.boxSize.ssHeight)) * this.boxSize.h

        this._refresh()
    }

    /**
     * @private
     * @method _refresh
     * @desc 滚动条位置刷新
     */
    _refresh () {
        if (this.boxSize.clientHeight >= this.boxSize.height) {
            this.refsSsThumb.current.style.display = 'none'
            return
        } else {
            this.refsSsThumb.current.style.display = 'block'
        }
        this.refsWrapper.current.scrollTop = this.boxSize.top
        this.refsSs.current.style.top = this.boxSize.top + 'px'
        this.refsSsThumb.current.style.top = this.boxSize.ssTop + 'px'

        document.querySelector('.rule-i').innerHTML += '' // chromium 70.0.3538.25 设置scrollTop页面丢失部分样式 手动触发repaint
    }

    /**
     * @private
     * @method_addMWEvent
     * @param {Node} element
     * @param {func} func
     * @desc 监听鼠标滚动
     */
    _addMWEvent (element, func) {
        const self = this
        if (!this.isFF) {
            element.onmousewheel = function (evt) {
                func.call(self, evt)
            }
        }

        if (this.isFF) {
            element.addEventListener('DOMMouseScroll', function (evt) {
                func.call(self, evt)
            }, false)
        }
    }

    /**
     * @private
     * @method _addDragEvent
     * @param {Node} element
     * @desc 监听滚动滑块拖动
     */
    _addDragEvent (element) {
        element.addEventListener('mousedown', (evt) => {
            this.draging = true
            this.dragSY = evt.pageY
        })
        element.addEventListener('mouseup', () => {
            this.draging = false
        })

        element.addEventListener('mousemove', this._dragScroller.bind(this))
        document.body.addEventListener('mousemove', this._dragScroller.bind(this))
    }

    /**
     * @public
     * @method refreshDOM
     * @desc 当内部元素发生变化时，应调用此方法刷新滚动位置
     */
    refreshDOM () {
        this.draging = false
        this._refreshH()

        this.boxSize.h = this.refsWrapper.current.scrollHeight - this.refsWrapper.current.clientHeight || 1

        this.boxSize.ssTop = (this.boxSize.top / this.boxSize.h) * (this.refsSs.current.clientHeight - this.boxSize.ssHeight)

        this._refresh()
    }

    render () {
        return (
            <div
                ref={ this.refsWrapper }
                className="scroller" >
                { this.props.children }
                <div
                    ref={ this.refsSs }
                    className="scroller-container"
                    style={
                        {
                            right: this.props.right + 'px',
                            width: this.props.width + 'px'
                        }
                    } >
                    <div
                        ref={ this.refsSsThumb }
                        className="scroller-thumb"
                        style={
                            {
                                display: 'block',
                                top: '0px',
                                backgroundColor: this.props.thumbColor
                            }
                        }
                    />
                </div>
            </div>
        )
    }
}

PCScroller.defaultProps = {
    width: 8,
    right: 0,
    thumbColor: '#fff'
}
