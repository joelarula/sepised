import { createRouter, createWebHashHistory } from 'vue-router'
import Frontend from '../components/Frontend.vue'
import Category from '../components/Category.vue'
import Product from '../components/Product.vue'

const routes = [
    { path: '/', name: 'frontpage', component: Frontend },
    { path: '/:lang', name: 'frontpageLang', component: Frontend },
    { path: '/:lang/:category', name: 'category', component: Category },
    { path: '/:lang/:category/:product', name: 'product', component: Product }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

export default router
