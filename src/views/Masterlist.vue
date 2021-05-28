<template>
  <div class="masterlist">
    <h3>
    <router-link to="/today">Today</router-link> |
    <router-link to="/masterlist">Masterlist</router-link> |
    <router-link to="/logout">Logout</router-link>
    </h3>
    <h1>Masterfood database</h1>
    <table class="table table-hover"
    style="border:1px solid black;margin-left:auto;margin-right:auto;">
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
    <tr v-for="message in msg" v-bind:key="message">
      <td>{{ message.id }}</td>
      <td>{{ message.name }}</td>
      <td>{{ message.extended_info }}</td>
      <td>{{ message.creator_id }}</td>
      <td>{{ message.calories  }}</td>
      <td>{{ message.protein }}</td>
      <td>{{ message.carbs }}</td>
      <td>{{ message.fats }}</td>
      </tr>
    </tbody>
    </table>

    <h3>TEST</h3>
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
      msg: '',
    };
  },
  methods: {
    getMessage() {
      const path = 'http://localhost:8000/api/foods';
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
    computed: {
    },
  },
  created() {
    this.getMessage();
    this.todays_date = moment().format('YYYY-MM-DD');
    console.log(this.todays_date);
  },
};

</script>
