<template>
    <div>
      
    </div>
    <div class="container">
  <div class="row">
    <div class="col-md-6 col-lg-4" v-for="(parcours, index) in parcoursList" :key="index" :parcoursModel="parcours" >
      <RouterLink href="" class="list-group-item list-group-item-action" :to="{ name: 'parcoursDetail', params: { parcoursId: parcours.id } }"> {{ parcours.nom }} </RouterLink>
    </div>
  </div>
  
</div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { useParcoursService } from '../composables/ParcoursService';
  import Parcours from '../components/Parcours.vue';

  const parcoursService = useParcoursService();
  
  const parcoursList = ref<Array<ParcoursModel>>(await parcoursService.list());
  </script>
  