import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/chat/community',
    name: 'Community Chat',
    component: () => import('../views/Community.vue')
  },
  {
    path: '/aragon',
    name: 'Aragon',
    component: () => import('../views/Aragon.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
