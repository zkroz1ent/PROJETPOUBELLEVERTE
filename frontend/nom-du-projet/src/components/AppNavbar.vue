<template>
  <nav class="bg-gray-800 p-2">
    <div class="container mx-auto flex justify-between items-center">
      <div class="text-white font-bold">
        <router-link to="/" class="hover:text-gray-400">Home</router-link>
      </div>
      <ul class="flex space-x-4">
        <li v-if="!isLoggedIn"><router-link to="/login" class="text-white hover:text-gray-400">Login</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/signup" class="text-white hover:text-gray-400">Sign Up</router-link></li>
        <li v-if="isCyclist"><router-link to="/roadmap" class="text-white hover:text-gray-400">Mes Trajets</router-link></li>
        <li v-if="isCyclist"><router-link to="/cycliste-metro-plan" class="text-white hover:text-gray-400">plan carte</router-link></li>

        <li v-if="isNetworkManager || isAdmin"><router-link to="/assign-trajet" class="text-white hover:text-gray-400">Assigner Trajet</router-link></li>
        <li v-if="isNetworkManager"><router-link to="/network-manager" class="text-white hover:text-gray-400">Gestion Réseau</router-link></li>
        <li v-if="isHR"><router-link to="/hr" class="text-white hover:text-gray-400">RH</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin" class="text-white hover:text-gray-400">Admin</router-link></li>
        <li v-if="isAdmin"><router-link to="/admin-metro-plan" class="text-white hover:text-gray-400">metro plan</router-link></li>
      </ul>
      <div v-if="isLoggedIn">
        <button @click="logout" class="text-white hover:text-gray-400">Logout</button>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user != null;
    },
    isCyclist() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.user.role === 'cycliste';
    },
    isNetworkManager() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.user.role === 'gestionnaire';
    },
    isHR() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.user.role === 'RH';
    },
    isAdmin() {
      const user = JSON.parse(localStorage.getItem('user'));
      return user && user.user.role === 'administrateur';
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
nav {
  background-color: #2d3748; /* bg-gray-800 */
}
ul {
  list-style: none;
  display: flex;
  padding: 0;
}
li {
  margin-right: 16px;
}
</style>