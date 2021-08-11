import { PureComponent } from 'react'
import GameRule from './GameRule'

export default class EventRule extends PureComponent {
    render () {
        return (
            <GameRule className="et-rule" onClose={ this.props.onClose } time="活动时间：12.10 00:00:00-12.15 23:59:59">
                <div className="rule-i">1. 每个赛道各有6轮末尾淘汰，最终每个赛道决出4强。每轮结束，主播荣耀值清零，用户荣耀值年度全程累计。</div>
                <div className="rule-i">2. 若超级冠军-年度最佳主播出现在XX赛道，则第四名主播晋级为XX赛道季军。</div>
                <div className="rule-i">3. 若荣耀值相同，则按照先到先得排名。</div>
                <div className="rule-i">4.赛程如下：</div>
                <div className="e-icon-s e-rule-pic"></div>
                <div className="rule-m-h"></div>
                <div className="rule-i">1. 每轮未淘汰的主播在下一轮进行期间奖励年度特殊推荐标签。<span className="e-icon-s e-rule-pic2"></span></div>
                <div className="rule-i">2. 每个赛道的冠亚季军主播，都将获得“XX冠军”、“XX亚军”、“XX季军”特殊推荐标签。有效期：12.16 00:00:00-12.16 23:59:59。</div>
            </GameRule>
        )
    }
}
