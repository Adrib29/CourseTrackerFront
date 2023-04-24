<template>
    <div class="container">
        <div>
            <h1> {{ parcoursDetail.nom }} </h1>
        </div>
        <GoogleMap
            api-key=""
            style="width: 100%; height: 500px"
            :zoom="15"
            :center="center"
            >
            <Polyline :options="flightPath" />
        </GoogleMap>
    </div>
    <button @click="deleteParcours"> Supprimer</button>
</template>
  
<script setup lang="ts">
   import { computed, onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { CoordonnesModel } from '../models/CoordonnesModel';
  import { useParcoursService } from '../composables/ParcoursService';
  import { GoogleMap, Marker, Polyline, CustomMarker } from 'vue3-google-map'

  const route = useRoute();
  const parcoursService = useParcoursService();
  const parcoursId = +route.params.parcoursId;
  const parcoursDetail = ref<ParcoursModel>(await parcoursService.getParcours(parcoursId));
  const coordonnestList = ref<Array<CoordonnesModel>>(parcoursDetail.value.coordonneesList);
  
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
  }
</script>
  