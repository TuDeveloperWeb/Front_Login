<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const dialog = ref(false)
const isEdit = ref(false)
const search = ref('')

interface User {
  id: number | null
  name: string
  email: string
  role: string
  password?: string
}

const form = reactive<User>({
  id: null,
  name: '',
  email: '',
  role: 'student',
  password: ''
})


onMounted(async () => {
  await authStore.fetchUsers()
})

const openCreateModal = () => {
  isEdit.value = false
  form.id = null
  form.name = ''
  form.email = ''
  form.role = 'student'
  form.password = ''
  dialog.value = true
}

const openEditModal = async (user: User) => {
  try {
    isEdit.value = true
    const userDetails = await authStore.getUserById(user.id as number)
    console.log('Detalles del usuario:', userDetails)
    
    form.id = userDetails.user.id
    form.name = userDetails.user.name
    form.email = userDetails.user.email
    form.role = userDetails.user.role
    form.password = '' 
    
    dialog.value = true
  } catch (error) {
    console.error('Error al cargar usuario:', error)
  }
}

const saveUser = async () => {
  try {
    if (isEdit.value && form.id) {
      await authStore.updateUser(
        form.id,
        form.name,
        form.email,
        form.role,
        form.password
      )
    } else {
      if (!form.password) {
        throw new Error('La contraseña es requerida')
      }
      await authStore.createUser(
        form.name,
        form.email,
        form.role,
        form.password
      )
    }
    dialog.value = false
  } catch (error) {
    console.error('Error al guardar usuario:', error)
  }
}

const deleteUser = async (id: number) => {
  if (confirm('¿Estás seguro de eliminar este usuario?')) {
    try {
      await authStore.deleteUser(id)
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
    }
  }
}

const searchUsers = async () => {
  await authStore.fetchUsers(search.value)
}
</script>

<template>
  <v-container>
    <v-row class="justify-space-between align-center mb-4">
      <v-col>
        <h2>Gestión de Usuarios</h2>
      </v-col>
      <v-col class="text-right">
        <v-btn color="primary" @click="openCreateModal">
          Crear Usuario
        </v-btn>
      </v-col>
    </v-row>

    <v-text-field
      v-model="search"
      label="Buscar usuarios"
      append-inner-icon="mdi-magnify"
      @click:append-inner="searchUsers"
      @keyup.enter="searchUsers"
      class="mb-4"
    ></v-text-field>

    <v-data-table
      :headers="[
        { title: 'Nombre', key: 'name' },
        { title: 'Correo', key: 'email' },
        { title: 'Rol', key: 'role' },
        { title: 'Acciones', key: 'actions', sortable: false },
      ]"
      :items="authStore.users"
      class="elevation-1"
    >
      <template #item.role="{ item }">
        <v-chip :color="item.role === 'admin' ? 'primary' : 'success'">
          {{ item.role === 'admin' ? 'Administrador' : 'Estudiante' }}
        </v-chip>
      </template>
      <template #item.actions="{ item }">
        <v-btn icon @click="openEditModal(item)" color="info">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="deleteUser(item.id)" color="error" class="ml-2">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ isEdit ? 'Editar Usuario' : 'Crear Usuario' }}</v-card-title>
        <v-card-text>
          <v-text-field 
            v-model="form.name" 
            label="Nombre" 
            required
          />
          <v-text-field 
            v-model="form.email" 
            label="Correo Electrónico" 
            type="email"
            required
          />
          <v-text-field
            v-model="form.password"
            label="Contraseña"
            type="password"
            :rules="[value => !isEdit || value.length >= 6 || 'Mínimo 6 caracteres']"
            :required="!isEdit"
          />
          <v-select
            v-model="form.role"
            :items="[
              { text: 'Administrador', value: 'admin' },
              { text: 'Estudiante', value: 'student' }
            ]"
            label="Rol"
            item-title="text"
            item-value="value"
            required
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="primary" @click="saveUser">
            {{ isEdit ? 'Actualizar' : 'Crear' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>