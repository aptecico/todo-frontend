import { createApp } from 'vue'
import App from './App.vue'
import axios from 'axios'
//importar arcivos de bootstrap para mejor visuaizaciónd e los datos
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar CSS de Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Importar JS de Bootstrap
// URL base de la API (Laravel)
axios.defaults.baseURL = 'http://localhost:8000/api';

// Token de autenticación (almacenarlo en localStorage)
axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('auth_token')}`;

// Definir la variable global para la utl del servidor back
const baseUrl = 'http://localhost:8000/';



//createApp(App).mount('#app')
const app = createApp(App);

app.config.globalProperties.$baseUrl=baseUrl
app.config.globalProperties.$axios = axios;

app.mount('#app');
