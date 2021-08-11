// loading plugin
import loadingImg from './loading.png'

// singleton
class LoadingPlugin {
    constructor () {
        this.el = null

        this.initStyle()
        this.initView()
    }

    initView () {
        var loading = document.createElement('div')
        loading.className = 'loading'
        loading.style.backgroundImage = `url(${loadingImg})`
        loading.style.display = 'none'

        this.el = loading

        document.body.appendChild(loading)
    }

    initStyle () {
        var style = document.createElement('style')
        style.innerText = `
            .loading {
                background-repeat: no-repeat;
                background-size: cover;
                width: 35px;
                height: 35px;
                position: fixed;
                z-index: 22;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                animation: loading 1.2s ease-out infinite;
            }

            @keyframes loading {
                0% {
                    transform: translate(-50%, -50%) rotate(0);
                }
                100% {
                    transform: translate(-50%, -50%) rotate(360deg);
                }
            }
        `.replace(/\n|\t|(\s\s)/g, '')

        document.head.appendChild(style)
    }

    show () {
        this.el.style.display = 'block'
    }

    hide () {
        this.el.style.display = 'none'
    }
}

export default {
    _count: 0,
    _loading: null,
    show () {
        if (!this._loading) {
            this._loading = new LoadingPlugin()
        }

        this._count++
        return this._loading.show()
    },
    hide () {
        if (!this._loading) {
            return
        }
        this._count--
        if (this._count > 0) return
        return this._loading.hide()
    }
}
