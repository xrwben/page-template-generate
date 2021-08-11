import axios from 'axios'
// import Loading from '../shared/components/Loading.vue'

const CommonMixin = {
    components: {
        // Loading
    },
    data () {
        return {
            anchorBest: null,
            categoryList: {
                tl: [],
                fy: [],
                ox: [],
                yq: [],
                ml: [],
                rq: [],
                yl: []
            },
            drwList: new Array(10)
        }
    },
    created () {
        this.getData()
    },
    mounted () { },
    computed: { },
    methods: {
        getData () {
            axios.get('/anniversary2019S2/honourPalace').then(res => {
                if (res.data.errno === 0) {
                    this.anchorBest = res.data.data.best
                    Object.keys(this.categoryList).forEach((key, index) => {
                        this.categoryList[key] = res.data.data.mods.groupMods[index]
                    })
                    console.log('this.categoryList>>>>>>>>>', this.categoryList)
                    // this.drwList = res.data.data.users.length && res.data.data.users
                    this.drwList = res.data.data.users.length ? res.data.data.users : new Array(10)
                }
            }).catch(error => {
                console.log(error)
            })
        }
        // showLoading () {
        //     this.$refs.loading.show()
        // },
        // hideLoading () {
        //     this.$refs.loading.hide()
        // }
    }
}

export default CommonMixin
