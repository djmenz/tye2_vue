<template>
  <div id="login">
    <v-container fill-height>
    <v-row style="height: 40px;"></v-row>
    <v-row justify="center" align="center">
    <h1>Track Your Eating 2</h1>
    </v-row>
     <v-row justify="center" align="center">
 <v-dialog
      v-model="dialogLogin"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="success"
          v-bind="attrs"
          v-on="on"
        >
          Login
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Please enter details
        </v-card-title>

        <v-card-text>
 <v-form @submit.prevent="login">
      <input v-model="username" placeholder="username">
      <input v-model="password" placeholder="password" type="password">

      <v-btn
      color="success"
      class="mr-4"
      value="login"
      type="submit"
    >Login</v-btn>
    </v-form>

        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="dialogNewUser"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="blue lighten-2"
          v-bind="attrs"
          v-on="on"
        >
          New User Registration
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Create New User
        </v-card-title>

        <v-card-text>
        <v-text-field
            v-model="newUsername"
            label="Username"
          ></v-text-field>
        <v-text-field
            v-model="newEmail"
            label="Email"
          ></v-text-field>
        <v-text-field
            v-model="newFullName"
            label="Full Name"
          ></v-text-field>
                <v-text-field
            v-model="newPassword"
            label="Password"
            type="password"
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="createNewUser"
          >
            Register
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div><img alt="Vue logo" src="../assets/white_square.jpg"></div>
    <div><img alt="Vue logo" src="../assets/food_logo.jpg"></div>
    </v-row>
    </v-container>
  </div>
</template>

<script>

import axios from 'axios';
import config from '../../config';

export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
      newUsername: '',
      newEmail: '',
      newFullName: '',
      newPassword: '',
      on: '',
      dialogNewUser: '',
    };
  },
  methods: {
    login() {
      const formData = new FormData();
      formData.set('username', this.username);
      formData.set('password', this.password);
      axios.post(`${config.apiUrl}/token`,
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
    createNewUser() {
    // Need to validate the email etc and generate error
      this.dialogNewUser = false;
      let validation = true;
      let errMsg = '';
      const reg = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
      if (this.newUsername.length < 5 || this.newUsername.length > 20) {
        validation = false;
        errMsg += '[username must be at least 5 characters and less than 20] ';
      }
      if (this.newPassword.length < 8 || this.newPassword.length > 40) {
        errMsg += '[password must be at least 8 characters and less than 40] ';
        validation = false;
      }
      if (!reg.test(this.newEmail)) {
        errMsg += '[Email must be in valid format] ';
        validation = false;
      }
      const newUserEntry = {
        username: this.newUsername,
        email: this.newEmail,
        full_name: this.newFullName,
        new_password: this.newPassword,
      };
      if (validation) {
        axios.post(`${config.apiUrl}/api/users`,
          newUserEntry,
          {
            headers: {
              'content-type': 'application/json',
            },
          }).then(() => {
          this.$alert('User Created! Please await verification email');
          this.newUsername = '';
          this.newEmail = '';
          this.newFullName = '';
          this.newPassword = '';
        }).catch((error) => {
          console.log(error);
          this.$alert('Failed to create User');
        });
      } else {
        this.$alert(`Failed to create User, ${errMsg}`);
      }
    },
  },
};
</script>
