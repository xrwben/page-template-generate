/* 规则HOC */
import { PureComponent } from 'react'
import PCScroller from '../../../components/PCScroller/PCScroller'

export default class GameRule extends PureComponent {
    contJSX () {
        const perName = this.perName

        return (
            <div>
                <div className="rule-h1">
                    <div className="rule-i rule-time">{ this.props.time }</div>
                    <div className="rule-val rv-1">
                        <div className="val-price">10{ perName }</div>
                        <div className="val-score">1荣耀值</div>
                    </div>
                    <div className="rule-val rv-2">
                        <div className="val-price">18800{ perName }</div>
                        <div className="val-score">1880荣耀值</div>
                    </div>
                </div>
                <div className="rule-h2">
                    <div className="rule-val rv-3">
                        <div className="val-price">20000{ perName }</div>
                        <div className="val-score">2000荣耀值</div>
                    </div>
                    <div className="rule-val rv-4">
                        <div className="val-price">10{ perName }</div>
                        <div className="val-score">1荣耀值</div>
                    </div>
                </div>
                {
                    this.props.children
                }
                <div className="rule-u-h"></div>
                <div className="rule-i">1. 观看福利：年度期间，用户每日首次进入直播间，获得1张助力票，自动下发在背包。在线累计观看直播满5分钟，获得1张助力票，需手动领取。每日上限5张。6张票仅当日有效，次日清空。（在活动页面年度大人物页面领取助力票；一个设备/IP每日仅限一个ID获得观看福利；仅记录在直播间时间，大厅停留时间不累计）</div>
                <div className="rule-i">2. 首充福利：年度期间，APP端用户每日仅一个ID首次成功充值任意金额，即可获得10张助力票。<span className="butn rule-link" onClick={ this.goRecharge }>去充值>>></span></div>
                <div className="rule-i">3. 红包雨福利：用户一次性送出1880张年度票或赠送一个盛典火箭，触发直播间红包雨。掉落年度票、助力票。</div>
                <div className="rule-i">4. 宝箱福利：用户送出一个年度宝箱，用户可以通过输入口令，有概率领取到年度票、助力票。</div>
                <div className="rule-i">5. 竞猜福利：<span className="butn rule-link" onClick={ () => this.$changeRouterTab(3) }>详见竞猜玩法>>></span></div>
                <div className="rule-tips">
                    <div className="rule-tips-i">1. 背包中获得的年度礼物有效期至2020年5月31日23:59:59，逾期清空，请及时送出。其中助力票不参与分成。非赛事期间送出年度礼物，对年度活动所有榜单不生效。</div>
                    <div className="rule-tips-i">2. 因年度盛典期间，送礼量大，服务器会有一定程度的延迟，请提前10秒偷塔，以免成绩未记录榜单。若发生因服务器延迟，造成成绩未记录榜单情况，平台不予补偿，请谅解！</div>
                    <div className="rule-tips-i">3. 为给大家提供更好的直播体验，赛事期间每日最后10分钟，全平台送出盛典火箭，无特效显示，红包雨效果不变，对您造成的困扰，请谅解！</div>
                </div>
            </div>
        )
    }

    render () {
        return (
            <div className={`layer layer-rule ${this.props.className}`} >
                <div className="layer-c">
                    <div className="common-s butn btn-close" onClick={ this.props.onClose }></div>
                    <div className="layer-h"></div>
                    {
                        this.pageType === 'pc' ? (
                            <PCScroller
                                className="layer-m"
                                right="10"
                                thumbColor="#efc65a"
                                onScroll={ null }
                                canBubble={ true }
                            >
                                { this.contJSX() }
                            </PCScroller>
                        ) : (
                            <div className="layer-m">{ this.contJSX() }</div>
                        )
                    }
                </div>
            </div>
        )
    }
}
