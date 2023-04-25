import { createWebHistory, createRouter } from 'vue-router';
import Home from './views/Home.vue';
import Races from './views/Races.vue';
import ParcoursList from './views/ParcoursList.vue';
import ParcoursDetail from './views/ParcoursDetail.vue';
import ParcoursAdd from './views/ParcoursAdd.vue';
import EtapesList from './views/EtapesList.vue';
import EtapeDetail from './components/Etape.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/races',
      name: 'races',
      component: Races
    },
    {
      path: '/parcours',
      name: 'parcours',
      component: ParcoursList
    },
    {
      path: '/parcours/:parcoursId',
      name: 'parcoursDetail',
      component: ParcoursDetail
    },
    {
      path: '/parcours/add',
      name: 'parcoursAdd',
      component: ParcoursAdd
    },
    {
      path: '/parcours/:parcoursId/etape',
      name: 'etapesList',
      component: EtapesList
    },
    {
      path: '/parcours/:parcoursId/etape/:etapeId',
      name: 'etapeDetail',
      component: EtapeDetail
    },
  ]
});

export default router;
