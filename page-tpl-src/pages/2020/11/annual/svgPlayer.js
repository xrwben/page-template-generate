// svg player plugin
import { loadScript } from '../shared/utils/loadScript.js'

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

        this.hooks = null

        this.banner = null

        loadScript('//static.guojiang.tv/pc/v3/js/component/bodymovin.js').then(done => {
            this.loaded = true

            this.hooks && this.hooks()
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

    goPlay (path, type, el, loop) {
        if (!this.loaded) return null
        return window.bodymovin.loadAnimation({
            wrapper: el || this.container,
            animType: type || 'html',
            loop: typeof loop === 'undefined' ? true : loop,
            autoplay: false,
            path: path
        })
    }

    playSvg (path) {
        // * ins ?????? ???????????? ??????????????????????????? -> ??????
        // if (!this.aniPool[path]) {
        //     this.aniPool[path] = this.goPlay(path, null)
        // }
        // if (!this.aniPool[path]) return

        this.aniPool[path] = this.goPlay(path, null)
        this.aniPool[path].play()
        this.currIns = this.aniPool[path]
        this.el.style.display = 'block'
    }

    waitImgs (imgs) {
        return new Promise((resolve, reject) => {
            let flag = 1
            const waiter = () => {
                if (flag >= imgs.length - 1) {
                    resolve()
                    flag = null
                } else {
                    flag += 1
                }
            }

            imgs.forEach(item => {
                if (item.complete) { // ????????????
                    flag += 1
                } else {
                    item.onload = item.onerror = item.onabort = waiter
                }
            })

            if (flag >= imgs.length - 1) {
                resolve()
                flag = null
            }
        })
    }

    playSvgBanner (entry, float, el, el2) {
        if (this.banner) throw new Error('[plugin: svgPlayer] One Page One BannerAni')

        let aniType = 'svg' /* banner opening svg: ??????ios??????????????? ????????????????????? */
        if (!!window.ActiveXObject || 'ActiveXObject' in window) { /* ie - ????????? svg ?????? */
            aniType = 'html'
        }

        this.banner = this.goPlay(entry, aniType, el, false)

        // -> ping ??????????????????????????? ??????
        this.banner.addEventListener('DOMLoaded', () => {
            let imgs = el.querySelectorAll('img')
            imgs = [].slice.call(imgs)
            this.waitImgs(imgs).then(() => {
                this.banner.play()
            })
        })

        const $banner = this.goPlay(float, null, el2, true)

        // -> ?????????float??????
        this.banner.addEventListener('complete', () => {
            el2.style.opacity = 1

            $banner.play()

            el.style.display = 'none'
            this.banner.stop()
            this.banner.destroy()
            this.banner = null
        })
    }

    /* ???????????? 1. ??????????????????????????? 2. ???????????????????????????????????????????????? (loading?) */
    playBanner (entry, float, el, el2) {
        if (this.loaded) {
            this.playSvgBanner(entry, float, el, el2)
            return
        }
        this.hooks = () => {
            this.playSvgBanner(entry, float, el, el2)
        }
    }

    stopSvg () {
        this.el.style.display = 'none'

        if (!this.currIns) return

        this.currIns.stop()
        this.currIns.destroy()
        this.currIns = null
    }
}

const instance = new SvgPlayerPlugin()

export default {
    play (path) {
        if (!instance) return

        return instance.playSvg(path)
    },
    playBanner (entry, float, el, el2) {
        if (!instance) return

        return instance.playBanner(entry, float, el, el2)
    }
}
