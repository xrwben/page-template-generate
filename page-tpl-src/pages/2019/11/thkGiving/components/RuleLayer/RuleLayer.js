import { PureComponent } from 'react'
import PCScroller from '../PCScroller/PCScroller'

import gpic from '../../images/chicken.png'
import fpic from '../../images/feast.png'

export default class RuleLayer extends PureComponent {
    rTableThk () {
        return (
            <div className="table-thk">
                <div className="table-row">
                    <div className="tcell cell-1">活动日榜排名</div>
                    <div className="tcell cell-2">1</div>
                    <div className="tcell cell-3">2</div>
                    <div className="tcell cell-4">3</div>
                    <div className="tcell cell-5">4-5</div>
                    <div className="tcell cell-6">6-10</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">感恩之心</div>
                    <div className="tcell cell-2">500</div>
                    <div className="tcell cell-3">400</div>
                    <div className="tcell cell-4">300</div>
                    <div className="tcell cell-5">200</div>
                    <div className="tcell cell-6">100</div>
                </div>
            </div>
        )
    }

    rTableDay () {
        return (
            <div className="table-day">
                <div className="table-row">
                    <div className="tcell cell-1">主播当日感恩值</div>
                    <div className="tcell cell-2">100w</div>
                    <div className="tcell cell-3">150w</div>
                    <div className="tcell cell-4">250w</div>
                    <div className="tcell cell-5">500w</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">奖励{ this.perName }</div>
                    <div className="tcell cell-2">25000</div>
                    <div className="tcell cell-3">30000</div>
                    <div className="tcell cell-4">50000</div>
                    <div className="tcell cell-5">100000</div>
                </div>
            </div>
        )
    }

    rTableRank () {
        return (
            <div className="table-rank">
                <div className="table-row">
                    <div className="tcell cell-1">感恩榜</div>
                    <div className="tcell cell-2">奖励</div>
                    <div className="tcell cell-3">陪伴榜</div>
                    <div className="tcell cell-4">奖励</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第一名</div>
                    <div className="tcell cell-2">300000{ this.perName }</div>
                    <div className="tcell cell-3">第一名</div>
                    <div className="tcell cell-4">助力票*30000</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第二名</div>
                    <div className="tcell cell-2">200000{ this.perName }</div>
                    <div className="tcell cell-3">第二名</div>
                    <div className="tcell cell-4">助力票*20000</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第三名</div>
                    <div className="tcell cell-2">100000{ this.perName }</div>
                    <div className="tcell cell-3">第三名</div>
                    <div className="tcell cell-4">助力票*10000</div>
                </div>
                <div className="table-row">
                    <div className="tcell cell-1">第四、五名</div>
                    <div className="tcell cell-2">80000{ this.perName }</div>
                    <div className="tcell cell-3">第四、五名</div>
                    <div className="tcell cell-4">助力票*8000</div>
                </div>
            </div>
        )
    }

    renderRuleContent () {
        return (
            <div>
                <div className="rule-i"><span className="bold">1、活动时间：</span><span className="txt-red">2019/11/27 12:00:00 - 11/30 23:59:59。</span></div>
                <div className="rule-i"><span className="bold">2、活动礼物：</span></div>
                <div className="rule-gifts fl-box">
                    <div className="gifts-i">
                        <div className="gifts-pic icon-s g-bg">
                            <img className="gifts-img" alt="幸运火鸡" src={ gpic } />
                        </div>
                        <div className="gifts-name">幸运火鸡</div>
                        <div className="gifts-val">1个幸运火鸡=10{ this.perName }=10感恩值</div>
                    </div>
                    <div className="gifts-i">
                        <div className="gifts-pic icon-s g-bg">
                            <img className="gifts-img" alt="火鸡盛宴" src={ fpic } />
                        </div>
                        <div className="gifts-name">火鸡盛宴</div>
                        <div className="gifts-val">1个火鸡盛宴=6666{ this.perName }=6666感恩值</div>
                    </div>
                </div>
                <div className="rule-i"><span className="bold">3、100%抽福袋中奖：</span>活动期间，每日送出活动礼物感恩值 ≥ 100，即可开启福袋，100%中奖！助力票、幸运火鸡、火鸡盛宴、感恩红包、广播卡等你来拿！抽奖机会于当日23:59:59失效，请及时抽奖哦！</div>
                <div className="rule-i txt-red">注：感恩红包送出有炸房效果，于12月01日23:59:59失效，请及时送出。每日每个设备仅限一个ID参与抽奖！</div>
                <div className="rule-i"><span className="bold">4、深情不及久伴，厚爱也需感谢：</span>主播为守护大哥送上感恩之心，收取感恩之心数量前三的守护大哥可获得99999{ this.perName }、88888{ this.perName }、66666{ this.perName }的感恩基金哦！</div>
                <div className="rule-i sub-indent">感恩之心获取来源：</div>
                <div className="rule-i sub-indent">每日成功开播，可获得10个感恩之心；</div>
                <div className="rule-i sub-indent">每日每开播30分钟，可获得30个感恩之心；</div>
                <div className="rule-i sub-indent">主播活动日榜前10名，可获得感恩之心（注：仅11.27、11.28、11.29的主播活动日榜）</div>
                { this.rTableThk() }
                <div className="rule-i">5、活动奖励</div>
                <div className="rule-i">1）活动日榜奖励</div>
                <div className="rule-i">主播每日获得感恩值达到以下标准可获得额外奖励哦，取最高档下发奖励，该日榜奖励于次日0点下发；</div>
                { this.rTableDay() }
                <div className="rule-i">2）总榜奖励</div>
                { this.rTableRank() }
                <div className="rule-i txt-red">注：</div>
                <div className="rule-i txt-red">1、助力票为2019星光年度盛典礼物，不参与分成，于预选赛下发至背包；</div>
                <div className="rule-i txt-red">2、总榜{ this.perName }奖励于活动结束的5个工作日内发放至账户；</div>
                <div className="rule-i txt-red">3、活动期间送礼量大，服务器会有一定程度的延迟，请提前10秒冲榜，以免成绩未计入榜单。若发生因服务器延迟，造成成绩未计入榜单情况，平台不予补偿，请谅解！</div>
            </div>
        )
    }

    render () {
        return (
            <div className="layer layer-rule">
                <div className="wrap-box">
                    <div className="wrap-c">
                        <div className="h-title h-rule">活动规则</div>
                        <div className="layer-content">
                            <div className="butn btn-s btn-close" onClick={ () => this.props.onClose() }></div>
                            <div className="layer-main">
                                {
                                    this.pageType === 'pc' ? (
                                        <PCScroller
                                            right="0"
                                            thumbColor="#ea5413">
                                            { this.renderRuleContent() }
                                        </PCScroller>
                                    ) : this.renderRuleContent()
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
