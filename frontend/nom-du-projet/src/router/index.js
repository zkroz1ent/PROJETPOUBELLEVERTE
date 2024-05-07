import { createRouter, createWebHistory } from 'vue-router';
import SignUpPage from '../views/SignUpPage.vue';
import SignUpPage from '../views/SignUpPage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage,
  },
  // Ajoutez d'autres routes ici
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;