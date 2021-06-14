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
        v-model="current_template"
        :items=templates
        item-text="name"
        item-value="id"
        hint="Select Template to Edit"
        persistent-hint=true
      ></v-autocomplete>

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

      <v-simple-table >
              <thead>
            <tr>
              <th scope="col">template_id</th>
              <th scope="col">Food ID</th>
              <th scope="col">Quantity</th>
              <!-- <th scope="col">Cals</th>
              <th scope="col">Protein</th>
              <th scope="col">Carbs</th>
              <th scope="col">Fats</th> -->
              <th scope="col">Entry ID</th>
              <th scope="col">Action></th>
            </tr>
          </thead>
          <tbody>

    <tr v-for="message in currentTemplatesFood" v-bind:key="message">
      <td>{{ message.template_id }}</td>
      <td>{{ message.food_id }}</td>
      <td>{{ message.quantity }}</td>
      <!-- <td>{{ message.calories * message.quantity }}</td>
      <td>{{ message.protein  * message.quantity}}</td>
      <td>{{ message.carbs * message.quantity }}</td>
      <td>{{ message.fats * message.quantity }}</td> -->
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
  name: 'templateView',
  data() {
    return {
      todays_date: '',
      current_template: '',
      allTemplatesFood: [],
      masterFoodList: [],
      templates: [],
      picker: '',
      landscape: true,
      formFoodItem: 8, // sets the default autocomplete
      formQuantity: 1.0,
      template: '',
      on: '',
    };
  },
  computed: {
    currentTemplatesFood() {
      return this.allTemplatesFood.filter(
        (oneTemplate) => oneTemplate.template_id === this.current_template,
      );
    },
  },
  methods: {
    getMessage() {
      const path = 'http://localhost:8000/api/templatedata';
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
          this.allTemplatesFood = res.data;
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
    getTemplates() {
      const path = 'http://localhost:8000/api/templateinfo';
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.get(path, {
        headers:
      {
        accept: 'application/json',
        Authorization: auth,
      },
      })
        .then((res) => {
          this.templates = res.data;
          console.log(res.data);
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    submit() {
      const auth = `Bearer ${localStorage.getItem('token')}`;
      const EntryData = {
        food_id: this.formFoodItem,
        quantity: this.formQuantity,
        template_id: this.current_template,
      };
      axios.post('http://localhost:8000/api/templatedata',
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
      axios.delete(`http://localhost:8000/api/templatedata?id_to_del=${id}`,
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
    showTemplateTest() {
      console.log(this.current_template);
    },
  },
  created() {
    this.getMessage();
    this.getTemplates();
    this.getMasterFoods();
    this.todays_date = moment().format('YYYY-MM-DD');
    console.log(this.todays_date);
    // this.login();
  },
};

</script>
