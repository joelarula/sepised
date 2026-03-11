import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Portfolio from '../pages/Portfolio.vue'
import Contact from '../pages/Contact.vue'
import Product from '../components/Product.vue'

const routes = [
    { path: '/', redirect: '/et' },
    { path: '/:lang', name: 'home', component: Home },
    { path: '/:lang/portfolio', name: 'portfolio', component: Portfolio },
    { path: '/:lang/contact', name: 'contact', component: Contact },
    { path: '/:lang/portfolio/:category/:product', name: 'product', component: Product }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
    scrollBehavior() {
        return { top: 0 }
    }
})

export default router
