<template>
    <div class="scroll-wrapper" :class="[plateType==='pc'?'pc-scroll':'mobile-scroll']" ref="scroll-wrapper">
        <!-- pc -->
        <template v-if="plateType==='pc'">
            <div class="scroll-content" ref="scroll-content">
                <slot></slot>
            </div>
            <div class="scroll-bar" ref="scroll-bar">
                <div class="scroll-thumb" ref="scroll-thumb" :style="thumbStyle"></div>
            </div>
        </template>
        <!-- mobile -->
        <template v-else>
            <slot></slot>
        </template>
    </div>
</template>

<script>
export default {
    name: 'ScrollBar',
    props: {
        width: {
            type: Number,
            default: 10
        },
        thumbColor: {
            type: String,
            default: 'rgba(0, 0, 0, 0.5)'
        },
        toTop: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            scrollNode: {
                scrollWrapper: null,
                scrollContent: null,
                scrollBar: null,
                scrollThumb: null
            },
            candrag: false,
            thumbTop: 0,
            contentTop: 0,
            observer: null
        }
    },
    computed: {
        thumbStyle () {
            return {
                width: `${this.width}px`,
                background: this.thumbColor
            }
        },
        plateType () {
            return /Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(window.navigator.userAgent) ? 'mobile' : 'pc'
        }
    },
    mounted () {
        this.getRefNodes()
        console.log('初始化>>>>', this.plateType, typeof this.toTop)
        this.init()
    },
    beforeDestroy () {
        this.observer && this.observer.disconnect()
    },
    methods: {
        getRefNodes () {
            this.scrollNode.scrollWrapper = this.$refs['scroll-wrapper']
            this.scrollNode.scrollContent = this.$refs['scroll-content']
            this.scrollNode.scrollBar = this.$refs['scroll-bar']
            this.scrollNode.scrollThumb = this.$refs['scroll-thumb']
        },
        init () {
            this.$nextTick(() => {
                this.mutationObserver()

                this.resizeScrollBar()

                if (this.plateType === 'mobile') {
                    return
                }

                this.dragScroll(this.scrollNode.scrollThumb)

                this.scrollNode.scrollWrapper.addEventListener('mousewheel', this.mousewheelScroll, false)
                this.scrollNode.scrollWrapper.addEventListener('DOMMouseScroll', this.mousewheelScroll, false)
            })
        },
        mutationObserver () {
            const target = this.plateType === 'pc' ? this.scrollNode.scrollContent : this.scrollNode.scrollWrapper
            // debugger

            const observer = new MutationObserver((mutations, observer) => {
                this.resizeScrollBar()

                // console.log('observer>>>', this.toTop, mutations)

                if (this.toTop) {
                    this.resizeContentTop()
                }
            })
            observer.observe(target, {
                childList: true,
                subtree: true
                // attributes: true
                // attributeFilter: ['style']
            })
        },
        // 拖动滚动条
        dragScroll (element) {
            element.onmousedown = (e) => {
                // 防止选中 什么也不做
                if (e.preventDefault) {
                    e.preventDefault()
                } else {
                    e.returnValue = false
                }
                this.candrag = true
                // console.log(e.clientY, e.pageY)
                const _gapTop = e.pageY - element.offsetTop
                // console.log(_gapTop)
                document.onmousemove = (e) => {
                    if (!this.candrag) {
                        return
                    }
                    // console.log(e.pageY)
                    this.thumbTop = e.pageY - _gapTop
                    if (this.thumbTop <= 0) {
                        this.thumbTop = 0
                    }
                    if (this.thumbTop >= this.scrollNode.scrollBar.offsetHeight - element.offsetHeight) {
                        this.thumbTop = this.scrollNode.scrollBar.offsetHeight - element.offsetHeight
                    }
                    // console.log(this.thumbTop)
                    element.style.marginTop = `${this.thumbTop}px`
                    // 计算内容滚动
                    const scale = this.thumbTop / (this.scrollNode.scrollBar.offsetHeight - element.offsetHeight)
                    this.contentTop = -scale * (this.scrollNode.scrollContent.offsetHeight - this.scrollNode.scrollWrapper.clientHeight)
                    this.scrollNode.scrollContent.style.top = `${this.contentTop}px`
                }
                document.onmouseup = (e) => {
                    this.candrag = false
                    // console.log('鼠标松开了...', this.scrollNode.scrollContent.offsetHeight, this.contentTop)
                    document.onmousemove = null
                }
            }
        },
        // 滑动滚轮
        mousewheelScroll (e) {
            e = e || window.event
            e.preventDefault()// 阻止窗口默认的滚动事件

            if (this.scrollNode.scrollWrapper.clientHeight >= this.scrollNode.scrollContent.offsetHeight) {
                return
            }

            let delta = 0 // 判断上or下滚动

            if (e.wheelDelta) {
                delta = e.wheelDelta / 120
            } else if (e.detail) {
                delta = -e.detail / 3
            }
            // console.log('>>>', delta, this.contentTop, this.scrollNode.scrollWrapper.clientHeight, this.scrollNode.scrollContent.offsetTop)
            this.contentTop = this.contentTop + (delta * 30)
            if (this.contentTop >= 0) {
                this.contentTop = 0
            } else if (this.contentTop <= this.scrollNode.scrollWrapper.clientHeight - this.scrollNode.scrollContent.offsetHeight) {
                this.contentTop = this.scrollNode.scrollWrapper.clientHeight - this.scrollNode.scrollContent.offsetHeight
            }
            this.scrollNode.scrollContent.style.top = `${this.contentTop}px`

            // 计算滚动条距离
            const scale = this.contentTop / (this.scrollNode.scrollWrapper.clientHeight - this.scrollNode.scrollContent.offsetHeight)
            this.thumbTop = scale * (this.scrollNode.scrollBar.offsetHeight - this.scrollNode.scrollThumb.offsetHeight)
            // console.log('thumbTop>>>>', this.thumbTop)
            this.scrollNode.scrollThumb.style.marginTop = `${this.thumbTop}px`
        },
        resizeScrollBar () {
            if (this.plateType === 'mobile') {
                return
            }
            if (this.scrollNode.scrollWrapper.offsetHeight >= this.scrollNode.scrollContent.offsetHeight) {
                this.scrollNode.scrollBar.style.display = 'none'
            } else {
                this.scrollNode.scrollBar.style.display = 'block'
            }
            this.scrollNode.scrollThumb.style.height = (this.scrollNode.scrollWrapper.offsetHeight / this.scrollNode.scrollContent.offsetHeight * this.scrollNode.scrollBar.offsetHeight) + 'px'
            if (this.scrollNode.scrollThumb.offsetHeight <= 40) {
                this.scrollNode.scrollThumb.style.height = '40px'
            }
            // console.log('resize>>>>>', this.scrollNode.scrollWrapper.offsetHeight, this.scrollNode.scrollContent.offsetHeight, this.contentTop)
        },
        resizeContentTop () {
            if (this.plateType === 'pc') {
                this.contentTop = 0
                this.scrollNode.scrollThumb.style.marginTop = 0
                this.scrollNode.scrollContent.style.top = 0
            }
            if (this.plateType === 'mobile') {
                // console.log(this.scrollNode.scrollWrapper, this.scrollNode.scrollWrapper.$parent)
                this.scrollNode.scrollWrapper.scrollTop = 0
            }
        }
    }
}
</script>

<style scoped>
    .scroll-wrapper {
        width: 100%;
        height: 100%;
        /* overflow: hidden;
        position: relative; */
    }
    .pc-scroll {
        overflow: hidden;
        position: relative;
    }
    .mobile-scroll {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }
    .scroll-content {
        position: relative;
        overflow: hidden;
    }
    .scroll-bar {
        height: 100%;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.2) inset;
        border-radius: 5px;
        position: absolute;
        right: 0;
        top: 0;
        overflow: hidden;
        display: none;
    }
    .scroll-thumb {
        width: 10px;
        min-height:50px;
        border-radius: 5px;
        background-color: #F90;
        background-image: -webkit-linear-gradient(bottom left, rgba(255, 255, 255, .2) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, .2) 50%, rgba(255, 255, 255, .2) 75%, transparent 75%, transparent);
        cursor: pointer;
    }
</style>
