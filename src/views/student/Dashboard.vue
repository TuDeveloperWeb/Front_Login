<script setup lang="ts">
import SidebarLayout from '@/components/SidebarLayout.vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const items = [
  { icon: 'mdi-home', title: 'Inicio', to: '/student/dashboard' },
  { icon: 'mdi-book-open-page-variant', title: 'Mis Cursos', to: '/student/courses' },
  { icon: 'mdi-account', title: 'Perfil', to: '/student/profile' }
]

const logout = async () => {
  await authStore.logout()
}
</script>

<template>
  <SidebarLayout :title="'Panel Estudiante'" :items="items" @logout="logout">
    <h1 class="text-h4 font-weight-bold">Bienvenido al Panel de Estudiante</h1>

  </SidebarLayout>
</template>
