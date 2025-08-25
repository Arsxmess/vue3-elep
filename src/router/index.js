import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue' 

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/group-management',
    name: 'GroupManagement',
    component: () => import('../pages/group-management.vue') 
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router