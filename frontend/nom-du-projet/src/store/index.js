import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    itineraires: [],
    cyclistes: [],
    utilisateurs: []
  },
  getters: {
    currentUser: state => state.user,
    itineraires: state => state.itineraires,
    cyclistes: state => state.cyclistes,
    utilisateurs: state => state.utilisateurs,
    isAdmin: state => state.user && state.user.user.role === 'administrateur'
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setItineraires(state, itineraires) {
      state.itineraires = itineraires;
    },
    setCyclistes(state, cyclistes) {
      state.cyclistes = cyclistes;
    },
    setUtilisateurs(state, utilisateurs) {
      state.utilisateurs = utilisateurs;
    }
  },
  actions: {
    async fetchItineraires({ commit, state }) {
      if (!state.user) return;
      try {
        const response = await axios.get('http://localhost:3000/itineraires', {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        commit('setItineraires', response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des itinéraires :", error);
      }
    },
    async fetchCyclistes({ commit, state }) {
      if (!state.user) return;
      try {
        const response = await axios.get('http://localhost:3000/utilisateurs/cyclistes', {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        commit('setCyclistes', response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des cyclistes :", error);
      }
    },
    async fetchUtilisateurs({ commit, state }) {
      if (!state.user) return;
      try {
        const response = await axios.get('http://localhost:3000/utilisateurs', {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        commit('setUtilisateurs', response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des utilisateurs :", error);
      }
    },
    async createUtilisateur({ dispatch, state }, utilisateur) {
      try {
        await axios.post('http://localhost:3000/utilisateurs', utilisateur, {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        dispatch('fetchUtilisateurs');
      } catch (error) {
        console.error("Erreur lors de la création de l'utilisateur :", error);
      }
    },
    async updateUtilisateur({ dispatch, state }, utilisateur) {
      try {
        await axios.put(`http://localhost:3000/utilisateurs/${utilisateur.id}`, utilisateur, {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        dispatch('fetchUtilisateurs');
      } catch (error) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
      }
    },
    async deleteUtilisateur({ dispatch, state }, utilisateurId) {
      try {
        await axios.delete(`http://localhost:3000/utilisateurs/${utilisateurId}`, {
          headers: {
            Authorization: `Bearer ${state.user.token}`
          }
        });
        dispatch('fetchUtilisateurs');
      } catch (error) {
        console.error("Erreur lors de la suppression de l'utilisateur :", error);
      }
    }
  },
  modules: {}
});