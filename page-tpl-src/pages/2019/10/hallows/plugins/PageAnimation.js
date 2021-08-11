/**
 * 页面动画 封装
 */

function ping (url) {
    return new Promise((resolve) => {
        let pingSrc = new Image()

        const endfn = () => {
            pingSrc = null
            resolve()
        }

        pingSrc.onabort = endfn
        pingSrc.onerror = endfn
        pingSrc.onload = endfn

        pingSrc.src = url
    })
}

class PageAnimation {
    constructor (el) {
        this.el = el

        const container = document.createElement('div')
        container.className = 'page-ani-container'

        this.container = container
        this.el.appendChild(this.container)

        this.basicClass = 'page-ani-el'
    }

    /* 预加载资源 */
    start (urls, cls) {
        return Promise.all(urls.map(src => ping(src))).then(() => {
            // console.log('[PageAnimation] All ReSource Loaded')

            // 1. 加载dom
            cls.forEach(cl => {
                const ele = document.createElement('div')
                ele.className = [this.basicClass, cl].join(' ').trim()

                ele.addEventListener('transitionend', this.endOfEntrance)

                setTimeout(() => {
                    ele.className += ' enter'
                }, 400)

                this.container.appendChild(ele)
            })
        })
    }

    endOfEntrance (evt) {
        const target = evt.target
        let cls = target.className.split(' ')
        cls = cls.filter(cl => cl !== 'float')
        cls.push('float')

        target.style.transition = 'none'
        target.style.webKitTransition = 'none'
        target.style.msTransition = 'none'
        target.className = cls.join(' ').trim()
    }
}

export default PageAnimation
