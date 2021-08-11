import { PureComponent } from 'react' //
import './PageBg.less'

/**
 * 背景图组件
 */
export default class PageBg extends PureComponent {
    calcH (h) {
        if (this.props.pageType === 'pc') {
            return h + 'px'
        }

        return h / this.props.pageRatio + 'rem'
    }

    render () {
        return (
            <div className="page-bgs">
                {
                    this.props.bgs.map((bg, ind) => {
                        return (
                            <div
                                className={'page-bg bg-' + ind}
                                style={{
                                    backgroundImage: `url(${bg.image})`,
                                    height: this.calcH(bg.height)
                                }}
                                key={'bg_' + ind} />
                        )
                    })
                }
            </div>
        )
    }
}
