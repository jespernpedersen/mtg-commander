import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const my_routes = [{
        path: '/mtg-commander/:library',
        params: {
            library: ':id'
        },
        component: () =>
            import ( /* webpackChunkName: "about" */ '@/views/Battlefield.vue')
    },
    {
        path: '/mtg-commander/',
        component: () =>
            import ( /* webpackChunkName: "about" */ '@/views/Start.vue')
    },
    {
        path: '/mtg-commander/:library/hand',
        params: {
            library: ':id'
        },
        component: () =>
            import ( /* webpackChunkName: "about" */ '@/views/Hand.vue')
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: my_routes
})

export default router