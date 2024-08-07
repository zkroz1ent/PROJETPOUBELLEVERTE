<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
      <h2 class="text-2xl font-bold text-center">Sign Up</h2>
      <form @submit.prevent="signUp">
        <div>
          <label for="nom" class="block text-sm font-medium text-gray-700">Nom</label>
          <input v-model="nom" type="text" required
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" />
        </div>
        <div>
          <label for="prenom" class="block text-sm font-medium text-gray-700">Prenom</label>
          <input v-model="prenom" type="text" required
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" />
        </div>
        <div class="mt-4">
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="email" type="email" required
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" />
        </div>
        <div class="mt-4">
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <input v-model="password" type="password" required
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200" />
        </div>
        <div class="mt-4">
          <label for="role" class="block text-sm font-medium text-gray-700">Rôle</label>
          <select v-model="role" required
            class="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:ring-indigo-200">
            <option value="cycliste">Cycliste</option>
            <option value="gestionnaire">Gestionnaire</option>
            <option value="RH">RH</option>
            <option value="administrateur">Administrateur</option>
          </select>
        </div>
        <div class="mt-6">
          <button type="submit"
            class="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Sign
            Up</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import router from '../router';

export default {
  data() {
    return {
      nom: '',
      email: '',
      password: '',
      role: 'cycliste'
    };
  },
  methods: {
    async signUp() {
      try {
        await axios.post('http://localhost:3000/utilisateurs/register', {
          prenom: this.prenom,
          nom: this.nom,
          email: this.email,
          password: this.password,
          role: this.role
        });
        alert('Registration successful! Please log in.');
        router.push('/login');
      } catch (error) {
        console.error("Sign Up failed:", error);
        alert("Registration failed. Please try again.");
      }
    }
  }
};
</script>