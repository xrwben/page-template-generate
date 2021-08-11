import Vue from 'vue'
import VueRouter from 'vue-router'

const Reward = () => import(/* webpackChunkName: "reward" */'./components/Reward.vue')
const Competition = () => import(/* webpackChunkName: "competition" */'./components/Competition.vue')
const User = () => import(/* webpackChunkName: "user" */'./components/User.vue')
const Hi = () => import(/* webpackChunkName: "Hi" */'./components/Hi.vue')

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/reward',
            component: Reward
        },
        {
            path: '/competition',
            component: Competition
        },
        {
            path: '/user',
            component: User
        },
        {
            path: '/hi',
            component: Hi
        }
    ]
})

export default router
