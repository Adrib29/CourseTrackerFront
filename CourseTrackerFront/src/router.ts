import { createWebHistory, createRouter } from 'vue-router';
import Home from './views/Home.vue';
import ParcoursList from './views/ParcoursList.vue';
import ParcoursDetail from './views/ParcoursDetail.vue';
import ParcoursAdd from './views/ParcoursAdd.vue';
import EtapesList from './views/EtapesList.vue';
import EtapeDetail from './views/EtapeDetail.vue';
import EtapeAdd from './views/EtapeAdd.vue';
import EtapeModify from './views/EtapeModify.vue';
import EtapeAddFichier from './views/EtapeAddFichier.vue';

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
    {
      path: '/parcours/:parcoursId/etape/add',
      name: 'etapeAddFichier',
      component: EtapeAddFichier
    },
    {
      path: '/parcours/:parcoursId/etape/add',
      name: 'etapeAdd',
      component: EtapeAdd
    },
    {
      path: '/parcours/:parcoursId/etape/:etapeId/modify',
      name: 'etapeModify',
      component: EtapeModify
    },
  ]
});

export default router;
