<template>
    <div class="sign-up-page">
      <sign-up-form></sign-up-form>
    </div>
  </template>
  
  <script>
  import SignUpForm from '../components/SignUpForm.vue';
  
  export default {
    name: 'SignUpPage',
    components: {
      SignUpForm,
    },
  };
  </script>
  
  <style scoped>
  /* Styles pour la page d'inscription */
  .sign-up-page {
    /* Votre style ici */
  }
  </style>