<template>
    <div
        v-show="state"
        class="svg-layer"
        @click="stopSvg"
    >
        <div class="svg-container" />
    </div>
</template>

<script>
/**
 * svg-player 动效播放
 */
import { loadScript } from '../utils/loadScript.js'

const aniPool = {
    // key: path
    // val: bodyMovin Instance
}
let currIns = null

export default {
    name: 'SvgPlayer',
    data () {
        return {
            loaded: false,
            state: false,
            audioIns: null
        }
    },
    mounted () {
        loadScript('//static.guojiang.tv/pc/v3/js/component/bodymovin.js').then(done => {
            this.loaded = true
        })
        // this.audioIns = new Audio('//static.guojiang.tv/vmaker/zj2020/audio.mp3')
    },
    methods: {
        goPlay (path, type) {
            if (!this.loaded) return null
            var svgContainer = document.querySelector('.svg-container')
            return window.bodymovin.loadAnimation({
                wrapper: svgContainer,
                animType: type || 'html',
                loop: true,
                autoplay: false,
                path: path
            })
        },
        playSvg (path, type) {
            if (!aniPool[path]) {
                aniPool[path] = this.goPlay(path, type)
            }
            if (!aniPool[path]) return

            // aniPool[path].addEventListener('data_ready', () => { console.log('animation data has loaded') })

            aniPool[path].play()
            currIns = aniPool[path]
            this.state = true
            // this.audioIns.loop = true
            // this.audioIns.play()
        },
        stopSvg () {
            this.state = false
            // this.audioIns.pause()
            // this.audioIns.currentTime = 0
            if (currIns) {
                currIns.stop()
                currIns = null
            }
        }
    }
}
</script>

<style lang="less">
// 其它样式请在 活动页 中指定
.svg-layer {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0px;
    left: 0px;
    z-index: 10;
    .svg-container {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        overflow: hidden;
        position: relative;
        & > svg {
            position: absolute;
        }
    }
}
</style>
