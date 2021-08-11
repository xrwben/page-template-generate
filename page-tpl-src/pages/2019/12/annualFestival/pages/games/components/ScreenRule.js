import { PureComponent } from 'react'
import PCScroller from '../../../components/PCScroller/PCScroller'

export default class ScreenRule extends PureComponent {
    renderRule () {
        const perName = this.perName

        return (
            <div>
                <div className="rule-i">1. 赛事期间，用户一次性送出价值≥52000{ perName }的年度礼物，即可与主播一起抢占全站直播间霸屏位，享受全站瞩目。点击霸屏位，即可跳转至当前霸屏主播直播间。（app端用户请更新至V5.5.6及以上版本查看霸屏）</div>
                <div className="rule-i">2. 霸屏位展示5分钟，在此期间，一次性赠送年度礼物价值高于当前霸屏礼物即可抢占当前霸屏位。</div>
                <div className="rule-i">3. 霸屏5分钟结束后，最先一次性赠送价值≥52000{ perName }的年度礼物抢占霸屏位。</div>
                <div className="rule-i">4. 霸屏主播在霸屏期间因违反平台公约被封号、禁播，霸屏位隐藏。最先一次性赠送价值≥52000{ perName }的年度礼物抢占霸屏位。</div>
                <div className="rule-i">5. 直播间霸屏位如下图所示：</div>
                <div className="rule-pic"></div>
            </div>
        )
    }

    render () {
        return (
            <div className="layer layer-screen">
                <div className="layer-c">
                    <div className="common-s butn btn-close" onClick={ this.props.onClose }></div>
                    {
                        this.pageType === 'pc' ? (
                            <PCScroller
                                className="layer-m"
                                right="10"
                                thumbColor="#efc65a"
                                onScroll={ null }
                                canBubble={ false }
                            >
                                { this.renderRule() }
                            </PCScroller>
                        ) : (
                            <div className="layer-m">{ this.renderRule() }</div>
                        )
                    }
                </div>
            </div>
        )
    }
}
