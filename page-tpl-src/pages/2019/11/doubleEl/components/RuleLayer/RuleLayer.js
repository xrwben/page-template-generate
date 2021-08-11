import { PureComponent } from 'react'
import PCScroller from '../PCScroller/PCScroller'

export default class RuleLayer extends PureComponent {
    rTableCart () {
        return (
            <div className="table-cart">
                <div className="table-h">
                    <div className="tcell cell-1">购物车</div>
                    <div className="tcell cell-2">所需积分</div>
                    <div className="tcell cell-3">奖励</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">初级购物车</div>
                    <div className="tcell cell-2">6660</div>
                    <div className="tcell cell-3">贡献最大的用户奖励狗粮红包*1</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">中级购物车</div>
                    <div className="tcell cell-2">13140</div>
                    <div className="tcell cell-3">贡献最大的用户奖励狗粮红包*1+随机抽取一位参与本次清空购物车的用户奖励100{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">高级购物车</div>
                    <div className="tcell cell-2">334400</div>
                    <div className="tcell cell-3">贡献最大的用户奖励狗粮红包*2+随机抽取两位参与本次清空购物车的用户奖励100{ this.perName }</div>
                </div>
            </div>
        )
    }

    rTableRw () {
        return (
            <div className="table-rw">
                <div className="table-h">
                    <div className="tcell cell-1">胜利队伍</div>
                    <div className="tcell cell-2">奖励</div>
                    <div className="tcell cell-3">战败队伍</div>
                    <div className="tcell cell-4">奖励</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第一名</div>
                    <div className="tcell cell-2">300000{ this.perName }</div>
                    <div className="tcell cell-3">第一名</div>
                    <div className="tcell cell-4">200000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第二名</div>
                    <div className="tcell cell-2">200000{ this.perName }</div>
                    <div className="tcell cell-3">第二名</div>
                    <div className="tcell cell-4">100000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第三名</div>
                    <div className="tcell cell-2">150000{ this.perName }</div>
                    <div className="tcell cell-3">第三名</div>
                    <div className="tcell cell-4">50000{ this.perName }</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第四、五名</div>
                    <div className="tcell cell-2">100000{ this.perName }</div>
                    <div className="tcell cell-3"></div>
                    <div className="tcell cell-4"></div>
                </div>
            </div>
        )
    }

    renderRuleContent () {
        return (
            <div>
                <div className="rule-i">1、活动时间：2019/11/7 12:00:00 - 11/11 23:59:59。</div>
                <div className="rule-i">2、活动礼物：主播收取礼物面板-热门/守护/粉丝团礼物获得积分，开通守护、角标为周星和打榜的不计积分，1{ this.perName } = 1积分。</div>
                <div className="rule-i">3、五折限定：活动期间，萌萌喵、LOVE、炫酷超跑、宠你上天仅需五折即可送出。每个礼物对应积分Top1的主播将奖励开播飘屏*2，若积分超过100w，可额外获得50000{ this.perName }奖励。</div>
                <div className="rule-i">4、清空购物车：送出活动礼物，为主播清空购物车，可循环清空。</div>
                { this.rTableCart() }
                <div className="rule-i">注：狗粮红包奖励即时发放至背包，于11月12日23:59:59过期，请及时送出！</div>
                <div className="rule-i">5、秀恩爱VS买买买：活动开始后，主播首次收到活动礼物将会随机加入秀恩爱队或者买买买队，每队前10名的主播积分将作为队伍总积分，活动结束时，积分高的队伍获胜。</div>
                <div className="rule-i">6、活动奖励</div>
                { this.rTableRw() }
                <div className="rule-i">注：</div>
                <div className="rule-i">1、开播飘屏奖励在活动结束的次日零点起，每日主播首次开播时下发，每日下发一次；</div>
                <div className="rule-i">2、{ this.perName }奖励在活动结束的5个工作日内发放；</div>
                <div className="rule-i">3、活动期间送礼量大，服务器会有一定程度的延迟，请提前10秒冲榜，以免成绩未计入榜单。若发生因服务器延迟，造成成绩未计入榜单情况，平台不予补偿，请谅解！</div>
            </div>
        )
    }

    render () {
        return (
            <div className="layer layer-rule">
                <div className="layer-h icon-s h-rule">活动规则</div>
                <div className="layer-content">
                    <div className="layer-c-w">
                        <div className="butn btn-s btn-close" onClick={ () => this.props.onClose() }></div>
                        <div className="layer-main">
                            {
                                this.pageType === 'pc' ? (
                                    <PCScroller
                                        right="0"
                                        thumbColor="#fdd254">
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
