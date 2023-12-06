import { createRouter, createWebHistory } from 'vue-router'
import { importFiles } from '@/utils/common.js'
/* Layout */
const LAYOUT = () => import('@/components/Layout')

const asyncRoutes = importFiles(require.context('./modules', true, /\.js$/))

const routes = [
    {
        path: '/',
        name: 'Dashboard',
        redirect: '/dashboard',
        meta: {
            title: 'menu.dashboard',
        },
        component: LAYOUT,
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                meta: {
                    title: 'menu.dashboard',
                    accountTopbarShow: false, // 是否展示面包屑
                },
                component: () => import('@/views/dashboard/index.vue')
            }
        ]
    },
    {
        path: '/404',
        name: '404',
        meta: {
            title: '404'
        },
        component: () => import('@/views/error/404.vue')
    },
    ...asyncRoutes,
    { path: '/:pathMatch(.*)', redirect: '/404', hidden: true },
]
// process.env.BASE_URL
const router = createRouter({
    history: createWebHistory(),
    routes
})
// 路由守卫
router.beforeEach(async (to, from, next) => {
    next()
})
export default router
