import '../node_modules/core-js/es/promise/index'
import common from './vendor_pc/common'
import user from './vendor_pc/user'
import Vue from 'vue' // eslint-disable-line

// 公共头部导航
import HeaderNav from './vendor_pc/headerNav.vue'

window.common = common
window.user = user

new Vue({
    el: '.header_wrap',
    components: {
        HeaderNav
    }
})

export default {
    common,
    user
}
