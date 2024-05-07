// Module pour la gestion des ramassages
/* eslint-disable */
export default {
    
    namespaced: true,
    state: {
      list: [],
    },
    getters: {
      // Définition des getters relatifs aux ramassages
    },
    actions: {
      fetchRamassages({ commit }) {
        // API call to fetch ramassages
        // On success: commit('setRamassages', data);
      },
    },
    mutations: {
      setRamassages: (state, ramassages) => {
        state.list = ramassages;
      },
    }
  };