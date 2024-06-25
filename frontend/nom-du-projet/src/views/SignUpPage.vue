<template>
  <div>
    <SignUpForm />
  </div>
</template>

<script>
import SignUpForm from '@/components/SignUpForm.vue';
import axios from 'axios';
import router from '../router';
export default {
  components: {
    SignUpForm
  },
  data() {
    return {
      nom: '',
      email: '',
      password: '',
      role: 'cycliste' 
    };
  },
  methods: {
    async signUp() {
      try {
        await axios.post('/http://localhost:3000/utilisateurs/register', { // Assurez-vous de ce chemin

          nom: this.nom,
          email: this.email,
          password: this.password,
          role: this.role
        });
        alert('Registration successful! Please log in.');
        router.push('/login');
      } catch (error) {
        console.error("Sign Up failed:", error);
        alert("Registration failed. Please try again.");
      }
    }
  }
};
</script>
