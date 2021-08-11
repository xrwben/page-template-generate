import { PureComponent } from 'react'
import GameRule from './GameRule'

export default class PreRule extends PureComponent {
    render () {
        return (
            <GameRule className="per-rule" onClose={ this.props.onClose } time="活动时间：12.4  12:00:00-12.7 23:59:59">
                <div className="rule-i">1. 平台所有主播无需报名，即可参赛。</div>
                <div className="rule-i">2. 按主播累计荣耀值排名，最终前100名主播进入单项赛。若荣耀值相同，则按先到先得排名。预选赛结束后，主播荣耀值清零，用户贡献荣耀值年度全程累计。</div>
                <div className="rule-i">3. 2019年度人气冠军N（ID：1863709）与2019年度娱乐冠军瑾辰辰（ID：77777777）直接进入单项赛，享有预选赛免赛权。（两位主播不占100名晋级名额）</div>
                <div className="rule-m-h"></div>
                <div className="rule-i">1. 日榜的前五名主播奖励荣耀值，每日23:59:59结算。自动算入主播次日日榜，以及预选赛榜。12月7日日榜奖励荣耀值仅记录在预选赛榜。奖励的荣耀值不计算主播收益，仅计入排行榜。</div>
                <div className="rule-table">
                    <div className="tr fl-box">
                        <div className="td">日榜名次</div>
                        <div className="td">第1名</div>
                        <div className="td">第2名</div>
                        <div className="td">第3名</div>
                        <div className="td">第4、5名</div>
                    </div>
                    <div className="tr fl-box">
                        <div className="td">奖励荣耀值</div>
                        <div className="td">20000</div>
                        <div className="td">15000</div>
                        <div className="td">10000</div>
                        <div className="td">5000</div>
                    </div>
                </div>
                <div className="rule-i">2. 每日的前100强主播次日24小时奖励年度特殊推荐标签。<span className="pre-s icon-l100"></span>最终晋级单项赛的100位主播，推荐标签有效期：12月9日 00:00:00-12月10日 23:59:59</div>
            </GameRule>
        )
    }
}
