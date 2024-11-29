<template>
  <div>
    <!-- Header Section -->
    <AppNavbarhome />

    <div class="bg-blue-500 text-white p-4">
      <h1 class="text-3xl">Bienvenue, Admin !</h1>
    </div>
    <!-- Body Section with a list of Non-Desservable Arrets -->
    <div class="p-6">
      <h2 class="text-2xl mb-4">Arrêts Non Desservis</h2>
      <div class="min-w-full overflow-x-auto shadow-md sm:rounded-lg">
        <table class="min-w-full bg-white rounded">
          <thead class="bg-gray-200">
            <tr>
              <th class="py-2 px-4 text-left">Nom de l'Arrêt</th>
              <th class="py-2 px-4 text-left">Rue</th>
              <th class="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="arret in arretsNonDesservis" :key="arret.id" class="border-b hover:bg-gray-100">
              <td class="py-2 px-4">{{ arret.nom }}</td>
              <td class="py-2 px-4">{{ arret.RueAssoc.name }}</td>
              <td class="py-2 px-4">
                <button @click="reEnableArret(arret.id)"
                  class="bg-green-500 text-white py-1 px-2 rounded hover:bg-green-600 transition duration-200">
                  Rendre Desservable
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
import { useToast } from "vue-toastification"; // Importation du hook de toastification
import AppNavbarhome from '@/components/AppNavbar.vue';

export default {
  components: {
    AppNavbarhome,
  },
  name: 'AdminPage',
  data() {
    return {
      arretsNonDesservis: []
    };
  },
  async created() {
    await this.fetchNonDesservisArrets();
  },
  methods: {
    async fetchNonDesservisArrets() {
      try {
        const response = await axios.get('http://localhost:3000/arrets/non-desservis/non-desservis/');

        this.arretsNonDesservis = response.data;
        console.log(response);
      } catch (error) {
        console.error('Erreur lors de la récupération des arrêts non desservis:', error);
      }
    },
    async reEnableArret(arretId) {
      const toast = useToast(); // Utilisation du hook de toastification
      try {
        await axios.put(`http://localhost:3000/arrets/${arretId}/desservable/desservable`, { desservable: true });
        toast.success('L\'arrêt a été rendu desservable.');
        this.fetchNonDesservisArrets(); // Raffraichir la liste
      } catch (error) {
        console.error('Erreur lors de la mise à jour de l\'arrêt:', error);
        toast.error('Erreur lors de la mise à jour de l\'arrêt.');
      }
    }
  }
}
</script>

<style scoped>
.bg-gray-200 {
  background-color: #e2e8f0;
}

.hover\:bg-gray-100:hover {
  background-color: #f7fafc;
}

.border-b {
  border-bottom: 1px solid #e5e7eb;
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
</style>