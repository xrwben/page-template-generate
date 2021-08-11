import { PureComponent, createRef } from 'react'

import avatar from '../../images/holder.png'
import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'

import { searchUser } from '../../service'

export default class ThkRank extends PureComponent {
    constructor (props) {
        super(props)

        this.holder = {
            isholder: true,
            uid: null,
            nickname: '--',
            headPic: avatar,
            level: null,
            score: '--'
        }

        this.searchKey = ''
        this.inputRef = createRef()

        this.searchInput = (evt) => {
            this.searchKey = evt.target.value
        }

        this.goSearch = () => {
            if (!this.props.islogin) {
                this.goLogin()
                return
            }

            if (!this.searchKey) return

            this.search(this.searchKey)
        }
    }

    search (key) {
        $loading.show()
        searchUser(key).then((res) => {
            $loading.hide()

            this.props.showSearchRes(res)

            this.searchKey = ''
            this.inputRef.current && (this.inputRef.current.value = '')
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    thkItem (item, ind) {
        return (
            <div className={ 'thk-item fl-box thk-i-' + ind } key={ 'thk-i-' + ind}>
                <div className="headpic">
                    <img className="avatar" alt="用户头像" src={ item.headPic } />
                </div>
                <div className="info">
                    <div className="nickname fl-ver" style={ item.isholder ? { textAlign: 'center' } : null }>
                        <span className="name txt-of">{ item.nickname }</span>
                        <span className={ `level_icon u_level_icon_${item.level}` }></span>
                    </div>
                    {
                        !item.isholder && <div className="score">感恩之心*{ item.score }</div>
                    }
                </div>
                {
                    item.isholder ? <div className="btn-holder"></div> : <div className="butn btn-s btn-give2" onClick={ () => this.props.toGive(item) }>赠送</div>
                }
            </div>
        )
    }

    render () {
        return (
            <div className="thk-ranks wrap-box">
                <div className="wrap-c">
                    <div className="h-title h-thk">深情不及久伴 厚爱也需感谢</div>
                    <div className="sub-title">主播为守护大哥们送上感恩之心，前三名的用户可获得感恩基金哦！</div>
                    <div className="thk-contents">
                        <div className="thk-search fl-box">
                            <input className="input-i" type="text" placeholder="输入ID查找" onInput={ this.searchInput } ref={ this.inputRef } />
                            <div className="butn btn-s btn-search" onClick={ this.goSearch }>搜索</div>
                        </div>
                        {
                            this.props.isMod && this.props.myInfo && <div className="thk-score">目前剩余感恩之心 { this.props.myInfo.coin } 个</div>
                        }
                        <div className="thk-list">
                            {
                                [0, 1, 2, 3, 4].map((ind) => {
                                    return this.props.ranks[ind] ? this.thkItem(this.props.ranks[ind], ind) : this.thkItem(this.holder, ind)
                                })
                            }
                        </div>
                        {
                            this.props.myInfo && (
                                <div className="thk-item fl-box thk-me">
                                    <div className="headpic">
                                        <img className="avatar" alt="用户头像" src={ this.props.myInfo.headPic } />
                                    </div>
                                    <div className="info">
                                        <div className="nickname fl-ver">
                                            <span className="name txt-of">{ this.props.myInfo.nickname }</span>
                                            <span className={ `level_icon u_level_icon_${this.props.myInfo.level}` }></span>
                                        </div>
                                        <div className="score">感恩之心*{ this.props.myInfo.score }</div>
                                    </div>
                                    <div className="butn btn-s btn-give2" onClick={ () => this.props.toGive(this.props.myInfo) } >赠送</div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        )
    }
}
