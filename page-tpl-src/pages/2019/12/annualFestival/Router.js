/**
 * 页面 hash-router
 */
import { PureComponent, Component } from 'react'
import $loading from './plugins/loading'

class RouterComponent extends PureComponent {
    constructor (props) {
        super(props)

        console.log('Router constructor -->')

        this.state = {
            spath: ''
        }

        this.lock = 0

        this.RouterView = null

        this.toRender = (rv) => {
            if (rv) {
                this.RouterView = rv
            }
            // 触发重新渲染
            this.setState({
                spath: this.$router.getHashRoute()
            })
        }

        /* 开启hash变化监听 */
        if (!this._router.watcherInited) {
            if (!('onhashchange' in window)) {
                throw new Error('不支持 onhashchange 事件')
            }
            window.addEventListener('hashchange', () => this.refresh())

            this._router.watcherInited = true
        }

        // -> 是否在初始化时加载对应的路由
        // this.refresh()
    }

    /* onhashchange */
    refresh () {
        const { routes } = this._router
        const spath = this.$router.getHashRoute()
        const target = routes[spath]

        /* 通过闭包 来记录上一次锁值 */
        const lock = Date.now()

        this.lock = lock // 最新锁值

        target && console.log('$router refresh', target.name)

        // 确认 component 配置存在
        if (target && target.component) {
            // if (!target.isCached) {
            //     // component => Promise 远程加载
            //     $loading.show()
            //     target.component().then((com) => {
            //         $loading.hide()
            //         target.isCached = true
            //         this.toRender(com.default)
            //     })
            // } else {
            //     // component => 已经加载过了
            //     // this.toRender(target.component)
            //     console.log('already loaded')
            //     target.component().then((com) => {
            //         this.toRender(com.default)
            //     })
            // }

            $loading.show()
            target.component().then((com) => {
                $loading.hide()

                if (lock === this.lock) {
                    this.toRender(com.default)
                }
            })
        }
    }

    removePrevRV () {
        this.setState({
            PrevRV: null
        })
    }

    // rChangeTranstion () {
    //     // 前一个tab离开
    //     if (this.$prevRv.current) {
    //         const $prev = this.$prevRv.current

    //         $prev.style.transition = 'transform linear 200ms'

    //         setTimeout(() => {
    //             $prev.className += ' leave'
    //         }, this.transitionDelay)
    //     }
    //     // 当前tab进入
    //     if (this.$currRv.current) {
    //         const $curr = this.$currRv.current

    //         $curr.className += ' enter'
    //         $curr.style.transition = 'transform linear 200ms'

    //         setTimeout(() => {
    //             $curr.className = $curr.className.replace(' enter', '')
    //         }, this.transitionDelay)
    //     }
    // }

    // prevTransEnd () {
    //     console.log('leave end')
    //     this.removePrevRV()
    // }

    // currTransEnd () {
    //     console.log('enter end')
    // }

    render () {
        // 每次内部渲染时 -> 动效
        return (
            <div className="router" data-showpath={ this.state.spath }>
                {/* 进出场动效 -> 需要把前一个 和 后一个 同时显示 */}
                {/* { this.state.PrevRV && <div className="rv-wrap prev-rv-wrap" ref={ this.$prevRv } onTransitionEnd={ () => this.prevTransEnd() }><this.state.PrevRV /></div> }
                { this.state.CurrRV && <div className="rv-wrap curr-rv-wrap" ref={ this.$currRv } onTransitionEnd={ () => this.currTransEnd() }><this.state.CurrRV /></div> } */}
                {/* ** 无需动效 ** */}
                { this.RouterView && <this.RouterView proxy={ this.props.proxy } /> }
            </div>
        )
    }
}

const Router = (function () {
    // 闭包保存变量
    const _router = {
        routes: null,
        isInited: false,
        watcherInited: false
    }

    const _routerFn = {
        go (path) {
            if (!(path in _router.routes)) {
                console.log(new Error('can not find spec path'))
                return null
            }

            console.log('$router go', path)

            window.location.hash = '#' + path
        },
        getHashRoute () {
            return location.hash.slice(1)
        },
        reset () {
            window.location.hash = '#'
        }
    }

    return function Router (routes) {
        if (_router.isInited) {
            throw new Error('一个web应用只能拥有一个router管理器')
        }
        _router.routes = routes
        _router.isInited = true

        /* 局部闭包参数 */
        RouterComponent.prototype._router = _router

        /* 全局暴露 */
        Component.prototype.$router = _routerFn

        return RouterComponent
    }
})()

export default Router
