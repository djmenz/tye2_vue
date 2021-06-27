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
    <tr v-for="day in thisWeeksData" v-bind:key="day">
      <td>{{ day.date }}</td>
      <td>{{ day.cals }}</td>
      <td>{{ day.P }}</td>
      <td>{{ day.C }}</td>
      <td>{{ day.F }}</td>
      <td>
      </td>
      </tr>
      <tr>
      <td><h3>Averages({{ thisWeeksStats.count }}/7)</h3></td>
          <td><h3>{{ thisWeeksStats.avgCal.toFixed(0) }}</h3></td>
          <td><h3>{{ thisWeeksStats.avgP.toFixed(0) }}</h3></td>
          <td><h3>{{thisWeeksStats.avgC.toFixed(0) }}</h3></td>
          <td><h3>{{thisWeeksStats.avgF.toFixed(0) }}</h3></td>
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
    <v-switch
      v-model="switch1"
      :label="`Show only users items: ${switch1.toString()}`"
    ></v-switch>
     <h2>New Entry</h2>

      <v-autocomplete
        v-model="formFoodItem"
        :items=filteredList
        item-text="name"
        item-value="id"
      ></v-autocomplete>
            <v-text-field
            v-model="formQuantity"
            label="Quantity"
            width=5
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
      <v-row style="height: 40px;"></v-row>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="orange"
          v-bind="attrs"
          v-on="on"
        >
          Add Template Entries
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          Select food template to add
        </v-card-title>
     <v-card-text>
            <v-select
              :items="templates"
              v-model="template"
              item-text="name"
              item-value="id"
              solo
            ></v-select>

            <v-simple-table v-if="template != ''">
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

    <tr v-for="entry in currentTemplateData" v-bind:key="entry">
      <td>{{ entry.name }}</td>
      <td>{{ entry.quantity }}</td>
      <td>{{ entry.calories * entry.quantity }}</td>
      <td>{{ entry.protein  * entry.quantity}}</td>
      <td>{{ entry.carbs * entry.quantity }}</td>
      <td>{{ entry.fats * entry.quantity }}</td>
      <td>
      </td>
      </tr>
    </tbody>
    <v-row style="height: 80px;"></v-row>
     <v-simple-table v-if="template != ''">
          <tr>
          <td>Cals: {{ curTemplateTotals.cals }}</td>
          <td>P: {{ curTemplateTotals.P }}</td>
          <td>C: {{ curTemplateTotals.C }}</td>
          <td>F: {{ curTemplateTotals.F }}</td>
          </tr>
    </v-simple-table>
    </v-simple-table>

        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="submitTemplate"
          >
            Add Template Items
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
              <th scope="col">Action</th>
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
      <td>        <v-btn v-if="!entry.consumed"
      color="white"
      class="mr-2"
      @click="switchConsumedItem(entry.id, true)"
        >
        {{entry.consumed}}
       </v-btn></td>
      <td>
       <v-btn
      color="error"
      class="mr-2"
      @click="deleteItem(entry.id)"
        >
        X
       </v-btn>
      </td>
      </tr>
    </tbody>
    </v-simple-table>
    <v-row style="height: 80px;"></v-row>
    <v-simple-table >
    <tr>
          <td><h3>Consumed</h3></td>
          <td>Cals: {{ todaysTotals.consumed.cals }}</td>
          <td>P: {{ todaysTotals.consumed.P }}</td>
          <td>C: {{ todaysTotals.consumed.C }}</td>
          <td>F: {{ todaysTotals.consumed.F }}</td>
          </tr>
          <tr>
          <td><h3>Planned</h3></td>
          <td>Cals: {{ todaysTotals.planned.cals }}</td>
          <td>P: {{ todaysTotals.planned.P }}</td>
          <td>C: {{ todaysTotals.planned.C }}</td>
          <td>F: {{ todaysTotals.planned.F }}</td>
          </tr>
    </v-simple-table>
    <v-row style="height: 40px;"></v-row>
    <v-btn
      color="purple"
      class="mr-4"
      @click="resetDay()"
    >
      Reset Day
    </v-btn>
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
      thisWeeksData: [],
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
      dialog: false,
      switch1: false,
    };
  },
  computed: {
    todaysFood() {
      // These shouldnt be using this side effect, changing the date should emit an event
      // this.genStats();
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
    currentTemplateData() {
      const oneTemplate = this.templatesData.filter(
        (oneDay) => oneDay.template_id === this.template,
      ).sort(
        (a, b) => (a.id > b.id ? 1 : -1),
      );
      return oneTemplate;
    },
    curTemplateTotals() {
      const tempStats = {
        cals: 0,
        P: 0,
        C: 0,
        F: 0,
      };
      this.currentTemplateData.forEach((e) => {
        tempStats.cals += e.calories * e.quantity;
        tempStats.P += e.protein * e.quantity;
        tempStats.C += e.carbs * e.quantity;
        tempStats.F += e.fats * e.quantity;
      });
      return tempStats;
    },
    filteredList() {
      if (this.masterFoodList) {
        if (this.switch1) {
          return this.masterFoodList.filter((entry) => entry.creator_id === this.userID);
        }
        const temp = this.masterFoodList;
        return temp.sort((a, b) => (a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1));
      }
      return [];
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
          this.usersTrackedData = res.data.sort(
            (a, b) => (a.id > b.id ? 1 : -1),
          );
          this.genStats();
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
      this.dialog = false;
      // console.log(`template is ${this.template}`);
      const oneTemplate = this.templatesData.filter(
        (oneDay) => oneDay.template_id === this.template,
      ).sort(
        (a, b) => (a.id > b.id ? 1 : -1),
      );
      oneTemplate.forEach((e) => {
        this.submitTemplateItem(e, false);
      });
      this.genStats();
    },
    async getUsersTemplates() {
      const path = 'http://localhost:8000/api/templateinfo';
      const dataPath = 'http://localhost:8000/api/templatesmerged';
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
    submit(consumed) {
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
    submitTemplateItem(item, consumed) {
      const auth = `Bearer ${localStorage.getItem('token')}`;
      const EntryData = {
        food_id: item.food_id,
        quantity: item.quantity,
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
        }).then(() => {
        this.getUsersTrackingData();
      });
    },
    resetDay() {
      this.todaysFood.forEach((e) => {
        this.deleteItem(e.id);
      });
    },
    genStats() {
      this.thisWeek = [];
      this.thisWeeksData = [];
      const startOfWeek = moment(this.todays_date).add(1 - moment(this.todays_date).isoWeekday(), 'days').format('YYYY-MM-DD');
      for (let i = 0; i < 7; i += 1) {
        const newDay = moment(startOfWeek).add(i, 'days').format('YYYY-MM-DD');
        this.thisWeek.push(newDay);
        // console.log(this.oneDaysTotals(startOfWeek));
        const tempDayStats = this.oneDaysTotals(this.oneDaysFood(newDay));
        tempDayStats.date = moment(newDay).format('ddd DD-MM');
        this.thisWeeksData.push(tempDayStats);
      }
      const res = {
        count: 0,
        avgCal: 0,
        avgC: 0,
        avgF: 0,
        avgP: 0,
      };
      this.thisWeeksData.forEach((el) => {
        if (el.cals !== 0) {
          res.count += 1;
          res.avgCal += el.cals;
          res.avgP += el.P;
          res.avgC += el.C;
          res.avgF += el.F;
        }
      });
      res.avgCal /= res.count;
      res.avgP /= res.count;
      res.avgC /= res.count;
      res.avgF /= res.count;
      this.thisWeeksStats = res;
      // console.log(this.thisWeek);
    },
    deleteItem(id) {
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.delete(`http://localhost:8000/api/tracking?id_to_del=${id}`,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: auth,
          },
        }).then(() => {
        this.getUsersTrackingData();
      });
    },
    switchConsumedItem(id, setting) {
      console.log(id);
      const EntryData = {
        consumed: setting,
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
    getUserID() {
      const path = 'http://localhost:8000/users/me/';
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

  },
  created() {
    this.getUsersTrackingData();
    this.getMasterFoods();
    this.getUserID();
    this.todays_date = moment().format('YYYY-MM-DD');
    // console.log(this.todays_date);
    this.genStats();
    this.getUsersTemplates();
    // this.login();
  },
};

</script>
