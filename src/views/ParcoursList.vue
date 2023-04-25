<template>


<div class="container">
  <div class="row">
    <div class="col-md-6 col-lg-4" v-for="(parcours, index) in parcoursList" :key="index" :parcoursModel="parcours" >
      <div class="card text-center mb-3" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">{{ parcours.nom }}</h5>
          <RouterLink href="" class="btn btn-primary" :to="{ name: 'parcoursDetail', params: { parcoursId: parcours.id } }"> Détails </RouterLink>
        </div>
      </div>
      
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
  