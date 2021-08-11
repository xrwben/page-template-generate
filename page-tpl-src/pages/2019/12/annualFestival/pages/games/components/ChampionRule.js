import { PureComponent } from 'react'
import GameRule from './GameRule'

export default class ChampionRule extends PureComponent {
    render () {
        const perName = this.perName
        return (
            <GameRule className="final-rule" onClose={ this.props.onClose } time="活动时间：12.16 00:00:00-12.17 23:59:59">
                <div className="rule-i">1. 5个赛道的冠军主播进行两天的末位淘汰，直至决出超级冠军——年度最佳主播。若荣耀值相同，则按先到先得排名。</div>
                <div className="rule-i">例：若偶像赛道的冠军主播成为年度最佳主播，则偶像赛道的亚军主播自动成为偶像赛道的冠军主播，则偶像赛道的季军主播自动成为偶像赛道的亚军主播，则偶像赛道的第四名主播自动成为偶像赛道的季军主播。</div>
                <div className="rule-i">2. 主播荣耀值次日零点清零，用户贡献荣耀值年度全程累计。</div>
                <div className="rule-m-h"></div>
                <div className="rule-i">1. 获得2019星光年度最佳主播的主播，将在12月18日 00:00 全站飘屏通知。</div>
                <div className="rule-i">2. 超级冠军赛第一名——年度最佳主播，额外奖励1000000{perName}，第二名主播额外奖励800000{perName}，第三名主播额外奖励500000{perName}。</div>
            </GameRule>
        )
    }
}
