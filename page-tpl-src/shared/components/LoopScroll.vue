<template>
    <div class="loop-scroll-wrapper" ref="loop-scroll-wrapper">
        <div :class="['loop-scroll-container', {'horizontal': isHorizontal}]" ref="loop-scroll-container">
            <slot></slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoopScroll',
    props: {
        loopData: {
            type: Array,
            default: () => []
        },
        speed: { // 滚动速度
            type: Number,
            default: 1
        },
        mode: { // top left
            type: String,
            default: 'top'
        }
    },
    data () {
        return {
            animationIns: null
        }
    },
    computed: {
        isHorizontal () {
            return this.mode === 'left'
        }
    },
    watch: {
        loopData () {
            this.init()
        }
    },
    beforeDestroy () {
        window.cancelAnimationFrame(this.animationIns)
        this.animationIns = null
    },
    methods: {
        init () {
            console.log('debugger>>>', this.loopData, this.mode, typeof this.speed)
            this.$nextTick(() => {
                const scrollContainerBox = this.$refs['loop-scroll-container'].getBoundingClientRect()
                const scrollWrapperBox = this.$refs['loop-scroll-wrapper'].getBoundingClientRect()
                console.log('height>>>>', this.$refs['loop-scroll-wrapper'].getBoundingClientRect().height, this.$refs['loop-scroll-container'].getBoundingClientRect().height)
                console.log('width>>>>', this.$refs['loop-scroll-wrapper'].getBoundingClientRect().width, this.$refs['loop-scroll-container'].getBoundingClientRect().width)
                console.log('>>>>scrollContainerBox', this.$refs['loop-scroll-container'].offsetWidth)
                if (this.mode === 'top' && scrollContainerBox.height <= scrollWrapperBox.height) {
                    return
                }
                if (this.mode === 'left' && scrollContainerBox.width <= scrollWrapperBox.width) {
                    return
                }
                this.loopScroll()
            })
        },
        loopScroll () {
            const requestAnimationFrame = (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    return window.setTimeout(callback, 1000 / 60)
                }
            )
            const cancelAnimationFrame = (
                window.cancelAnimationFrame ||
                function (id) {
                    return window.clearTimeout(id)
                }
            )
            cancelAnimationFrame(this.animationIns)

            const scrollContainer = this.$refs['loop-scroll-container']
            scrollContainer.innerHTML += scrollContainer.innerHTML

            const scrollContainerHeight = this.$refs['loop-scroll-container'].getBoundingClientRect().height
            const scrollContainerWidth = this.$refs['loop-scroll-container'].getBoundingClientRect().width
            let sTop = scrollContainer.scrollTop
            let sLeft = scrollContainer.scrollLeft
            console.log('scrollContainer.innerHTML>>>>>', scrollContainerWidth)

            const _moveFun = () => {
                cancelAnimationFrame(this.animationIns)
                if (this.mode === 'top') {
                    sTop += this.speed
                    scrollContainer.style.transform = `translate3d(0, -${sTop}px, 0)`
                    if (sTop >= scrollContainerHeight / 2) {
                        sTop = 0
                    }
                } else if (this.mode === 'left') {
                    sLeft += this.speed
                    scrollContainer.style.transform = `translate3d(-${sLeft}px, 0, 0)`
                    if (sLeft >= scrollContainerWidth / 2) {
                        sLeft = 0
                    }
                }
                this.animationIns = requestAnimationFrame(_moveFun)
                // console.log(this.animationIns)
            }
            this.animationIns = requestAnimationFrame(_moveFun)
            // console.log('this.animationIns>>>>', this.animationIns)
        }
    }
}
</script>

<style scoped>
    .loop-scroll-wrapper {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
    }
    .loop-scroll-container {
        position: absolute;
        left: 0;
        top: 0;
    }
    .horizontal {
        height: 100%;
        display: flex;
        align-items: center;
        white-space: nowrap;
    }
</style>
