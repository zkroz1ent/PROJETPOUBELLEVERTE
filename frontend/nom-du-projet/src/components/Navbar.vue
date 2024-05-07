<template>
    <nav class="bg-white shadow-lg fixed w-full z-10">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <a class="text-gray-900 text-lg md:text-2xl font-bold transition-colors duration-300" href="#">
          Poubelle Verte
        </a>
  
        <button @click="toggleMenu" class="text-gray-500 hover:text-gray-700 focus:outline-none lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <!-- Use a hamburger icon when menu is closed and an X icon when it's open -->
            <path v-if="!isMenuActive" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"/>
            <path v-else strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
  
        <div :class="{'flex': isMenuActive, 'hidden': !isMenuActive }" class="hidden w-full flex-grow lg:flex lg:items-center lg:w-auto">
          <ul class="lg:flex lg:flex-grow justify-end">
            <li v-if="userRole === 'cycliste'" class="lg:ml-4">
              <a class="block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-green-600 transition-colors duration-300" href="/itineraire">Mon Itinéraire</a>
            </li>
            <li v-if="userRole === 'gestionnaire'" class="lg:ml-4">
              <a class="block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-green-600 transition-colors duration-300" href="/tableau-de-bord">Tableau de Bord</a>
            </li>
            <li v-if="userRole === 'rh'" class="lg:ml-4">
              <a class="block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-green-600 transition-colors duration-300"
                 href="/ressources-humaines">
                Gestion RH
              </a>
            </li>
            <li v-if="userRole === 'admin'" class="lg:ml-4">
              <a class="block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-green-600 transition-colors duration-300"
                 href="/administration">
                Administration
              </a>
            </li>
            <li class="lg:ml-4">
              <a class="block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-green-600 transition-colors duration-300" href="/profil">Mon Profil</a>
            </li>
            <li class="lg:ml-4">
              <a class="block mt-4 lg:inline-block lg:mt-0 text-gray-700 hover:text-green-600 transition-colors duration-300" href="/deconnexion">Déconnexion</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </template>
  
  <script>
  export default {
    name: 'AppNavbar',
    data() {
      return {
        isMenuActive: false,
        userRole: 'guest', // This will be dynamically set based on your auth system
      };
    },
    methods: {
      toggleMenu() {
        this.isMenuActive = !this.isMenuActive;
      },
    },
    mounted() {
      // This is an example, replace with your own logic
      // to fetch the user role from your authentication system
      this.userRole = 'guest'; // Replace with real role
    },
  };
  </script>