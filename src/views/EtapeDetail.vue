<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-8">
        <GoogleMap api-key="" style="width: 100%; height: 700px" :zoom=zoomValue :center="center">
          <Polyline :options="parcoursPath" />
          <Polyline v-if="etapeModel.coordonneesList != null" :options="etapePath" />
        </GoogleMap>
      </div>
      <div class="col-md-4 border shadow p-3 mb-5">
        <div class="d-flex justify-content-between align-items-center shadow p-2 mb-3 bg-custom-primary rounded">
          <h3 class="text-white m-0"> Etape du {{ DateToString(etapeModel.startDate!) }} </h3>
          <div>
            <DeleteEtape :etape-model="etapeModel" class-button="btn btn-danger" text-button="X"
          @deleted="goToParcours()"></DeleteEtape>
          </div>
        </div>
        <DetailEtape :etape-model="etapeModel" :parcours-id="parcoursModel.id!"></DetailEtape>
      </div>
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
import { CoordToPosition, GetMiddleCoord, GetZoomMap } from '../utils/Coordonnes';
import { DateToString } from '../utils/DateTime';
import DetailEtape from '../components/DetailEtape.vue';
import DeleteEtape from '../components/DeleteEtape.vue';
import router from '../router';

const route = useRoute();
const etapeId = +route.params.etapeId;
const parcoursId = +route.params.parcoursId;
const etapeSerrvice = useEtapeService();
const parcoursSerrvice = useParcoursService();

const parcoursModel = ref<ParcoursModel>(await parcoursSerrvice.getParcours(parcoursId));
const etapeModel = ref<EtapeModel>(await etapeSerrvice.getEtape(etapeId));

const zoomValue = GetZoomMap(etapeModel.value.coordonneesList);
//Initialisation du centre de la map
let MiddleCoord = GetMiddleCoord(etapeModel.value.coordonneesList)
let center = MiddleCoord.latitude != null && MiddleCoord.longitude != null
  ? { lat: MiddleCoord.latitude, lng: MiddleCoord.longitude }
  : { lat: 48.419603, lng: -4.459316 };


const parcoursPath = {
  path: CoordToPosition(parcoursModel.value.coordonneesList),
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
};

const etapePath = {
  path: CoordToPosition(etapeModel.value.coordonneesList),
  geodesic: true,
  strokeColor: "#39FF14",
  strokeOpacity: 1.0,
  strokeWeight: 2,
};

function goToParcours() {
  router.push({ name: 'parcoursDetail', params: { parcoursId: parcoursId } })
}

</script>
    