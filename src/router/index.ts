import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/auth/Login.vue'
import StudentDashboard from '@/views/student/Dashboard.vue' // layout student con sidebar
import AdminDashboard from '@/views/admin/Dashboard.vue' // layout admin con sidebar

import AdminUsers from '@/views/admin/AdminUser.vue'

import { useAuthStore } from '@/stores/authStore'

const routes = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/admin',
    component: AdminDashboard, // Layout admin con sidebar
    meta: { requiresAuth: true, role: 'admin' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/admin/Home.vue'), // contenido home admin
        meta: { requiresAuth: true, role: 'admin' }
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: AdminUsers,
        meta: { requiresAuth: true, role: 'admin' }
      }
    ]
  },
  {
    path: '/student',
    component: StudentDashboard, // Layout student con sidebar
    meta: { requiresAuth: true, role: 'student' },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/student/Dashboard.vue'), // contenido home student
        meta: { requiresAuth: true, role: 'student' }
      }
      // Aquí más rutas hijas de student
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth) {
    if (!auth.user) {
      return next('/login')
    }

    if (to.meta.role && auth.user.role !== to.meta.role) {
      return next(auth.user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard')
    }
  }

  next()
})

export default router
