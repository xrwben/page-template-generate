<template>
    <div
        v-show="state"
        class="toast-container"
        @click="hide"
    >
        <div class="toast-msg" :style="fontSize">
            {{ msg }}
        </div>
    </div>
</template>

<script>
/**
 * Toast
 * horace 2019-7-16
 */

let timer = null
const duration = 3000

export default {
    name: 'Toast',
    props: {
        // show: {
        //     type: Boolean,
        //     required: true
        // }
    },
    data () {
        return {
            state: false,
            msg: ''
        }
    },
    computed: {
        plateType () {
            return /Android|webOS|iPhone|iPod|iPad|BlackBerry|Windows Phone|SymbianOS/i.test(window.navigator.userAgent) ? 'mobile' : 'pc'
        },
        fontSize () {
            return `font-size:${this.plateType === 'mobile' ? ' 14px' : '22px'}`
        }
    },
    methods: {
        show (msg, hold = false) {
            if (timer) clearTimeout(timer)

            this.state = true
            this.msg = msg

            if (hold) {
                return
            }

            timer = setTimeout(() => {
                this.state = false
                this.msg = ''
            }, duration)
        },
        hide () {
            clearTimeout(duration)
            this.state = false
            this.msg = ''
        }
    }
}
</script>

<style lang="less">
    // 其它样式请在 活动页 中指定
    .toast-container {
        width: 100%;
        height: 100%;
        position: fixed;
        top: 0px;
        left: 0px;
        z-index: 20;
        display: flex;
        justify-content: center;
        align-items: center;
        .toast-msg {
            max-width: 80%;
            color: #fff;
            word-break: break-all;
            border-radius: 10px;
            background: rgba(0, 0, 0, 0.8);
            padding: 8px 12px;
        }
    }
</style>
