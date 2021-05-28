<template>
  <div class="about">
    <h3>
    <router-link to="/today">Today</router-link> |
    <router-link to="/masterlist">Masterlist</router-link> |
    <router-link to="/logout">Logout</router-link>
    </h3>
    <h1>Today's Eating</h1>

    <h2>Totals:{{ todaysTotals }}</h2>

    <table class="table table-hover"
    style="border:1px solid black;margin-left:auto;margin-right:auto;">
              <thead>
            <tr>
              <th scope="col">Food</th>
              <th scope="col">Quantity</th>
              <th scope="col">Cals</th>
              <th scope="col">Protein</th>
              <th scope="col">Carbs</th>
              <th scope="col">Fats</th>
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
      </tr>
    </tbody>
    </table>
      <!-- <p>{{ msg }}</p> -->
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
        tempStats.cals += e.calories;
        tempStats.P += e.protein;
        tempStats.C += e.carbs;
        tempStats.F += e.fats;
      });
      return tempStats;
    },
  },
  methods: {
    getMessage() {
      // const path = 'http://localhost:8000/api/foods';
      const path = 'http://localhost:8000/api/trackingmerged';
      console.log('HELLLOOOO');
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
    computed: {
    },
  },
  created() {
    this.getMessage();
    this.todays_date = moment().format('YYYY-MM-DD');
    console.log(this.todays_date);
    // this.login();
  },
};

</script>
