<template>
  <SidebarLayout
    title="Panel Administrador"
    :items="items"
    @logout="logout"
  >
    <router-view />
  </SidebarLayout>
</template>

<script setup lang="ts">
import SidebarLayout from '@/components/SidebarLayout.vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const items = [
  { icon: 'mdi-home', title: 'Inicio', to: '/admin/dashboard' },
  { icon: 'mdi-account-group', title: 'Usuarios', to: '/admin/users' }
]

const logout = async () => {
    console.log('Cerrando sesión...')
  await authStore.logout()
}
</script>
