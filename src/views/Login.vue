<template>
  <div id="login">
    <h1>Please Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="username">
      <input v-model="password" placeholder="password" type="password">
      <input type="submit" value="login">
    </form>
    <div><img alt="Vue logo" src="../assets/white_square.jpg"></div>
    <div><img alt="Vue logo" src="../assets/food_logo.jpg"></div>
  </div>
</template>

<script>

import axios from 'axios';

export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      const formData = new FormData();
      formData.set('username', this.username);
      formData.set('password', this.password);
      axios.post('http://localhost:8000/token',
        formData,
        {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        }).then((response) => {
        console.log(response);
        // this.$alert('Logged in successfully');
        localStorage.setItem('token', response.data.access_token);
        this.$router.push('today');
      }).catch((error) => {
        console.log('Error login');
        this.$alert('Could not login');
        console.log(error);
      });
      this.dialog = false;
    },
  },
};
</script>
