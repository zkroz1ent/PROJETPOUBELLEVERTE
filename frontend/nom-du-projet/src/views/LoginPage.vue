<template>
  <div>
    <AppNavbar />
    <LoginForm />
  </div>
</template>

<script>
import AppNavbar from '@/components/AppNavbar.vue';
import LoginForm from '@/components/LoginForm.vue';

export default {
  components: {
    AppNavbar,
    LoginForm
  }
};
</script>