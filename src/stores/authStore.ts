// src/stores/auth.ts
import { defineStore } from 'pinia'
import { axiosApi } from '@/services/axiosApi'
import router from '@/router'

interface User {
  id: number | null
  name: string
  email: string
  role: string
  password?: string
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    users: [] as User[],
  }),

  actions: {
    async fetchCurrentUser() {
      try {
        const res = await axiosApi.get('/api/user')
        this.user = res.data
      } catch (error) {
        console.error('Error fetching current user:', error)
        throw error
      }
    },

    async login(email: string, password: string) {
      try {
        await axiosApi.get('/sanctum/csrf-cookie', {
          withCredentials: true
        });
        const response = await axiosApi.post('/login', {
          email: email,  
          password: password
        });
        this.user = response.data.user;
        if (this.user?.role === 'admin') {
          router.push('/admin/dashboard');
        } else if (this.user?.role === 'student') {
          router.push('/student/dashboard');
        }

        return response.data;

      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    async logout() {
      await axiosApi.post('/logout')
      this.user = null
      router.push('/login')
    },

    async fetchUsers(search = '') {
      try {
        const response = await axiosApi.get('/admin/users', {
          params: { search }
        })
        this.users = response.data
        return response.data
      } catch (error) {
        console.error('Error al obtener usuarios:', error)
        throw error
      }
    },

    async createUser(name: string, email: string, role: string, password: string) {
      try {
        const response = await axiosApi.post('/admin/users/create', {
          name,
          email,
          role,
          password
        })
        console.log('Usuario creado:', response.data);
        
        await this.fetchUsers() // Refrescar la lista
        return response.data
      } catch (error) {
        console.error('Error al crear usuario:', error)
        throw error
      }
    },

    async updateUser(id: number, name: string, email: string, role: string, password?: string) {
      try {
        const response = await axiosApi.post(`/admin/users/update/${id}`, {
          name,
          email,
          role,
          password
        })
        await this.fetchUsers() 
        alert('Usuario actualizado correctamente');
        return response.data
      } catch (error) {
        console.error('Error al actualizar usuario:', error)
        throw error
      }
    },

    async deleteUser(id: number) {
      try {
        const response = await axiosApi.delete(`/admin/users/delete/${id}`)
        await this.fetchUsers() // Refrescar la lista
        return response.data
      } catch (error) {
        console.error('Error al eliminar usuario:', error)
        throw error
      }
    },

    async getUserById(id: number) {
      try {
        const response = await axiosApi.get(`/admin/users/${id}`)
        return response.data
      } catch (error) {
        console.error('Error al obtener usuario:', error)
        throw error
      }
    }
  }
})