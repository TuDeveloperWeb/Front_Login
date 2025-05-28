<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4">
            <v-card class="elevation-12">
              <v-toolbar color="primary" dark flat>
                <v-toolbar-title>Iniciar Sesión</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-icon>mdi-account</v-icon>
              </v-toolbar>

              <v-card-text>
                <!-- Mostrar mensaje de error general -->
                <v-alert
                  v-if="error"
                  type="error"
                  class="mb-4"
                >
                  {{ error }}
                </v-alert>

                <v-form ref="form" @submit.prevent="handleLogin">
                  <v-text-field
                    v-model="email"
                    label="Correo Electrónico"
                    prepend-icon="mdi-email"
                    type="email"
                    required
                    :rules="emailRules"
                    :disabled="loading"
                  ></v-text-field>

                  <v-text-field
                    v-model="password"
                    label="Contraseña"
                    prepend-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    :rules="passwordRules"
                    :disabled="loading"
                    @click:append-inner="showPassword = !showPassword"
                  ></v-text-field>

                  <div class="text-center mt-4">
                    <v-btn 
                      color="primary" 
                      type="submit"
                      :loading="loading"
                      block
                      :disabled="loading"
                    >
                      Ingresar
                    </v-btn>
                  </div>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import type { VForm } from 'vuetify/components'

const router = useRouter()
const authStore = useAuthStore()
const form = ref<VForm | null>(null)
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const emailRules = [
  (v: string) => !!v || 'El correo es requerido',
  (v: string) => /.+@.+\..+/.test(v) || 'El correo debe ser válido'
]

const passwordRules = [
  (v: string) => !!v || 'La contraseña es requerida',
  (v: string) => (v && v.length >= 6) || 'La contraseña debe tener al menos 6 caracteres'
]

const handleLogin = async () => {
  error.value = '';
  const { valid } = await form.value?.validate();
  if (!valid) return;

  loading.value = true;
  
  try {
    await authStore.login(email.value, password.value);

  } catch (err: any) {
    error.value = err.response?.data?.message || 'Credenciales incorrectas';
    
    if (err.response?.status === 419) {
      error.value = 'Error de sesión. Por favor, recarga la página.';
    }
  } finally {
    loading.value = false;
  }
  };
</script>

<style scoped>
/* Tus estilos actuales están bien */
</style>