import NotasApp from '@/components/NotasApp.vue';
import { createRouter, createWebHistory } from 'vue-router';

//import Login from '../components/Login.vue';

const routes = [
  //{ path: '/', component: Login },
  { path: '/notas', component: NotasApp },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
