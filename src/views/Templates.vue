<template>
  <div class="about">
  <v-container fluid>
    <v-row>
    <v-col cols="4" justify="center">

    </v-col>
    <v-col cols="6" justify="center">
    <h3>
    <router-link to="/today">Today</router-link> |
    <router-link to="/masterlist">Masterlist</router-link> |
    <router-link to="/templates">Templates</router-link>
    </h3>
    <!-- <h1>{{ todays_date }}</h1> -->
     <h2>New Entry</h2>

      <v-autocomplete
        v-model="formFoodItem"
        :items=masterFoodList
        item-text="name"
        item-value="id"
      ></v-autocomplete>
            <v-text-field
            v-model="formQuantity"
            label="Quantity"
          ></v-text-field>
      <v-autocomplete
        v-model="template"
        :items=templates
      ></v-autocomplete>
          <v-btn
      color="success"
      class="mr-4"
      @click="submit"
    >
      Add To chosen Template
    </v-btn>

      <v-btn
      color="warning"
      class="mr-2"
      @click="deleteItem(message.id)"
        >Create new template</v-btn>

    <v-row style="height: 80px;"></v-row>

          <h2>Calories:{{ todaysTotals.cals }}
          P:{{ todaysTotals.P }}
          C:{{ todaysTotals.C }}
          F:{{ todaysTotals.F }}</h2>
      <v-simple-table >
              <thead>
            <tr>
              <th scope="col">Food</th>
              <th scope="col">Quantity</th>
              <th scope="col">Cals</th>
              <th scope="col">Protein</th>
              <th scope="col">Carbs</th>
              <th scope="col">Fats</th>
              <th scope="col">Entry ID</th>
              <th scope="col">Action></th>
            </tr>
          </thead>
          <tbody>

    <tr v-for="message in todaysFood" v-bind:key="message">
      <td>{{ message.name }}</td>
      <td>{{ message.quantity }}</td>
      <td>{{ message.calories * message.quantity }}</td>
      <td>{{ message.protein  * message.quantity}}</td>
      <td>{{ message.carbs * message.quantity }}</td>
      <td>{{ message.fats * message.quantity }}</td>
      <td>{{ message.id }}</td>
      <td>
       <v-btn
      color="warning"
      class="mr-2"
      @click="deleteItem(message.id)"
        >
        Delete
       </v-btn>
      </td>
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

export default {
  name: 'dailyView',
  data() {
    return {
      todays_date: '',
      msg: [],
      masterFoodList: [],
      templates: [
        'weekend',
        'weekday',
        'mcdonalds big mac meal',
      ],
      picker: '',
      landscape: true,
      formFoodItem: 8, // sets the default autocomplete
      formQuantity: 1.0,
      template: 'weekend',
      attrs: '',
      on: '',
    };
  },
  computed: {
    todaysFood() {
      return this.msg.filter((oneDay) => oneDay.date.includes(this.todays_date));
    },
    todaysTotals() {
      const tempStats = {
        cals: 0,
        P: 0,
        C: 0,
        F: 0,
      };
      this.todaysFood.forEach((e) => {
        tempStats.cals += e.calories * e.quantity;
        tempStats.P += e.protein * e.quantity;
        tempStats.C += e.carbs * e.quantity;
        tempStats.F += e.fats * e.quantity;
      });
      return tempStats;
    },
  },
  methods: {
    getMessage() {
      // const path = 'http://localhost:8000/api/foods';
      const path = 'http://localhost:8000/api/trackingmerged';
      // const path = ('http://localhost:5000/daily_mem/' + this.date);
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
          this.msg = res.data;
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    getMasterFoods() {
      const path = 'http://localhost:8000/api/foods';
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.get(path, {
        headers:
      {
        accept: 'application/json',
        Authorization: auth,
      },
      })
        .then((res) => {
          this.masterFoodList = res.data.sort(
            (a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1),
          );
          this.masterFoodList.forEach((el) => {
            const tempElement = el;
            tempElement.name = `${el.name} [cals:${el.calories} P:${el.protein} C:${el.carbs} F:${el.fats}]`;
          });
          console.log(this.masterFoodList);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    login() {
      const formData = new FormData();
      formData.set('username', 'dan');
      formData.set('password', 'hello');
      axios.post('http://localhost:8000/token',
        formData,
        {
          headers: { 'content-type': 'application/x-www-form-urlencoded' },
        }).then((response) => {
        // console.log(response);
        localStorage.setItem('token', response.data.access_token);
      }).catch((error) => {
        console.log('Error login');
        console.log(error);
      });
      this.dialog = false;
    },
    submit() {
      console.log(this.attrs);
      console.log(this.formFoodName);
      console.log(this.formCalories);
      const auth = `Bearer ${localStorage.getItem('token')}`;
      const EntryData = {
        food_id: this.formFoodItem,
        quantity: this.formQuantity,
        date: this.todays_date,
      };
      axios.post('http://localhost:8000/api/tracking',
        EntryData,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: auth,
          },
        }).then((response) => {
        console.log(response);
        this.getMessage();
      });
    },
    deleteItem(id) {
      console.log(id);
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.delete(`http://localhost:8000/api/tracking?id_to_del=${id}`,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: auth,
          },
        }).then((response) => {
        console.log(response);
        this.getMessage();
      });
    },
    computed: {
    },
  },
  created() {
    this.getMessage();
    this.getMasterFoods();
    this.todays_date = moment().format('YYYY-MM-DD');
    console.log(this.todays_date);
    // this.login();
  },
};

</script>
