import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import LoginPage from '../views/LoginPage.vue';
import SignUpPage from '../views/SignUpPage.vue';
import CyclistPage from '../views/CyclistPage.vue';
import NetworkManagerPage from '../views/NetworkManagerPage.vue';
import HRPage from '../views/HRPage.vue';
import AdminPage from '../views/AdminPage.vue';
import MetroMap from '../views/MetroMap.vue';  // Importation de la nouvelle page pour la carte
import ItineraireAdmin from '../views/ItineraireAdmin.vue';
import UtilisateurAdmin from '../views/UtilisateurAdmin.vue';
import CyclisteRoadMap from '../views/CyclisteRoadMap.vue';
import AssignTrajet from '../views/AssignTrajet.vue';
import AdminMetroPlan from '../views/AdminMetroPlan.vue'; // Nouvelle importation
import CyclisteMetroPlan from '../views/CyclisteMetroPlan.vue'; // Nouvelle importation

CyclisteMetroPlan.vue

const routes = [
  { path: '/', component: HomePage },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignUpPage },
  { path: '/cycliste', component: CyclistPage, meta: { role: 'cyclist' } },
  { path: '/network-manager', component: NetworkManagerPage, meta: { role: 'gestionnaire' } },
  { path: '/hr', component: HRPage, meta: { role: 'RH' } },
  { path: '/admin', component: AdminPage, meta: { role: 'administrateur' } },
  { path: '/metro-map', component: MetroMap },
  { path: '/itineraire-admin', component: ItineraireAdmin },
  { path: '/utilisateur-admin', component: UtilisateurAdmin },
  {
    path: '/roadmap',
    name: 'CyclisteRoadMap',
    component: CyclisteRoadMap
  },
  {
    path: '/assign-trajet',  // Nouvelle route
    name: 'AssignTrajet',
    component: AssignTrajet
  },
  { path: '/admin-metro-plan', name: 'AdminMetroPlan', component: AdminMetroPlan }, // Nouvelle route
  { path: '/cycliste-metro-plan', name: 'CyclisteMetroPlan', component: CyclisteMetroPlan }, // Nouvelle route

];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (to.matched.some(record => record.meta.role)) {
    if (!user || to.meta.role !== user.user.role) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;