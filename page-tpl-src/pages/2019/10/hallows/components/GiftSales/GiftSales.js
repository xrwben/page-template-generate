import { PureComponent } from 'react'

import ambor from '../../mobile/images/ambor.png'
import ghPic from '../../mobile/images/gh.png'
import $svgPlayer from '../../plugins/svgPlayer'

export default class GiftSales extends PureComponent {
    preview () {
        $svgPlayer.play('//static.guojiang.tv/app/gift/pc_animation/4915/data.json')
    }

    render () {
        return (
            <div className="gift-sales fl-box">
                <div className="gift-i">
                    <div className="gift-pic icon-s g-bg">
                        <img className="pic" src={ ambor } alt="一起鬼混（万圣限定）" />
                    </div>
                    <div className="name">活动大使：瑾辰辰</div>
                    <div className="opt fl-box">
                        <div
                            className="butn btn-s btn-goroom"
                            onClick={ () => this.goRoom(this.props.ambsor) } >进入直播间</div>
                        <div
                            className={ 'butn btn-s btn-atte' + ((this.props.ambsor.isLoved || String(this.props.ambsor.mid) === this.Cookie.uid) ? '-dis' : '') }
                            onClick={ () => String(this.props.ambsor.mid) !== this.Cookie.uid && this.props.onAtte(this.props.ambsor) } >关注</div>
                    </div>
                </div>
                <div className="gift-i">
                    <div className="gift-pic icon-s g-bg">
                        <span className="icon-s g-badge"></span>
                        <img className="pic" src={ ghPic } alt="一起鬼混（万圣限定）" />
                    </div>
                    <div className="name">一起鬼混&nbsp;&nbsp;&nbsp;&nbsp;9999{ this.perName }/个</div>
                    <div className="opt fl-box">
                        <div className="butn btn-s btn-pv" onClick={ this.preview }>预览</div>
                        <div className={ 'butn btn-s btn-buy' + (this.props.stage >= 3 ? '-dis' : '') } onClick={ this.props.onGoBuy }>购买</div>
                    </div>
                </div>
            </div>
        )
    }
}
