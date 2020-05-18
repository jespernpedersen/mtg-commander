import Vue from 'vue'
import App from '@/App.vue'

// Vuetify
import Vuetify from 'vuetify'
import './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'

// Unicons
import Unicon from 'vue-unicons'
import { uniAngleDown } from 'vue-unicons/src/icons'

Unicon.add([uniAngleDown])
Vue.use(Unicon)

// Routing
import router from '@/router'

Vue.use(Vuetify, {
    iconfont: 'fa4'
})

// Firebase
import VueFirestore from 'vue-firestore';
Vue.use(VueFirestore);

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')