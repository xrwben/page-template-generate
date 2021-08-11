import { PureComponent } from 'react'
import PCScroller from '../PCScroller/PCScroller'

export default class RuleLayer extends PureComponent {
    rTableMod () {
        return (
            <div className="table-mod">
                <div className="table-row">
                    <div className="tcell cell-1">南瓜公主榜第1名</div>
                    <div className="tcell cell-2">300000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">南瓜公主榜第2名</div>
                    <div className="tcell cell-2">200000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">南瓜公主榜第3名</div>
                    <div className="tcell cell-2">100000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">南瓜公主榜第4/5名</div>
                    <div className="tcell cell-2">80000{ this.perName }</div>
                </div>
            </div>
        )
    }

    rTableUser () {
        return (
            <div className="table-user">
                <div className="table-row">
                    <div className="tcell cell-1">骷髅骑士榜第1名</div>
                    <div className="tcell cell-2">帝王套5折送出权*5日+童话王国5折送出权*5日+100000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">骷髅骑士榜第2名</div>
                    <div className="tcell cell-2">帝王套5折送出权*3日+童话王国5折送出权*3日+80000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">骷髅骑士榜第3名</div>
                    <div className="tcell cell-2">帝王套5折送出权*2日+童话王国5折送出权*2日+60000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">骷髅骑士榜第4/5名</div>
                    <div className="tcell cell-2">帝王套5折送出权*1日+童话王国5折送出权*1日+50000{ this.perName }</div>
                </div>
            </div>
        )
    }

    renderRuleContent () {
        return (
            <div>
                <div className="rule-i"><span className="ind ind-1"></span> 活动时间：10.29 12:00:00-11.1 23:59:59。</div>
                <div className="rule-i"><span className="ind ind-2"></span> 活动礼物：南瓜灯=10{ this.perName }=11积分</div>
                <div className="rule-i sub-i">一起鬼混=9999{ this.perName }=13140积分</div>
                <div className="rule-i txt-in">主播收取礼物面板-热门除角标为周星和打榜的所有礼物以及守护、粉丝团礼物也可获取积分，1{ this.perName }=1积分。</div>
                <div className="rule-i"><span className="ind ind-3"></span> 用户可化身英勇的骷髅骑士帮助化身为南瓜公主的主播赶走捣蛋的小鬼，开启南瓜礼盒，触发全站飘屏，掉落南瓜灯。前四次开启礼盒需要不同数量的南瓜灯，从第五次起，每次开启需要3000个南瓜灯。</div>
                <div className="layer-s rule-stage"></div>
                <div className="rule-i"><span className="ind ind-4"></span>11月1日万圣节当天，获取积分最高的主播和贡献最大的用户将成为万圣CP，获得“2019万圣CP”认证7日，主播另外获得50000{ this.perName }奖励。</div>

                <div className="icon-s txt-rw">活动奖励</div>
                { this.rTableMod() }
                { this.rTableUser() }
                <div className="rule-i">奖励说明：</div>
                <div className="rule-i"><span className="ind ind-1"></span> { this.perName }奖励于活动结束的5个工作日内发放。</div>
                <div className="rule-i float-r"><span className="ind ind-2"></span> 帝王套和童话王国五折送出权在活动结束时即时生效，生效期内送出指定礼物时均为五折送出。帝王套原价917660{ this.perName }，五折仅需458830{ this.perName }，童话王国原价334400{ this.perName }，五折仅需167200{ this.perName }。五折礼物可在所有直播间送出（不含多人语音及多人视频房间）</div>
                <div className="rule-i pad-last"><span className="ind ind-3"></span> 生效期内送出五折礼物，用户经验值、粉丝亲密度按该礼物原价3倍计算，主播星光值、主播收益按折后价进行计算。</div>
            </div>
        )
    }

    render () {
        return (
            <div className="layer layer-rule">
                <div className="layer-h layer-s pic-rule">活动规则</div>
                <div className="layer-content">
                    <div className="butn btn-s btn-close" onClick={ () => this.props.onClose() }></div>
                    <div className="layer-main">
                        {
                            this.pageType === 'pc' ? (
                                <PCScroller
                                    right="0"
                                    thumbColor="#4d236f">
                                    { this.renderRuleContent() }
                                </PCScroller>
                            ) : this.renderRuleContent()
                        }
                    </div>
                </div>
            </div>
        )
    }
}
