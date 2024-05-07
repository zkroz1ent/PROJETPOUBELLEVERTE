// Module pour la gestion des utilisateurs
/* eslint-disable */
export default {
    namespaced: true,
    state: {
      data: null,
    },
    getters: {
      isAuthenticated: (state) => !!state.data,
    },
    actions: {
      login({ commit }, credentials) {
        // API call for logging in user
        // On success: commit('setData', userData);
      },
      logout({ commit }) {
        // API call for logging out user
        // On success: commit('setData', null);
      },
    },
    mutations: {
      setData: (state, userData) => {
        state.data = userData;
      },
    }
  };