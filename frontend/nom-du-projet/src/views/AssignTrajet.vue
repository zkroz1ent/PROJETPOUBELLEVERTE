<template>
  <div>
    <div class="container mx-auto my-8 p-8 bg-white rounded shadow-md">
      <h2 class="text-2xl font-semibold mb-4">Assigner Trajet</h2>
      <form @submit.prevent="createTrajet">
        <div>
          <label for="cycliste">Cycliste:</label>
          <select v-model="newTrajet.cyclisteId">
            <option value="" disabled>Sélectionner un cycliste</option>
            <option v-for="cycliste in cyclistes" :key="cycliste.id" :value="cycliste.id">
              {{ cycliste.nom }} {{ cycliste.prenom }}
            </option>
          </select>
        </div>
        <div>
          <label for="rueDepart">Rue de Départ:</label>
          <select v-model="selectedRueDepart" @change="filterArretsDepart">
            <option value="" disabled>Sélectionner une rue</option>
            <option v-for="rue in rues" :key="rue" :value="rue">{{ rue }}</option>
          </select>
          <label for="depart">Arrêt de Départ:</label>
          <select v-model="newTrajet.depart">
            <option value="" disabled>Sélectionner un arrêt</option>
            <option v-for="arret in filteredArretsDepart" :key="arret.id" :value="arret.id">
              {{ arret.nom }}
            </option>
          </select>
        </div>
        <div>
          <label for="rueArrivee">Rue d'Arrivée:</label>
          <select v-model="selectedRueArrivee" @change="filterArretsArrivee">
            <option value="" disabled>Sélectionner une rue</option>
            <option v-for="rue in rues" :key="rue" :value="rue">{{ rue }}</option>
          </select>
          <label for="arrivee">Arrêt d'Arrivée:</label>
          <select v-model="newTrajet.arrivee">
            <option value="" disabled>Sélectionner un arrêt</option>
            <option v-for="arret in filteredArretsArrivee" :key="arret.id" :value="arret.id">
              {{ arret.nom }}
            </option>
          </select>
        </div>
        <div>
          <label for="heure_debut">Heure de Début:</label>
          <input type="datetime-local" v-model="newTrajet.heure_debut" />
        </div>
        <button type="submit">Créer Trajet</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AppNavbar from '@/components/AppNavbar.vue';

export default {
  components: {
        /* eslint-disable */
    AppNavbar
  },
  data() {
    return {
      cyclistes: [],
      arrets: [],
      rues: [],
      selectedRueDepart: '',
      selectedRueArrivee: '',
      filteredArretsDepart: [],
      filteredArretsArrivee: [],
      newTrajet: {
        cyclisteId: '',
        heure_debut: '',
        depart: '',
        arrivee: ''
      }
    };
  },
  mounted() {
    this.fetchCyclistes();
    this.fetchArrets();
  },
  methods: {
    async fetchCyclistes() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3000/cyclistes', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          this.cyclistes = response.data;
          console.log('Cyclistes:', this.cyclistes); // Debugging log
        } else {
          throw new Error(`Failed to fetch cyclistes: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching cyclistes:', error);
      }
    },
    async fetchArrets() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:3000/arrets', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          this.arrets = response.data;
          this.rues = [...new Set(this.arrets.map(arret => arret.rueid))];
          console.log('Arrets:', this.arrets); // Debugging log
          console.log('Rues:', this.rues); // Debugging log
        } else {
          throw new Error(`Failed to fetch arrets: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching arrets:', error);
      }
    },
    filterArretsDepart() {
      this.filteredArretsDepart = this.arrets.filter(arret => arret.rueid === this.selectedRueDepart);
      console.log('Filtered Arrets Depart:', this.filteredArretsDepart); // Debugging log
    },
    filterArretsArrivee() {
      this.filteredArretsArrivee = this.arrets.filter(arret => arret.rueid === this.selectedRueArrivee);
      console.log('Filtered Arrets Arrivee:', this.filteredArretsArrivee); // Debugging log
    },
    async createTrajet() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.post('http://localhost:3000/trajets', this.newTrajet, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 201) {
          alert('Trajet créé avec succès');
        } else {
          alert('Erreur lors de la création du trajet');
        }
      } catch (error) {
        console.error('Erreur lors de la création du trajet:', error);
      }
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
