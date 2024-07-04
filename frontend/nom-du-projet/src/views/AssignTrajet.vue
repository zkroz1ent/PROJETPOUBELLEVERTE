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
            <option v-for="rue in rues" :key="rue.id" :value="rue.id">{{ rue.name }}</option>
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
            <option v-for="rue in rues" :key="rue.id" :value="rue.id">{{ rue.name }}</option>
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

export default {
  data() {
    return {
      cyclistes: [],
      rues: [],
      arrets: [],
      selectedRueDepart: '',
      selectedRueArrivee: '',
      filteredArretsDepart: [],
      filteredArretsArrivee: [],
      newTrajet: {
        cyclisteId: '',      // Assurez-vous que l'ID du cycliste est sélectionné
        heure_debut: '',     // Assurez-vous que l'heure de début est définie
        depart: '',          // Assurez-vous que l'arrêt de départ est sélectionné
        arrivee: ''          // Assurez-vous que l'arrêt d'arrivée est sélectionné
      }
    };
  },
  mounted() {
    this.fetchCyclistes();
    this.fetchRues();
    this.fetchArrets();
  },
  methods: {
    async fetchCyclistes() {
      try {
        const response = await axios.get('http://localhost:3000/cyclistes');
        this.cyclistes = response.data;
        console.log('Cyclistes:', this.cyclistes);
      } catch (error) {
        console.error('Error fetching cyclistes:', error);
      }
    },
    async fetchRues() {
      try {
        const response = await axios.get('http://localhost:3000/rues');
        this.rues = response.data;
        console.log('Rues:', this.rues);
      } catch (error) {
        console.error('Error fetching rues:', error);
      }
    },
    async fetchArrets() {
      try {
        const response = await axios.get('http://localhost:3000/arrets');
        this.arrets = response.data;
        console.log('Arrets:', this.arrets);
      } catch (error) {
        console.error('Error fetching arrets:', error);
      }
    },
    filterArretsDepart() {
      console.log('Selected Rue Depart:', this.selectedRueDepart);
      console.log('All Arrets:', this.arrets);
      if (!this.selectedRueDepart) {
        console.error('No rue depart selected');
        return;
      }
      this.filteredArretsDepart = this.arrets.filter(arret => {
        console.log(`Comparing arret:`, arret);  // Ajout d'un log pour afficher chaque arrêt
        return arret.rueId == this.selectedRueDepart;  // Assurez-vous que la capitalisation est correcte
      });
      if (this.filteredArretsDepart.length === 0) {
        console.warn('No matching arrets found');
      }
      console.log('Filtered Arrets Depart:', this.filteredArretsDepart);
    },
    filterArretsArrivee() {
      console.log('Selected Rue Arrivee:', this.selectedRueArrivee);
      console.log('All Arrets:', this.arrets);
      if (!this.selectedRueArrivee) {
        console.error('No rue arrivee selected');
        return;
      }
      this.filteredArretsArrivee = this.arrets.filter(arret => {
        console.log(`Comparing arret:`, arret);  // Ajout d'un log pour afficher chaque arrêt
        return arret.rueId == this.selectedRueArrivee;  // Assurez-vous que la capitalisation est correcte
      });
      if (this.filteredArretsArrivee.length === 0) {
        console.warn('No matching arrets found');
      }
      console.log('Filtered Arrets Arrivee:', this.filteredArretsArrivee);
    },
    async createTrajet() {
      if (!this.newTrajet.cyclisteId || !this.newTrajet.heure_debut || !this.newTrajet.depart || !this.newTrajet.arrivee) {
        alert('Veuillez remplir tous les champs requis.');
        return;
      }

      try {
        console.log('Données du nouveau trajet:', this.newTrajet);

        const response = await axios.post('http://localhost:3000/trajets', this.newTrajet, {
          headers: {
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
