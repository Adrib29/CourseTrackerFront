<template>
    <div class="container">
        <div>
            <h1> {{ parcoursDetail.nom }} </h1>
        </div>
        <GoogleMap
            api-key=""
            style="width: 100%; height: 700px"
            :zoom="15"
            :center="center"
            >
            <Polyline :options="flightPath" />
        </GoogleMap>
    </div>
    
    <button type="button" class="btn btn-danger" @click="deleteParcours"> Supprimer</button>
    <RouterLink class="btn btn-primary" :to="{ name: 'etapesList', params: { parcoursId: parcoursId } }"> Les étapes </RouterLink>
</template>
  
<script setup lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { useParcoursService } from '../composables/ParcoursService';
  import { GoogleMap, Polyline } from 'vue3-google-map'
  import router from '../router';

  const route = useRoute();
  const parcoursService = useParcoursService();
  const parcoursId = +route.params.parcoursId;
  const parcoursDetail = ref<ParcoursModel>(await parcoursService.getParcours(parcoursId));
  
  //Initialisation du centre de la map
  let center = { lat: 48.419603, lng: -4.459316 }
  if (parcoursDetail.value?.coordonneesList?.[0]) {
    center.lat = parcoursDetail.value.coordonneesList[0].latitude;
    center.lng = parcoursDetail.value.coordonneesList[0].longitude;
  }
    const flightPath = {
      path: transformerCoordonnees(),
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };

 
  function transformerCoordonnees() {
    return parcoursDetail.value.coordonneesList.map(coord => {
      return {lat: coord.latitude, lng: coord.longitude};
    });
  }

  async function deleteParcours(){
    await parcoursService.deleteParcours(parcoursId);
    router.push({ name: 'parcours' });
  }

</script>

<style>
    .btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
        background-color: #1e3d59 !important;
    }

</style>
  