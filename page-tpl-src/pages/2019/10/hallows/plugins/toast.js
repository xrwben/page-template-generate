// toast plugin

// singleton
class ToastPlugin {
    constructor () {
        this.el = null
        this.elMsg = null

        this.duration = 3000

        this.initView()
    }

    initView () {
        var loading = document.createElement('div')
        loading.className = 'toast-container'
        loading.style.display = 'none'

        var msg = document.createElement('div')
        msg.className = 'toast-msg'

        loading.appendChild(msg)

        this.el = loading
        this.elMsg = msg

        document.body.appendChild(loading)
    }

    show (msg, duration) {
        if (this.timer) clearTimeout(this.timer)

        this.el.style.display = 'block'
        this.elMsg.innerText = msg

        this.timer = setTimeout(() => {
            this.el.style.display = 'none'
            this.msg = ''
        }, duration || this.duration)
    }

    hide () {
        clearTimeout(this.timer)
        this.el.style.display = 'none'
        this.msg = ''
    }
}

export default {
    _toast: null,
    show (msg, duration) {
        if (!this._toast) {
            this._toast = new ToastPlugin()
        }

        return this._toast.show(msg, duration)
    },
    hide () {
        if (!this._toast) {
            return
        }

        return this._toast.hide()
    }
}