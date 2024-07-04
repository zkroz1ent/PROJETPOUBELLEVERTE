<template>
   <AppNavbarhome />
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div :class="['w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md', { 'animate-bounce': isLoggedIn }]">
      <h2 class="text-2xl font-bold text-center">Login</h2>
      <form @submit.prevent="login">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" />
        </div>
        <div class="mt-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" />
        </div>
        <div class="mt-6">
          <button type="submit"
            class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign
            In</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';
import { useToast } from 'vue-toastification';
import AppNavbarhome from '@/components/AppNavbar.vue';

export default {
  data() {
    return {
      email: '',
      password: '',
      isLoggedIn: false,
      toast: useToast(),
    };

  },
  components: {
    AppNavbarhome,

  },

  methods: {
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/utilisateurs/login', {
          email: this.email,
          password: this.password
        });
        const userData = response.data;
        if (userData && userData.user && userData.token) {
          localStorage.setItem('user', JSON.stringify(userData)); // Stocke les données utilisateur
          localStorage.setItem('token', userData.token);
          this.isLoggedIn = true;
          this.toast.success('Login successful!');
          this.redirectUser(userData.user.role);
        } else {
          this.toast.error('Invalid response from server.');
        }
      } catch (error) {
        console.error("Login failed:", error);
        this.toast.error('Login failed.');
      }
    },
    redirectUser(role) {
      setTimeout(() => {
        if (role === 'administrateur') {
          router.push('/admin');
        } else if (role === 'gestionnaire') {
          router.push('/network-manager');
        } else if (role === 'RH') {
          router.push('/hr');
        } else {
          router.push('/cycliste');
        }
      }, 1000);
    }
  }
}
</script>

<style>
@keyframes bounce {

  from,
  20%,
  53%,
  80%,
  to {
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    transform: translate3d(0, -30px, 0);
  }

  70% {
    transform: translate3d(0, -15px, 0);
  }

  90% {
    transform: translate3d(0, -4px, 0);
  }
}

.animate-bounce {
  animation: bounce 1s;
}
</style>