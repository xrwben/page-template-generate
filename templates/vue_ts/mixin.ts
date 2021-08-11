import axios from 'axios'
import SvgPlayer from '../shared/components/SvgPlayer.vue'
import Loading from '../shared/components/Loading.vue'
import Toast from '../shared/components/Toast.vue'

import { Vue, Component } from "vue-property-decorator"

@Component({
    components: {
        SvgPlayer, Loading, Toast
    }
})

export default class CommonMixin extends Vue {
    isLogin: boolean = false;
    isMod: boolean = false;
    activityStatus: number = 0;

    // 活动规则
    showRulePopup: boolean = false;

    // 初始化信息
    init (): void {
        axios.get('/luckySugar4/initInfo').then(res => {
            if (res.data.errno === 0) {
                const resData = res.data.data
                this.isLogin = resData.isLogin
                this.isMod = resData.isMod
                this.activityStatus = resData.activityStatus
            } else {
                console.error(res.data.msg)
            }
        }).catch(err => {
            console.error(err)
        })
    }

}