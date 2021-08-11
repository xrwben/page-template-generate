import { Component } from 'react' // eslint-disable-line
import axios from 'axios'
import $loading from './plugins/loading'
import $toast from './plugins/toast'

function apiHandler (res) {
    if (res.status === 200) {
        return res.data
    } else {
        console.error('[service.apiHandler]:', res.message)
        throw new Error(res.message)
    }
}

function dataHandler (data) {
    if (data.errno === 0) {
        return data.data
    } else {
        console.error('[service.dataHandler]:', data.msg)
        throw new Error(data.msg)
    }
}

function getMods () {
    return axios.get('/Hallo2019/getModerators').then(apiHandler).then(dataHandler)
}

function attention (mid) {
    return axios.get('/chenChen/attention', {
        params: {
            mid: mid
        }
    }).then(apiHandler).then(dataHandler)
}

function getCookie () {
    const cookieStr = document.cookie
    const cookie = {}

    cookieStr.split(';').forEach(kv => {
        const target = kv.trim().split('=')
        cookie[target[0].trim()] = target[1].trim()
    })

    return cookie
}

const Cookie = getCookie()

export default class App extends Component {
    constructor (props) {
        super(props)

        this.state = {
            list: []
        }
    }

    componentDidMount () {
        $loading.show()
        getMods().then(data => {
            $loading.hide()

            this.setState({
                list: data
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    goAtte (info, mi) {
        if (info.isLoved) {
            return
        }

        if (!info || (!info.id && !info.mid)) {
            return Promise.reject(new Error('参数错误'))
        }

        $loading.show()
        return attention(info.id || info.mid).then(() => {
            $loading.hide()
            const target = [...this.state.list]
            target[mi].isLoved = true

            this.setState({
                list: target
            })
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    render () {
        return (
            <div className="page">
                { this.props.children }
                <div className="page-content">
                    <div className="banner"></div>
                    <div className="avatar-list">
                        {
                            this.state.list.map((mod, mi) => (
                                <div className="mods" key={ 'mods-i-' + mi }>
                                    <div className="nickname txt-of">{ mod.nickname }</div>
                                    <div className="headpic pic-s a_bg">
                                        <img className="avatar" src={ mod.headPic } alt="" onClick={ () => { this.goRoom(mod) } } />
                                        <span className="pic-s icon_live" style={ { display: mod.isPlaying ? 'block' : 'none' } }></span>
                                    </div>
                                    <div className="content">直播内容：{ mod.content }</div>
                                    <div className="time">直播时间：{ mod.time }</div>
                                    <div
                                        className={ 'mod-atte pic-s btn_atte' + ((mod.isLoved || String(mod.mid) === String(Cookie.uid)) ? '_dis' : '') }
                                        onClick={ () => { String(mod.mid) !== String(Cookie.uid) && this.goAtte(mod, mi) } } ></div>
                                </div>
                            ))
                        }
                    </div>
                    <div className="footer"></div>
                    <div className="footer-c">
                        <div className="pic-s tiper">注：若以上主播在推荐期间，有违反平台公约情况，将立即取消推荐。</div>
                        <div className="copyright">在法律允许的范围内，本活动的解释权归平台所有</div>
                    </div>
                </div>
            </div>
        )
    }
}
