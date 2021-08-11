import { PureComponent } from 'react'

export default class BetsRule extends PureComponent {
    render () {
        return (
            <div className="layer layer-bet-rule">
                <div className="layer-c">
                    <div className="common-s butn btn-close" onClick={ this.props.onClose }></div>
                    <div className="layer-m">
                        <div className="rule-i">1. 用户可以使用背包中的助力票进行竞猜，单次竞猜最低消耗5张助力票。</div>
                        <div className="rule-i">2. 每位用户每轮只能竞猜1次。</div>
                        <div className="rule-i">3. 每轮竞猜结束的前60分钟停止竞猜。</div>
                        <div className="rule-i">4. 每轮竞猜获胜的用户可按照投注的助力票占比获胜方的助力票总数量，瓜分竞猜失败用户的助力票。</div>
                        <div className="rule-i">5. 平台将额外奖励每轮竞猜获胜的用户助力票，按照投注的助力票占比获胜方的助力票总数量，瓜分奖励。根据每轮竞猜奖励额度不等，详见活动页面竞猜备注。</div>
                        <div className="rule-i">6. 以上瓜分，若有小数，则向上取整。</div>
                        <div className="rule-i">7. 奖励在竞猜结果公布的1个小时内发放。</div>
                        <div className="rule-i">8.竞猜获胜的用户返还投注助力票，竞猜失败的用户不返还投注助力票。</div>
                    </div>
                </div>
            </div>
        )
    }
}
