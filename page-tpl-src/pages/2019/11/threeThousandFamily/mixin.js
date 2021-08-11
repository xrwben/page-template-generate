import axios from 'axios'
// import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

const CommonMixin = {
    components: {
        Toast
    },
    data: {
        // 包名
        packageName: '星光',
        // 用户是否登录
        isLogin: false,
        // 分场主播列表
        roomList: [],
        // 予我三千铁骑弹窗
        showPopup: false,
        // 邀请函弹窗
        showInvitationImg: false
    },
    mounted () {
        this.getLive()
    },
    computed: { },
    methods: {
        // 获取分场主播列表
        getLive () {
            axios.get('/threeThousand/init').then(res => {
                // console.log(res)
                const { data } = res
                if (data.errno === 0) {
                    this.roomList = data.data.recs
                    this.isLogin = data.data.isLogin
                    this.packageName = data.data.packageName
                }
            }).catch(err => {
                console.log(err)
            })
        },
        // 予我三千铁骑确认
        getGift () {
            if (this.isLogin) {
                axios.get('/threeThousand/join').then(res => {
                    const { data } = res
                    // if (data.errno === 0) {
                    //     // this.roomList = data.data.recs
                    //     // this.$refs.toast.show('三千铁骑已放置到你的礼物栏啦！')
                    //     this.$refs.toast.show(data.msg)
                    // } else {
                    //     console.log(data.msg)
                    //     this.$refs.toast.show(data.msg)
                    // }
                    this.$refs.toast.show(data.msg)
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.showPopup = false
                })
            } else {
                this.goLogin()
            }
        },
        // 关注主播
        follow (room) {
            if (this.isLogin) {
                axios.get('/chenChen/attention', {
                    params: {
                        mid: room.id
                    }
                }).then(res => {
                    const { data } = res
                    if (data.errno === 0) {
                        this.getLive()
                    } else {
                        console.log(data.data.msg)
                        this.$refs.toast.show(data.msg)
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(() => {
                    this.showPopup = false
                })
            } else {
                this.goLogin()
            }
        }
    }
}

export default CommonMixin
