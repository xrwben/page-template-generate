import { PureComponent } from 'react'

import './style.less'
import HOLD_PIC from '../../images/holder.png'

import $loading from '../../plugins/loading'
import $toast from '../../plugins/toast'
import { getUserRanks, getTicketInfo, drawTicket } from '../../service'

function RankItem (props) {
    return (
        <div className="rank-item fl-ver">
            <div className="ind fl-box">
                {
                    props.ind < 10 ? [
                        <span className="num-s num-0" key="n-0" />,
                        <span className={ `num-s num-${props.ind}` } key="n-x" />
                    ] : (
                        [].slice.call((props.ind + '')).map((n, ni) => (
                            <span className={ `num-s num-${n}` } key={ 'n-' + ni } />
                        ))
                    )
                }
            </div>
            <div className="info fl-ver">
                <div className="headpic">
                    <img className="avatar" src={ props.item.headPic } />
                </div>
                <div className="details">
                    <div className="nickname fl-box">
                        <span className="name txt-of">{ props.item.nickname }</span>
                        <span className={ `level_icon u_level_icon_${props.item.level}` }></span>
                    </div>
                    <div className="badge"></div>
                </div>
            </div>
            <div className="score txt-of">{ props.item.score }</div>
        </div>
    )
}

function RankMeCenter (props) {
    if (!props.data) return null

    const { headPic, nickName, level, pairInfos, rank } = props.data

    const rankInd = rank === '未上榜' ? -1 : +rank

    return (
        <div className="rank-center fl-box">
            <div className="infor">
                <div className="headpic">
                    <img className="avatar" src={ headPic } />
                    { rankInd <= 10 ? <div className={`mc-badge mc-b-${rankInd}`}></div> : null }
                </div>
                <div className="nickname fl-box">
                    <div className="name txt-of">{ nickName }</div>
                    <span className={ `level_icon u_level_icon_${level}` }></span>
                </div>
            </div>
            <div className="details fl-box">
                {
                    [0, 2, 1, 3].map((ind) => {
                        var target = pairInfos[ind]
                        return (
                            <div className="di-item" key={ 'di_prop_' + ind }>
                                <div className="di-title">{ target.name }</div>
                                <div className="di-value">{ target.value }</div>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const HOLD_DATA = {
    headPic: HOLD_PIC,
    nickname: '虚位以待',
    score: '-',
    id: null,
    level: null
}

export default class UserPage extends PureComponent {
    constructor (props) {
        super(props)

        this.state = {
            islogin: false,
            list: [],
            meCenter: null,

            ticket: {
                first: 0, // 0-未进入 1-进入未领取 2-进入已领取
                watchTime: 0, // 观看时长
                received: 0, // 已领取
                cumulateTotal: 5, // 可领取总数
                isAvailableTime: true // 是否可领取
            }
        }

        this.showTicketTip = () => {
            $toast.showTip('年度期间首次进入直播间以及观看直播赠送助力票，仅当日有效，次日清零。')
        }
    }

    componentDidMount () {
        $loading.show()
        Promise.all([
            this.loadTicketInfo(),
            this.loadRanks()
        ]).then(() => {
            $loading.hide()
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    loadTicketInfo () {
        return getTicketInfo().then(data => {
            if (typeof data.first === 'undefined') {
                return
            }

            this.setState({
                islogin: true,
                ticket: {
                    first: data.first,
                    watchTime: data.watch_time,
                    received: data.received,
                    cumulateTotal: data.cumulate_total,
                    isAvailableTime: data.isAvailableTime
                }
            })
        })
    }

    loadRanks () {
        return getUserRanks().then(data => {
            const ranks = data.ranks.concat(
                new Array(10 - data.ranks.length).fill(HOLD_DATA)
            )

            this.setState({
                list: ranks,
                meCenter: data.myRank && typeof data.myRank.uid !== 'undefined' && data.myRank.uid !== '' ? data.myRank : null
            })
        })
    }

    clickDailyTicket () {
        if (!this.props.proxy.islogin) {
            this.goLogin()
            return
        }
        if (!this.state.ticket.isAvailableTime) {
            $toast.show('活动期间才可领取哦~')
            return
        }
        if (this.state.ticket.first === 0) {
            $toast.show('您今日还未进入直播间，无法领取哦！')
            return
        }
        if (this.state.ticket.first === 1) {
            // $toast.show('一个设备/IP每日仅限一个ID获得观看福利哦！')
            // hack
            $loading.show()
            drawTicket(1).then(data => {
                $loading.hide()
                const ticket = this.state.ticket

                this.setState({
                    ticket: {
                        ...ticket,
                        isFirst: 2
                    }
                })
            }).catch(err => {
                $loading.hide()
                $toast.show(err.message)
            })
        }
    }

    clickWatchTicket () {
        if (!this.props.proxy.islogin) {
            this.goLogin()
            return
        }
        if (!this.state.ticket.isAvailableTime) {
            $toast.show('活动期间才可领取哦~')
            return
        }
        const { received, cumulateTotal, watchTime } = this.state.ticket
        // 全部领取完毕
        if (received >= cumulateTotal) {
            return
        }

        if (watchTime < (received + 1) * 5) {
            $toast.show('在线累计观看直播每满5分钟，才能领取1张助力票哦！')
            return
        }

        // 领取
        $loading.show()
        drawTicket(2).then((data) => {
            $loading.hide()

            const { recNum, canNum } = data
            const ticket = this.state.ticket

            this.setState({
                ticket: {
                    ...ticket,
                    received: this.state.ticket.received + recNum
                }
            })

            if (canNum === 0) {
                $toast.show(`本次领取${recNum}张助力票，您已领取全部助力票。`)
                return
            }

            $toast.show(`本次领取${recNum}张助力票，还有${canNum}张助力票可领取，加油哦！`)
        }).catch(err => {
            $loading.hide()
            $toast.show(err.message)
        })
    }

    render () {
        const ticket = this.state.ticket
        const isCanDraw = ticket.isAvailableTime
        const isFirst = ticket.first !== 2
        const watchTime = Math.min(ticket.watchTime, 25)
        const { received, cumulateTotal } = ticket

        return (
            <div className="page-r user">
                <div className="user-rank border-deco">
                    <div className="user-bg"></div>
                    <div className="user-h"></div>
                    <div className="ticket-box">
                        <div className="ticket-i fl-box">
                            <div className="user-c-s ticket"></div>
                            <div className="details">
                                <div className="dh">今日首次进入直播间</div>
                                <div className="dv">{ isFirst ? 0 : 1 }/1</div>
                            </div>
                            <div
                                className={ 'butn user-c-s btn-draw' + (isCanDraw && isFirst ? '' : '-dis') }
                                onClick={ () => { this.clickDailyTicket() } } />
                        </div>
                        <div className="ticket-i fl-box">
                            <div className="user-c-s ticket"></div>
                            <div className="details">
                                <div className="dh">今日已累计观看直播{ watchTime }分钟</div>
                                <div className="dv">{ received }/{ cumulateTotal }</div>
                            </div>
                            <div className="opr">
                                <div
                                    className={ 'butn user-c-s btn-draw' + (isCanDraw && received < cumulateTotal ? '' : '-dis') }
                                    onClick={ () => { this.clickWatchTicket() } } />
                                <div className="butn common-s icon-qs" onClick={ this.showTicketTip }></div>
                            </div>
                        </div>
                    </div>

                    <div className="user-c-s u-r-h"></div>

                    <div className="ur-list">
                        {
                            this.state.list.map((item, ind) => <RankItem ind={ ind + 1 } key={ 'rank-i-' + ind } item={ item } />)
                        }
                    </div>

                    <div className="rank-tip">仅展示TOP10大人物</div>

                    <RankMeCenter data={ this.state.meCenter } />
                </div>
            </div>
        )
    }
}
