<template>
    <div>
      <h1>{{ parcoursModel.nom }}</h1>
      <h2> {{ etapeModel.id  }}  </h2>
      <h2> {{ etapeModel.parcours_id  }}  </h2>
      <GoogleMap
        api-key=""
        style="width: 100%; height: 700px"
        :zoom="15"
        :center="center"
      >
      <Polyline :options="flightPath" />
      <Polyline :options="etapePath" />
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
  import { CoordonnesModel } from '@/models/CoordonnesModel';
  import { CoordonnesEtapeModel } from '@/models/CoordonnesEtapeModel';




  const route = useRoute();
  const etapeId = +route.params.etapeId;
  const parcoursId = +route.params.parcoursId;
  const etapeSerrvice = useEtapeService();
  const parcoursSerrvice = useParcoursService();

  const parcoursModel = ref<ParcoursModel>(await parcoursSerrvice.getParcours(parcoursId));
  const etapeModel = ref<EtapeModel>(await etapeSerrvice.getEtape(parcoursId,etapeId));


    //Initialisation du centre de la map
    let center = { lat: 48.419603, lng: -4.459316 }
    if (parcoursModel.value?.coordonneesList?.[0]) {
      center.lat = parcoursModel.value.coordonneesList[0].latitude;
      center.lng = parcoursModel.value.coordonneesList[0].longitude;
    }


    const flightPath = {
      path: transformerCoordonneesParcours(parcoursModel.value.coordonneesList),
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };

    const etapePath = {
      path: transformerCoordonneesEtape(etapeModel.value.coordonneesList),
      geodesic: true,
      strokeColor: "#39FF14",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };
 
  function transformerCoordonneesParcours(coordonneesList: Array<CoordonnesModel>) {
    return coordonneesList.map(coord => {
      return {lat: coord.latitude, lng: coord.longitude};
    });
  }

  function transformerCoordonneesEtape(coordonneesList: Array<CoordonnesEtapeModel>) {
    return coordonneesList.map(coord => {
      return {lat: coord.latitude, lng: coord.longitude};
    });
  }
  
  </script>
  