import { createWebHistory, createRouter } from 'vue-router';
import Home from './views/Home.vue';
import Parcours from './views/Parcours.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
        path: '/',
        name: 'home',
        component: Home
      },
      {
        path: '/parcours',
        name: 'parcours',
        component: Parcours
      },
  ]
});
export default router;
