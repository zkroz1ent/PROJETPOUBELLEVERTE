import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: JSON.parse(localStorage.getItem('user')) || null,
    itineraires: [],
    cyclistes: []
  },
  getters: {
    currentUser: state => state.user,
    itineraires: state => state.itineraires,
    cyclistes: state => state.cyclistes
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
    }
  },
  modules: {}
});