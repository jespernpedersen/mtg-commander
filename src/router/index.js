import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const my_routes = [{
        path: '/:library',
        params: {
            library: ':id'
        },
        component: () =>
            import ( /* webpackChunkName: "about" */ '@/views/Battlefield.vue')
    },
    {
        path: '/',
        component: () =>
            import ( /* webpackChunkName: "about" */ '@/views/Start.vue')
    },
    {
        path: '/:library/hand',
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