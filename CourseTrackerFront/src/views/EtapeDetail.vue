<template>
    <div>
      <h1>{{ parcoursModel.nom }}</h1>
      <h2> {{ etapeModel.id  }}  </h2>
      <h2> {{ etapeModel.parcours_id  }}  </h2>
      <h2> {{ etapeModel.distance  }}  </h2>
      <GoogleMap
        api-key=""
        style="width: 100%; height: 800px"
        :zoom="15"
        :center="center"
      >
      <Polyline :options="flightPath" />
      <Polyline :options="etapePath" />
      </GoogleMap>
      <div class="row">
        <button type="button" class="btn btn-danger" @click="deleteEtape"> Supprimer</button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { GoogleMap, Polyline } from 'vue3-google-map'
  import { EtapeModel } from '../models/EtapeModel';
  import { useEtapeService } from '../composables/EtapeService';
  import { useRoute } from 'vue-router';
  import { useParcoursService } from '../composables/ParcoursService';
  import { CoordonnesModel } from '../models/CoordonnesModel';
  import { CoordonnesEtapeModel } from '../models/CoordonnesEtapeModel';
  import router from '../router';
  import { GetMiddleCoord } from '../utils/Coordonnes';




  const route = useRoute();
  const etapeId = +route.params.etapeId;
  const parcoursId = +route.params.parcoursId;
  const etapeSerrvice = useEtapeService();
  const parcoursSerrvice = useParcoursService();

  const parcoursModel = ref<ParcoursModel>(await parcoursSerrvice.getParcours(parcoursId));
  const etapeModel = ref<EtapeModel>(await etapeSerrvice.getEtape(etapeId));


  //Initialisation du centre de la map
  let MiddleCoord = GetMiddleCoord(etapeModel.value?.coordonneesList)
  let center = MiddleCoord
  ? { lat: MiddleCoord.latitude, lng: MiddleCoord.longitude }
  : { lat: 48.419603, lng: -4.459316 };


    const flightPath = {
      path: transformerCoordonnees(parcoursModel.value.coordonneesList),
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };

    const etapePath = {
      path: transformerCoordonnees(etapeModel.value.coordonneesList),
      geodesic: true,
      strokeColor: "#39FF14",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };


  function transformerCoordonnees(coordonneesList: Array<CoordonnesEtapeModel> | Array<CoordonnesModel> ) {
    return coordonneesList.map(coord => {
      return {lat: coord.latitude, lng: coord.longitude};
    });
  }

  async function deleteEtape() {
    await etapeSerrvice.deleteEtape(etapeId);
    router.push({ name: 'parcoursDetail', params: { parcoursId: parcoursId } })
  }
  
  </script>
  