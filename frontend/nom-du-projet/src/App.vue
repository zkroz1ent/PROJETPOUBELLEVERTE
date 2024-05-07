<template>
  <div>
    <!-- Navbar component at the top of the page -->
    <Navbarhome />

    <!-- Main page content -->
    <HomePage />
  </div>
</template>

<script>
import HomePage from './views/home.vue'
import Navbarhome from './components/Navbar.vue'
export default {
  name: 'App',
  components: {
    HomePage,
    Navbarhome
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  /* Ensure the margin-top does not hide content behind a fixed navbar, adjust accordingly if needed */
  margin-top: 60px;
}
</style>
