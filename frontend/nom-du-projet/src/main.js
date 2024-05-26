import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css'; 
// Assurez-vous que le chemin vers le fichier est correct
import Toast, { POSITION } from 'vue-toastification';
import 'vue-toastification/dist/index.css';
const options = {
  // Personnalisez les options ici
  position: POSITION.TOP_RIGHT
};
createApp(App)
  .use(store)
  .use(router)
  .use(Toast, options)
  .mount('#app');