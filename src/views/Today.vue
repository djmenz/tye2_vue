<template>
  <div class="about">
  <v-container fluid>
    <v-row>
    <v-col cols="4" justify="center">
    <v-date-picker
    v-model="todays_date"
     :landscape="landscape"
     first-day-of-week=1
     >
     </v-date-picker>
        <v-row style="height: 80px;"></v-row>

          <h2>Weekly Stats</h2>
     <v-simple-table >
              <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Cals</th>
              <th scope="col">Protein</th>
              <th scope="col">Carbs</th>
              <th scope="col">Fats</th>
            </tr>
          </thead>
          <tbody>
    <tr v-for="day in thisWeek" v-bind:key="day">
      <td>{{ day }}</td>
      <td>{{ oneDaysTotals(oneDaysFood(day)).cals  }}</td>
      <td>{{ oneDaysTotals(oneDaysFood(day)).P}}</td>
      <td>{{ oneDaysTotals(oneDaysFood(day)).C}}</td>
      <td>{{ oneDaysTotals(oneDaysFood(day)).F }}</td>
      <td>
      </td>
      </tr>
    </tbody>
    </v-simple-table>
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

    <v-btn
      color="success"
      class="mr-4"
      @click="submit(consumed=true)"
    >
      Add as Eaten
    </v-btn>
      <v-btn
      color="yellow"
      class="mr-4"
      @click="submit(consumed=false)"
    >
      Add for Planning
    </v-btn>
      <v-autocomplete
        v-model="template"
        :items=templates
        item-text="name"
        item-value="id"
      ></v-autocomplete>
          <v-btn
      color="orange"
      class="mr-4"
      @click="submitTemplate"
    >
      Add Template Entries
    </v-btn>
    <v-row style="height: 80px;"></v-row>
          <h2>Total Calories: {{ todaysCombinedtotals.cals }}
          P:{{ todaysCombinedtotals.P }}
          C:{{ todaysCombinedtotals.C }}
          F:{{ todaysCombinedtotals.F }}</h2>
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
              <th scope="col">Consumed</th>
              <th scope="col">Action></th>
            </tr>
          </thead>
          <tbody>

    <tr v-for="entry in todaysFood" v-bind:key="entry">
      <td>{{ entry.name }}</td>
      <td>{{ entry.quantity }}</td>
      <td>{{ entry.calories * entry.quantity }}</td>
      <td>{{ entry.protein  * entry.quantity}}</td>
      <td>{{ entry.carbs * entry.quantity }}</td>
      <td>{{ entry.fats * entry.quantity }}</td>
      <td>{{ entry.id }}</td>
      <td>{{ entry.consumed }}</td>
      <td>
       <v-btn v-if="entry.consumed"
      color="error"
      class="mr-2"
      @click="deleteItem(entry.id)"
        >
        Delete
       </v-btn>
        <v-btn v-if="!entry.consumed"
      color="primary"
      class="mr-2"
      @click="setToConsumedItem(entry.id)"
        >
        Eaten
       </v-btn>
      </td>
      </tr>
    </tbody>
    </v-simple-table>
    <v-row style="height: 80px;"></v-row>
    <v-simple-table >
    <tr>
          <td><h3>Consumed</h3></td>
          <td>Cals:{{ todaysTotals.consumed.cals }}</td>
          <td>P:{{ todaysTotals.consumed.P }}</td>
          <td>C:{{ todaysTotals.consumed.C }}</td>
          <td>F:{{ todaysTotals.consumed.F }}</td>
          </tr>
          <tr>
          <td><h3>Planned</h3></td>
          <td>Cals:{{ todaysTotals.planned.cals }}</td>
          <td>P:{{ todaysTotals.planned.P }}</td>
          <td>C:{{ todaysTotals.planned.C }}</td>
          <td>F:{{ todaysTotals.planned.F }}</td>
          </tr>
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
      thisWeek: [],
      thisWeeksStats: [],
      usersTrackedData: [],
      masterFoodList: [],
      templates: [],
      templatesData: [],
      picker: '',
      landscape: true,
      formFoodItem: 8, // sets the default autocomplete
      formQuantity: 1.0,
      template: '',
      on: '',
    };
  },
  computed: {
    todaysFood() {
      // These shouldnt be using this side effect, changing the date should emit an event
      this.genStats();
      return this.usersTrackedData.filter((oneDay) => oneDay.date.includes(this.todays_date));
    },
    todaysTotals() {
      const tempStatsConsumed = {
        cals: 0,
        P: 0,
        C: 0,
        F: 0,
      };
      const tempStatsPlanned = {
        cals: 0,
        P: 0,
        C: 0,
        F: 0,
      };
      this.todaysFood.forEach((e) => {
        if (e.consumed) {
          tempStatsConsumed.cals += e.calories * e.quantity;
          tempStatsConsumed.P += e.protein * e.quantity;
          tempStatsConsumed.C += e.carbs * e.quantity;
          tempStatsConsumed.F += e.fats * e.quantity;
        } else {
          tempStatsPlanned.cals += e.calories * e.quantity;
          tempStatsPlanned.P += e.protein * e.quantity;
          tempStatsPlanned.C += e.carbs * e.quantity;
          tempStatsPlanned.F += e.fats * e.quantity;
        }
      });
      return { consumed: tempStatsConsumed, planned: tempStatsPlanned };
    },
    todaysCombinedtotals() {
      const tempTotals = {
        cals: this.todaysTotals.consumed.cals + this.todaysTotals.planned.cals,
        P: this.todaysTotals.consumed.P + this.todaysTotals.planned.P,
        C: this.todaysTotals.consumed.C + this.todaysTotals.planned.C,
        F: this.todaysTotals.consumed.F + this.todaysTotals.planned.F,
      };
      return tempTotals;
    },
  },
  methods: {
    oneDaysFood(day) {
      // console.log(day);
      return this.usersTrackedData.filter((oneDay) => oneDay.date.includes(day));
    },
    oneDaysTotals(daysFood) {
      const tempStats = {
        cals: 0,
        P: 0,
        C: 0,
        F: 0,
      };
      daysFood.forEach((e) => {
        tempStats.cals += e.calories * e.quantity;
        tempStats.P += e.protein * e.quantity;
        tempStats.C += e.carbs * e.quantity;
        tempStats.F += e.fats * e.quantity;
      });
      return tempStats;
    },
    getUsersTrackingData() {
      const path = 'http://localhost:8000/api/trackingmerged';
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
          this.usersTrackedData = res.data;
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
          // console.log(this.masterFoodList);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    submitTemplate() {
      console.log(`template is ${this.template}`);
      const oneTemplate = this.templatesData.filter(
        (oneDay) => oneDay.template_id === this.template,
      );
      console.log(oneTemplate);
    },
    async getUsersTemplates() {
      const path = 'http://localhost:8000/api/templateinfo';
      const dataPath = 'http://localhost:8000/api/templatedata';
      const auth = `Bearer ${localStorage.getItem('token')}`;
      const headers = {
        accept: 'application/json',
        Authorization: auth,
      };
      const templatesInfo = await axios.get(path, { headers });
      const templatesData = await axios.get(dataPath, { headers });
      this.templates = templatesInfo.data;
      this.templatesData = templatesData.data;
    },
    // login() {
    //   const formData = new FormData();
    //   formData.set('username', '');
    //   formData.set('password', '');
    //   axios.post('http://localhost:8000/token',
    //     formData,
    //     {
    //       headers: { 'content-type': 'application/x-www-form-urlencoded' },
    //     }).then((response) => {
    //     // console.log(response);
    //     localStorage.setItem('token', response.data.access_token);
    //   }).catch((error) => {
    //     console.log('Error login');
    //     console.log(error);
    //   });
    //   this.dialog = false;
    // },
    submit(consumed) {
      console.log(this.formFoodName);
      console.log(this.formCalories);
      const auth = `Bearer ${localStorage.getItem('token')}`;
      const EntryData = {
        food_id: this.formFoodItem,
        quantity: this.formQuantity,
        date: this.todays_date,
        consumed,
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
        this.getUsersTrackingData();
      });
    },
    genStats() {
      this.thisWeek = [];
      const startOfWeek = moment(this.todays_date).add(1 - moment(this.todays_date).isoWeekday(), 'days').format('YYYY-MM-DD');
      for (let i = 0; i < 7; i += 1) {
        console.log(i);
        const newDay = moment(startOfWeek).add(i, 'days').format('YYYY-MM-DD');
        this.thisWeek.push(newDay);
        // console.log(this.oneDaysTotals(startOfWeek))
        // this.thisWeeksStats.push(this.oneDaysTotals(newDay));
      }
      console.log(this.thisWeek);
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
        this.getUsersTrackingData();
      });
    },
    setToConsumedItem(id) {
      console.log(id);
      const EntryData = {
        consumed: true,
      };
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.patch(`http://localhost:8000/api/tracking/${id}`,
        EntryData,
        {
          headers: {
            'content-type': 'application/json',
            // Origin: 'http://localhost:8080',
            Authorization: auth,
          },
        }).then((response) => {
        console.log(response);
        this.getUsersTrackingData();
      });
    },
    computed: {
    },
  },
  created() {
    this.getUsersTrackingData();
    this.getMasterFoods();
    this.todays_date = moment().format('YYYY-MM-DD');
    // console.log(this.todays_date);
    this.genStats();
    this.getUsersTemplates();
    // this.login();
  },
};

</script>
