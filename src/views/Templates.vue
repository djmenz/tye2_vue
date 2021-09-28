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
     <h2>Template Modification</h2>
     <v-row style="height: 40px;"></v-row>

<v-dialog
      v-model="dialog2"
      width="500"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="blue lighten-2"
          v-bind="attrs"
          v-on="on"
        >
          Create New Template
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="text-h5 grey lighten-2">
          New template
        </v-card-title>

        <v-card-text>
        <v-text-field
            v-model="newTemplateName"
            label="Template Name"
          ></v-text-field>
        <v-text-field
            v-model="newTemplateExtendedInfo"
            label="Extended Information"
          ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="createNewTemplate"
          >
            Create New Template
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

     <v-row style="height: 40px;"></v-row>
        <v-autocomplete
        v-model="current_template"
        :items=templates
        item-text="name"
        item-value="id"
        hint="Select Template to Edit"
        persistent-hint=true
      ></v-autocomplete>

      <div  v-if="current_template != ''">
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

    <v-row style="height: 80px;"></v-row>

      <v-simple-table >
              <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Quantity</th>
              <th scope="col">Cals</th>
              <th scope="col">Protein</th>
              <th scope="col">Carbs</th>
              <th scope="col">Fats</th>
              <th scope="col">template_id</th>
              <th scope="col">Food ID</th>
              <th scope="col">Entry ID</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>

    <tr v-for="message in currentTemplatesFood" v-bind:key="message">
      <td>{{ message.name }}</td>
      <td>{{ message.quantity }}</td>
      <td>{{ (message.calories * message.quantity).toFixed(1) }}</td>
      <td>{{ (message.protein  * message.quantity).toFixed(1)}}</td>
      <td>{{ (message.carbs * message.quantity).toFixed(1) }}</td>
      <td>{{ (message.fats * message.quantity).toFixed(1) }}</td>
      <td>{{ message.template_id }}</td>
      <td>{{ message.food_id }}</td>
      <td>{{ message.id }}</td>
      <td>
       <v-btn
      color="error"
      class="mr-2"
      @click="deleteItem(message.id)"
        >
        X
       </v-btn>
      </td>
      </tr>
    </tbody>
    </v-simple-table>
    <v-row style="height: 80px;"></v-row>
 <v-simple-table>
          <tr>
          <td><h3>Template Totals</h3></td>
          <td>Cals: {{ todaysTotals.cals.toFixed(1) }}</td>
          <td>P: {{ todaysTotals.P.toFixed(1) }}</td>
          <td>C: {{ todaysTotals.C.toFixed(1) }}</td>
          <td>F: {{ todaysTotals.F.toFixed(1) }}</td>
          </tr>
    </v-simple-table>
<v-row style="height: 40px;"></v-row>
    <v-btn
      color="error"
      class="mr-4"
      @click="deleteSelectedTemplate()"
    >
      Delete Selected Template
    </v-btn>

    </div>
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
      formFoodItem: 4, // sets the default autocomplete
      formQuantity: 1.0,
      template: '',
      on: '',
      dialog2: false,
      newTemplateName: '',
      newTemplateExtendedInfo: '',
    };
  },
  computed: {
    currentTemplatesFood() {
      return this.allTemplatesFood.filter(
        (oneTemplate) => oneTemplate.template_id === this.current_template,
      ).sort(
        (a, b) => (a.id > b.id ? 1 : -1),
      );
    },
    todaysTotals() {
      const tempStats = {
        cals: 0,
        P: 0,
        C: 0,
        F: 0,
      };
      this.currentTemplatesFood.forEach((e) => {
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
      const path = `${config.apiUrl}/api/templatesmerged`;
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
      const path = `${config.apiUrl}/api/templateinfo`;
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
        })
        .catch((error) => {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    createNewTemplate() {
      this.dialog2 = false;
      const path = `${config.apiUrl}/api/templateinfo`;
      const EntryData = {
        name: this.newTemplateName,
        extended_info: this.newTemplateExtendedInfo,
      };
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.post(path,
        EntryData,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: auth,
          },
        }).then((res) => {
        this.templates = res.data;
        console.log(res.data);
        this.current_template = res.data;
        this.newTemplateName = '';
        this.newTemplateExtendedInfo = '';
        this.getTemplates();
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
      axios.post(`${config.apiUrl}/api/templatedata`,
        EntryData,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: auth,
          },
        }).then((response) => {
        console.log(response);
        this.formQuantity = 1.0;
        this.getMessage();
      });
    },
    deleteItem(id) {
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.delete(`${config.apiUrl}/api/templatedata?id_to_del=${id}`,
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
    deleteTemplate(id) {
      const auth = `Bearer ${localStorage.getItem('token')}`;
      axios.delete(`${config.apiUrl}/api/templateinfo?id_to_del=${id}`,
        {
          headers: {
            'content-type': 'application/json',
            Authorization: auth,
          },
        }).then((response) => {
        console.log(response);
        this.getTemplates();
      });
    },
    deleteSelectedTemplate() {
      this.deleteTemplate(this.current_template);
      this.currentTemplatesFood.forEach((e) => {
        this.deleteItem(e.id);
      });
      this.current_template = '';
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
