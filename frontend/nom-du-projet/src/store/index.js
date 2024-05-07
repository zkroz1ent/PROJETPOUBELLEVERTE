import { createStore } from 'vuex';
import user from './modules/user';
import ramassage from './modules/ramassage';
// Import additional modules here

export default createStore({
  modules: {
    user,
    ramassage,
    // Add additional modules here
  }
});