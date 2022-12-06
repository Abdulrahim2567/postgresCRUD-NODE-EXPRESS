import { createApp } from 'vue'
import App from './App.vue'

import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/saga-blue/theme.css';      //theme
import 'primevue/resources/primevue.min.css ';               //core css
import 'primeicons/primeicons.css';

import 'primevue/resources/themes/lara-light-indigo/theme.css';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';     //optional for column grouping
import Row from 'primevue/row';  
import ToastService from 'primevue/toastservice';
import Toast from 'primevue/toast';
import Toolbar from 'primevue/toolbar';
import FileUpload from 'primevue/fileupload';
import Dialog from 'primevue/dialog';
import InputNumber from 'primevue/InputNumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';

import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import './assets/main.css'
import './assets/products.json'
import Card from 'primevue/card';
import route from './router'

import jquery from "jquery"




const app = createApp(App);
app.use(PrimeVue);
app.use(ToastService);
app.use(route);
app.use(jquery);
app.component('Toast',Toast);
app.component('InputText', InputText);
app.component('Calendar', Calendar);
app.component('Dropdown', Dropdown);
app.component('InputNumber', InputNumber);
app.component('Dialog', Dialog);
app.component('Card', Card);
app.component('RadioButton', RadioButton);
app.component('Button', Button);
app.component('DataTable', DataTable);
app.component('Row', Row);
app.component('ColumnGroup', ColumnGroup);
app.component('Column', Column);
app.component('Toolbar', Toolbar);
app.component('FileUpload', FileUpload);

app.mount('#app')

