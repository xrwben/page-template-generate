// svg player plugin
import { loadScript } from '../../shared/utils/loadScript.js'

// singleton
class SvgPlayerPlugin {
    constructor () {
        this.el = null

        this.currIns = null

        this.aniPool = {
            // key: path
            // val: bodyMovin Instance
        }

        this.loaded = false

        this.initStyle()
        this.initView()

        loadScript('//static.guojiang.tv/pc/v3/js/component/bodymovin.js').then(done => {
            this.loaded = true
        })
    }

    initStyle () {
        var style = document.createElement('style')
        style.innerText = `
            .svg-layer {
                position: fixed;
                z-index: 10;
                top: 0px;
                left: 0px;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.6);
            }

            .svg-container {
                width: 100%;
                max-width: 760px;
                height: 100%;
                margin: 0 auto;
                overflow: hidden;
                position: relative;
            }
        `.replace(/\n|\t|(\s\s)/g, '')

        document.head.appendChild(style)
    }

    initView () {
        var layer = document.createElement('div')
        layer.className = 'svg-layer'
        layer.style.display = 'none'

        var container = document.createElement('div')
        container.className = 'svg-container'

        layer.appendChild(container)

        this.el = layer
        this.container = container

        document.body.appendChild(layer)

        layer.onclick = () => { this.stopSvg() }
    }

    goPlay (path, type) {
        if (!this.loaded) return null
        return window.bodymovin.loadAnimation({
            wrapper: this.container,
            animType: type || 'html',
            loop: true,
            autoplay: false,
            path: path
        })
    }

    playSvg (path) {
        if (!this.aniPool[path]) {
            this.aniPool[path] = this.goPlay(path)
        }
        if (!this.aniPool[path]) return

        this.aniPool[path].play()
        this.currIns = this.aniPool[path]
        this.el.style.display = 'block'
    }

    stopSvg () {
        this.el.style.display = 'none'

        if (!this.currIns) return

        this.currIns.stop()
        this.currIns = null
    }
}

const instance = new SvgPlayerPlugin()

export default {
    play (path) {
        if (!instance) return

        return instance.playSvg(path)
    }
}
