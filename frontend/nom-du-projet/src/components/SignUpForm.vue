<template>
    <form @submit.prevent="onSubmit">
      <input v-model="form.email" type="email" placeholder="Email" required>
      <input v-model="form.password" type="password" placeholder="Password" required>
      <!-- Ajoutez d'autres champs de formulaire ici au besoin -->
      <button type="submit">S'inscrire</button>
    </form>
  </template>
  
  <script>
  export default {
    name: 'SignUpForm',
    data() {
      return {
        form: {
          email: '',
          password: '',
        },
      };
    },
    methods: {
      onSubmit() {
        this.$store.dispatch('user/signUp', this.form);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Styles du formulaire d'inscription ici */
  </style>