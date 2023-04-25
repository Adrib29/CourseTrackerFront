<template>
    <div>
      <h1>{{ parcoursModel.nom }}</h1>
      <h2> {{ etapeModel.id  }}  </h2>
      <h2> {{ etapeModel.parcours_id  }}  </h2>
      <GoogleMap
        api-key=""
        style="width: 100px; height: 200px"
        :zoom="15"
        >
      </GoogleMap>
      <div class="row">

      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed, ref } from 'vue';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { GoogleMap, Marker, Polyline } from 'vue3-google-map'
  import { EtapeModel } from '../models/EtapeModel';
  import { useEtapeService } from '../composables/EtapeService';
  import { useRoute } from 'vue-router';
import { useParcoursService } from '../composables/ParcoursService';
import { cp } from 'fs';




  const route = useRoute();
  const etapeId = +route.params.etapeId;
  const parcoursId = +route.params.parcoursId;
  const etapeSerrvice = useEtapeService();
  const parcoursSerrvice = useParcoursService();

  const parcoursModel = ref<ParcoursModel>(await parcoursSerrvice.getParcours(parcoursId));
  const etapeModel = ref<EtapeModel>(await etapeSerrvice.getEtape(parcoursId,etapeId));
  
  </script>
  