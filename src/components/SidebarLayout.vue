<script setup lang="ts">
import { ref, defineProps, defineEmits, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const props = defineProps<{
  title: string
  items: { icon: string; title: string; to: string }[]
}>()

const emit = defineEmits(['logout'])

const drawer = ref(true)
const router = useRouter()
const authStore = useAuthStore()

const userName = computed(() => authStore.user?.name ?? '')
const userRole = computed(() => authStore.user?.role ?? '')
const navigate = (to: string) => {
  router.push(to)
}
</script>

<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>{{ props.title }}</v-toolbar-title>

      <v-spacer />

      <!-- Mostrar usuario y rol -->
      <div class="d-flex align-center mr-4">
        <v-icon class="mr-2">mdi-account-circle</v-icon>
        <div class="text-right">
          <div>{{ userName }}</div>
          <small style="font-size: 0.75rem">{{ userRole }}</small>
        </div>
      </div>

      <!-- Botón de cerrar sesión -->
      <v-btn icon @click="$emit('logout')" title="Cerrar sesión">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      app
      permanent
      clipped
      width="250"
    >
      <v-list dense nav>
        <v-list-item
          v-for="item in props.items"
          :key="item.title"
          @click="navigate(item.to)"
          link
          rounded
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-4">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>
