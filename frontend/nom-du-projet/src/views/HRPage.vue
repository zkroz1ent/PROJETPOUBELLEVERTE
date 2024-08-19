<template>
  <div>
    <AppNavbarhome />

    <div class="bg-blue-500 text-white p-4">
      <h1 class="text-3xl font-bold">Bienvenue, RH!</h1>
    </div>

    <!-- Section Ajout d'un nouvel utilisateur -->
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Ajouter un Utilisateur</h2>
      <form @submit.prevent="addUser" class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium">Nom :</label>
          <input v-model="nom" type="text" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium">Email :</label>
          <input v-model="email" type="email" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium">Mot de Passe :</label>
          <input v-model="motDePasse" type="password" class="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label class="block text-gray-700 font-medium">Rôle :</label>
          <select v-model="role" class="w-full p-2 border border-gray-300 rounded">
            <option value="cycliste">Cycliste</option>
            <option value="gestionnaire">Gestionnaire</option>
            <option value="RH">RH</option>
            <option value="administrateur">Administrateur</option>
          </select>
        </div>
        <button type="submit" class="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
          Ajouter Utilisateur
        </button>
      </form>
    </div>

    <!-- Section Liste des utilisateurs -->
    <div class="p-6">
      <h2 class="text-2xl font-semibold mb-4">Liste des Utilisateurs</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full bg-white shadow-md rounded-lg">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-2 px-4 text-left">Nom</th>
              <th class="py-2 px-4 text-left">Email</th>
              <th class="py-2 px-4 text-left">Rôle</th>
              <th class="py-2 px-4 text-left">Statut</th>
              <th class="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b hover:bg-gray-100">
              <td class="py-2 px-4">{{ user.nom }}</td>
              <td class="py-2 px-4">{{ user.email }}</td>
              <td class="py-2 px-4">{{ user.role }}</td>
              <td class="py-2 px-4">
                <span :class="{
                  'text-green-500': user.status === 'actif',
                  'text-yellow-500': user.status === 'maladie',
                  'text-red-500': user.status === 'inactif'
                }">
                  <i class="fas" :class="{
                    'fa-check-circle': user.status === 'actif',
                    'fa-exclamation-triangle': user.status === 'maladie',
                    'fa-ban': user.status === 'inactif'
                  }"></i> {{ user.status }}
                </span>
              </td>
              <td class="py-2 px-4">
                <button @click="deleteUser(user.id)"
                        class="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600 transition duration-200">
                  Supprimer
                </button>
                <button @click="changeStatus(user.id, 'maladie')"
                        class="ml-2 bg-yellow-500 text-white py-1 px-2 rounded hover:bg-yellow-600 transition duration-200">
                  Maladie
                </button>
                <button @click="changeStatus(user.id, 'actif')"
                        class="ml-2 bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition duration-200">
                  Actif
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AppNavbarhome from '@/components/AppNavbar.vue';
import { useToast } from "vue-toastification";

export default {
  components: {
    AppNavbarhome
  },
  data() {
    return {
      nom: '',
      email: '',
      motDePasse: '',
      role: 'cycliste',
      users: []
    };
  },
  async created() {
    await this.fetchUsers();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('http://localhost:3000/utilisateurs');
        this.users = response.data;
      } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
      }
    },
    async addUser() {
      const toast = useToast();
      try {
        await axios.post('http://localhost:3000/utilisateurs', {
          nom: this.nom,
          email: this.email,
          motDePasse: this.motDePasse,
          role: this.role
        });
        toast.success('Utilisateur ajouté avec succès.');
        await this.fetchUsers();
        this.nom = '';
        this.email = '';
        this.motDePasse = '';
        this.role = 'cycliste';
      } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur:', error);
        toast.error('Erreur lors de l\'ajout de l\'utilisateur.');
      }
    },
    async deleteUser(userId) {
      const toast = useToast();
      try {
        await axios.delete(`http://localhost:3000/utilisateurs/${userId}`);
        toast.success('Utilisateur supprimé avec succès.');
        await this.fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        toast.error('Erreur lors de la suppression de l\'utilisateur.');
      }
    },
    async changeStatus(userId, status) {
      const toast = useToast();
      try {
        await axios.put(`http://localhost:3000/utilisateurs/${userId}/status`, { status });
        toast.success(`Statut de l'utilisateur mis à jour en ${status}.`);
        await this.fetchUsers();
      } catch (error) {
        console.error('Erreur lors de la mise à jour du statut de l\'utilisateur:', error);
        toast.error('Erreur lors de la mise à jour du statut de l\'utilisateur.');
      }
    }
  }
}
</script>

<style scoped>
.bg-blue-500 {
  background-color: #3b82f6;
}
.text-white {
  color: white;
}
.p-4 {
  padding: 1rem;
}
.p-6 {
  padding: 1.5rem;
}
.bg-red-500:hover {
  background-color: #ef4444;
}
.bg-red-600 {
  background-color: #dc2626;
}
.bg-yellow-500:hover {
  background-color: #facc15;
}
.bg-yellow-600 {
  background-color: #eab308;
}
.bg-green-500:hover {
  background-color: #10b981;
}
.bg-green-600 {
  background-color: #059669;
}
.mt-2 {
  margin-top: 0.5rem;
}
.py-1 {
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
}
.px-2 {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
}
.rounded {
  border-radius: 0.25rem;
}
.transition {
  transition: all 0.2s ease-in-out;
}
.hover\:bg-gray-100:hover {
  background-color: #f7fafc;
}
.border-b {
  border-bottom: 1px solid #e5e7eb;
}
.text-green-500 {
  color: #10b981;
}
.text-yellow-500 {
  color: #facc15;
}
.text-red-500 {
  color: #ef4444;
}
.fas {
  margin-right: 0.5rem;
}
</style>