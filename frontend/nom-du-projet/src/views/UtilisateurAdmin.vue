<template>
    <div class="container mx-auto">
      <h1 class="text-3xl font-bold mb-4">Gestion des Utilisateurs</h1>
      
      <form @submit.prevent="createOrUpdateUtilisateur">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Nom</label>
          <input v-model="utilisateur.nom" class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <input v-model="utilisateur.email" class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Rôle</label>
          <select v-model="utilisateur.role" class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="cycliste">Cycliste</option>
            <option value="gestionnaire">Gestionnaire</option>
            <option value="RH">RH</option>
            <option value="administrateur">Administrateur</option>
          </select>
        </div>
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700">Mot de passe</label>
          <input v-model="utilisateur.password" type="password" class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>
        <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none">
          {{ editMode ? 'Mettre à jour' : 'Créer' }} Utilisateur
        </button>
      </form>
  
      <h2 class="text-2xl font-bold mt-8 mb-4">Liste des Utilisateurs</h2>
      <ul>
        <li v-for="utilisateur in utilisateurs" :key="utilisateur.id">
          {{ utilisateur.nom }} - {{ utilisateur.role }}
          <button @click="editUser(utilisateur)" class="ml-4 text-blue-600">Modifier</button>
          <button @click="deleteUser(utilisateur.id)" class="ml-4 text-red-600">Supprimer</button>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { mapGetters, mapActions } from 'vuex';
  
  export default {
    name: 'UtilisateurAdmin',
    data() {
      return {
        utilisateur: {
          id: null,
          nom: '',
          email: '',
          role: 'cycliste',
          password: ''
        },
        editMode: false
      };
    },
    computed: {
      ...mapGetters(['utilisateurs'])
    },
    methods: {
      ...mapActions(['fetchUtilisateurs', 'createUtilisateur', 'updateUtilisateur', 'deleteUtilisateur']),
      async createOrUpdateUtilisateur() {
        if (this.editMode) {
          await this.updateUtilisateur(this.utilisateur);
        } else {
          await this.createUtilisateur(this.utilisateur);
        }
        this.resetForm();
        this.editMode = false;
      },
      editUser(user) {
        this.utilisateur = { ...user, password: '' };
        this.editMode = true;
      },
      async deleteUser(userId) {
        await this.deleteUtilisateur(userId);
      },
      resetForm() {
        this.utilisateur = { id: null, nom: '', email: '', role: 'cycliste', password: '' };
        this.editMode = false;
      }
    },
    async created() {
      this.fetchUtilisateurs();
    }
  };
  </script>
  
  <style scoped>
  /* Ajoutez des styles pour Tailwind CSS */
  </style>