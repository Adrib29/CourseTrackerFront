<template>
    <div class="container">
      <div class="row">
        <div class="col-md-6 col-lg-4" v-for="(etape, index) in etapesList" :key="index" :etapeModel="etape" >
          <div class="card text-center mb-3" style="width: 18rem;">
            <div class="card-body">
              <h5 class="card-title">{{ etape.id }}</h5>
              <RouterLink href="" class="btn btn-primary" :to="{ name: 'etapeDetail', params: { etapeId: etape.id } }"> Détails </RouterLink>
            </div>
          </div>
          
        </div>
      </div>
      
    </div>
      </template>
      
      <script setup lang="ts">
      import { ref } from 'vue';
      import { EtapeModel } from '../models/EtapeModel';
      import { useEtapeService } from '../composables/EtapeService';
      import Parcours from '../components/Parcours.vue';
      import { useRoute } from 'vue-router';
    
      const route = useRoute();
      const parcoursId = +route.params.parcoursId;
      const etapeService = useEtapeService();
      
      const etapesList = ref<Array<EtapeModel>>(await etapeService.list(parcoursId));
      </script>
      