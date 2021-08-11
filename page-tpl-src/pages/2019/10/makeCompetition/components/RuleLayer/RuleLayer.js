import { Component } from 'react'
import PCScroller from '../PCScroller/PCScroller'

export default class RuleLayer extends Component {
    // constructor (props) {
    //     super(props)
    // }

    rTable1 () {
        return (
            <div className="table-1">
                <div className="table-th">
                    <div className="tcell cell-1">关卡</div>
                    <div className="tcell cell-2">所需战力</div>
                    <div className="tcell cell-3">主播奖励</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第一关</div>
                    <div className="tcell cell-2">5000</div>
                    <div className="tcell cell-3">暴鸡*30</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第二关</div>
                    <div className="tcell cell-2">10000</div>
                    <div className="tcell cell-3">暴鸡*60+500战力</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第三关</div>
                    <div className="tcell cell-2">15000</div>
                    <div className="tcell cell-3">麦克风*1+800战力</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第四关</div>
                    <div className="tcell cell-2">25000</div>
                    <div className="tcell cell-3">晋级飘屏通知*1<br/>+红包雨*1+1000战力</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第五关</div>
                    <div className="tcell cell-2">50000</div>
                    <div className="tcell cell-3">萌萌喵*1+1500战力</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第六关</div>
                    <div className="tcell cell-2">100000</div>
                    <div className="tcell cell-3">开播飘屏*1+红包雨*1<br/>+2500战力</div>
                </div>
            </div>
        )
    }

    rTable2 () {
        return (
            <div className="table-2">
                <div className="table-th">
                    <div className="tcell cell-1">名次</div>
                    <div className="tcell cell-2">奖励</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">擂主</div>
                    <div className="tcell cell-2">300000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">亚军</div>
                    <div className="tcell cell-2">200000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">四强<br/>（擂主、亚军除外）</div>
                    <div className="tcell cell-2">100000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">战神榜第一名</div>
                    <div className="tcell cell-2">150000{ this.perName }+上头条*15</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">战神榜第二名</div>
                    <div className="tcell cell-2">100000{ this.perName }+上头条*10</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">战神榜第三名</div>
                    <div className="tcell cell-2">80000{ this.perName }+上头条*8</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">战神榜第四、五名</div>
                    <div className="tcell cell-2">50000{ this.perName }+上头条*5</div>
                </div>
            </div>
        )
    }

    renderRuleContent () {
        return (
            <div>
                <div className="rule-i">1、活动时间：2019.10.17 12:00:00 - 10.20 23:59:59。</div>
                <div className="rule-i">2、活动礼物：主播收取礼物面板-热门/守护/粉丝团礼物获得战力，1{ this.perName }=1战力。开通守护、角标为周星和打榜的不计战力。</div>
                <div className="rule-i">3、活动玩法</div>
                <div className="rule-i sub-i">3.1、闯关赛：主播达到关卡所需战力即可通关并获得关卡奖励，通过第四关才能解锁晋级赛（18日23:59:59 前），共6关，礼物奖励实时下发至背包中。每一关所需战力及奖励见下表：</div>
                { this.rTable1() /* <div className="table-1"></div> */}
                <div className="rule-table-tip">注：18日23:59:59前闯过第4关才有机会晋级哦</div>
                <div className="rule-i sub-i">3.2、晋级赛：18日开启，该阶段将争夺16个擂主争霸赛名额，18日12点晋级榜单前2名主播，18点晋级榜单前3名主播，21点晋级榜单前5名主播，24点晋级榜单前6名主播，共计16名主播。已晋级的主播会移出该榜单，不影响后续的主播晋级。若主播晋级时其战力达40w，则将在晋级赛结束时奖励15000{ this.perName }。</div>
                <div className="rule-i">注：晋级赛结束时间为18日23:59:59</div>
                <div className="rule-i sub-i">3.3、擂主争霸赛：该阶段将进行4轮的 1v1 比拼，最终的赢家则成为擂主。16名主播按晋级时的战力进行首尾1v1比拼，1 vs16、2 vs15...（数字代表其排名），其每轮对决时间如下：</div>
                <div className="rule-i">八强赛：19日0点至16点</div>
                <div className="rule-i">四强赛：19日16点至24点</div>
                <div className="rule-i">半决赛：20日0点至16点</div>
                <div className="rule-i">擂主争霸：20日16点至24点</div>
                <div className="rule-i">每一轮胜利的主播将累计自己本轮30%的战力计入下一轮中。</div>
                <div className="rule-i">4、活动奖励：</div>
                {
                    this.rTable2()
                }
                <div className="rule-i">奖励发放说明：</div>
                <div className="rule-i sub-i">1、开播飘屏在获得奖励的次日零点起，每日获奖主播首次开播下发，每日下发一次；</div>
                <div className="rule-i sub-i">2、{ this.perName }奖励在活动结束的5个工作日内发放，上头条奖励活动结束后即时下发；</div>
                <div className="rule-i sub-i">3、活动期间送礼量大，服务器会有一定程度的延迟，请提前10秒冲榜，以免成绩未记录榜单。若发生因服务器延迟，造成成绩未记录榜单情况，平台不予补偿，请谅解！</div>
            </div>
        )
    }

    render () {
        return (
            <div className="layer layer-rule">
                <div className="layer-h ht-s h-rule">活动规则</div>
                <div className="layer-content">
                    <div className="butn btn-s btn-close" onClick={ () => this.props.onClose() }></div>
                    <div className="box-w1">
                        <div className="box-w2">
                            {
                                this.pageType === 'pc' ? (
                                    <PCScroller
                                        right="0"
                                        thumbColor="#eeab76">
                                        { this.renderRuleContent() }
                                    </PCScroller>
                                ) : this.renderRuleContent()
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
