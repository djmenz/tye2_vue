<template>
  <div class="masterlist">

    <v-container fluid>
    <v-row>
    <v-col cols="4" justify="center">
<v-row style="height: 140px;"></v-row>
 <h2>New Food Database Entry</h2>

          <v-text-field
          v-model="formFoodName"
            label="Food Name"
          ></v-text-field>
            <v-text-field
            v-model="formCalories"
            label="Calories"
          ></v-text-field>
            <v-text-field
            v-model="formProtein"
            label="Protein"
          ></v-text-field>

            <v-text-field
            v-model="formCarbs"
            label="Carbs"
          ></v-text-field>

            <v-text-field
            v-model="formFats"
            label="Fat"
          ></v-text-field>
      <p>{{ formPreviewCalories }} Estimated Calories</p>
      <v-btn
      color="success"
      class="mr-4"
      @click="submit"
    >
      Submit
    </v-btn>

    <v-btn
      color="error"
      class="mr-4"
      @click="submit"
    >
      Reset Form
    </v-btn>

    </v-col>
    <v-col cols="6" justify="center">
    <h3>
    <router-link to="/today">Today</router-link> |
    <router-link to="/masterlist">Masterlist</router-link> |
    <router-link to="/templates">Templates</router-link>
    </h3>
    <h1>Masterfood database
    <v-switch
      v-model="switch1"
      :label="`Show only users items: ${switch1.toString()}`"
    ></v-switch>
    </h1>
    <v-simple-table >
              <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Food Name</th>
              <th scope="col">Info</th>
              <th scope="col">Creator ID</th>
              <th scope="col">Calories</th>
              <th scope="col">Protein</th>
              <th scope="col">Carbs</th>
              <th scope="col">Fats</th>
            </tr>
          </thead>
          <tbody>
    <tr v-for="entry in filteredList" v-bind:key="entry">
      <td>{{ entry.id }}</td>
      <td>{{ entry.name }}</td>
      <td>{{ entry.extended_info }}</td>
      <td>{{ entry.creator_id }}</td>
      <td>{{ entry.calories  }}</td>
      <td>{{ entry.protein }}</td>
      <td>{{ entry.carbs }}</td>
      <td>{{ entry.fats }}</td>
      </tr>
    </tbody>
    </v-simple-table>

    </v-col>
  </v-row>
  </v-container>

  </div>
</template>

<script>
import axios from 'axios';
import moment from 'moment';
import config from '../../config';

export default {
  name: 'dailyView',
  data() {
    return {
      switch1: false,
      userID: '',
      todays_date: '',
      msg: '',
      formFoodName: '',
      formCalories: 0,
      formProtein: 0,
      formCarbs: 0,
      formFats: 0,
    };
  },
  computed: {
    filteredList() {
      if (this.msg) {
        if (this.switch1) {
          return this.msg.filter((entry) => entry.creator_id === this.userID);
        }
        const temp = this.msg;
        return temp.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      }
      return [];
    },
    formPreviewCalories() {
      return this.formProtein * 4 + this.formCarbs * 4 + this.formFats * 9;
    },
  },
  methods: {
    getMasterlistData() {
      const path = `${config.apiUrl}/api/foods`;
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.get(path, {
        headers:
      {
        accept: 'application/json',
        Authorization: auth,
      },
      })
        .then((res) => {
          console.log(res.data);
          this.msg = res.data.sort(
            (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),
          );
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    getUserID() {
      const path = `${config.apiUrl}/users/me/`;
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.get(path, {
        headers:
      {
        accept: 'application/json',
        Authorization: auth,
      },
      })
        .then((res) => {
          this.userID = res.data.id;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    submit() {
      console.log(this.formFoodName);
      console.log(this.formCalories);
      const auth = `Bearer ${localStorage.getItem('token')}`;
      const EntryData = {
        name: this.formFoodName,
        extended_info: 'Test Info',
        calories: this.formCalories,
        protein: this.formProtein,
        carbs: this.formCarbs,
        fats: this.formFats,
      };
      axios.post(`${config.apiUrl}/api/foods`,
        EntryData,
        {
          headers:
          {
            'content-type': 'application/json',
            Authorization: auth,
          },
        }).then((response) => {
        console.log(response);
        this.getMasterlistData();
      });
    },
  },
  created() {
    this.getUserID();
    this.getMasterlistData();
    this.todays_date = moment().format('YYYY-MM-DD');
    console.log(this.todays_date);
  },
};

</script>
