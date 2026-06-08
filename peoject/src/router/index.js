import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isLoggedIn = localStorage.getItem('user')
  
  if (to.path === '/') {
    if (isLoggedIn) {
      next('/home')
    } else {
      next()
    }
  } else {
    if (isLoggedIn) {
      next()
    } else {
      next('/')
    }
  }
})

export default router