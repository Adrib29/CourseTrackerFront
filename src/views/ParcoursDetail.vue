<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-8">
        <GoogleMap api-key="" style="width: 100%; height: 700px" :zoom="zoomValue" :center="center">
          <Polyline :options="parcoursPath">
          </Polyline>

          <template v-for="(etape, index) in etapesModel" :key="index">
            <Polyline v-if="etape.coordonneesList"
              :options="{ path: CoordToPosition(etape.coordonneesList), ...etapePath }"
              @click="onEtapeClick(etape, index)" />
          </template>
          <template>
            <Polyline v-if="etapeSelectedInList?.coordonneesList"
              :options="{ path: CoordToPosition(etapeSelectedInList.coordonneesList), ...selectedEtapePath }"
              @click="showInfoEtape(etapeSelectedInList)" />
          </template>
        </GoogleMap>
      </div>
      <div class="col-md-4 border shadow p-3 mb-5">
        <div class="d-flex justify-content-between align-items-center shadow p-2 mb-3 bg-custom-primary rounded">
          <h3 class="text-white m-0"> Parcours : {{ parcoursDetail.nom }} </h3>
          <div>
            <button type="button" class="btn btn-secondary m-4" data-bs-toggle="modal" data-bs-target="#FormModal">
              <i class="bi bi-gear"></i>
            </button>
            <DeleteParcours :parcours-model="parcoursDetail" text-button="X" @deleted="router.push({ name: 'parcours' })"
              class-button="btn btn-danger"> </DeleteParcours>
          </div>
        </div>
        <div>
          <ul class="list-group border">
            <li class="list-group-item first-child" aria-current="true">Données :</li>
            <li class="list-group-item">Distance du parcours : {{ parcoursDetail.distance }} km </li>
            <li class="list-group-item">Distance parcourue : {{ distTotaleEtapes }} km </li>
            <li class="list-group-item">Nombre d'étapes réalisées : {{ etapesModel.length }} </li>
            <li class="list-group-item">Durée totale réalisée : {{ getParcoursDuration(etapesModel) }} </li>
          </ul>
        </div>
        <div style="margin-top: 10px;">
          <div style="height: 380px; overflow-y: scroll;">
            <div class="list-group border" ref="etapesList">
              <li class="list-group-item first-child sticky-top d-flex align-items-center" aria-current="true">
                <div class="flex-grow-1">Les étapes :</div>
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
                    aria-expanded="false">
                    <i class="bi bi-plus-square"></i>
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <RouterLink class="dropdown-item" :to="{ name: 'etapeAdd', params: { parcoursId: parcoursId } }">
                        Ajouter une étape manuellement
                      </RouterLink>
                    </li>
                    <li>
                      <RouterLink class="dropdown-item"
                        :to="{ name: 'etapeAddFichier', params: { parcoursId: parcoursId } }">
                        Ajouter une étape avec une trace
                      </RouterLink>
                    </li>
                  </ul>
                </div>
              </li>
              <template v-for="(etape, index) in etapesModel" :key="index">
                <div>
                  <li type="button" ref="listContainer"
                    class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                    :class="{ 'active': index === activeInListIndex }" @click="onListClick(etape, index)">
                    Etape du {{ DateToString(etape.startDate!) }}
                    <div>
                      <button class="btn btn-primary m-2 ms-auto" @click="showInfoEtape(etape)">
                        <i class="bi bi-search text-white"></i>
                      </button>
                      <RouterLink class="btn btn-primary m-2 ms-auto" :to="{ name: 'etapeDetail', params: { parcoursId: parcoursDetail.id ,etapeId: etape.id }}">
                        <i class="bi bi-clipboard-data"></i>
                      </RouterLink>          
                    </div>
                  </li>
                </div>
              </template>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div style="margin-top: 10px;">


        </div>
      </div>
    </div>
  </div>


  <!-- Modal pour formulaire -->
  <div class="modal fade" id="FormModal" tabindex="-1" aria-labelledby="FormModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="FormModal">Modifier le parcours</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="nom">Nom du trajet</label>
              <input type="text" id="nom" name="nom" v-model="nom" class="form-control" required>
            </div>
            <button type="submit" class="btn btn-primary" data-bs-dismiss="modal">Enregister</button>
          </form>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal pour informations etape -->
  <div class="modal fade" id="EtapeModal" tabindex="-1" aria-labelledby="EtapeModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="EtapeModal">Etape </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <DetailEtape v-if="etapeSelected" :etape-model="etapeSelected" :parcours-id="parcoursId" />
        </div>
      </div>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import { ParcoursModel } from '../models/ParcoursModel';
import { useParcoursService } from '../composables/ParcoursService';
import { GoogleMap, Polyline } from 'vue3-google-map'
import { EtapeModel } from '../models/EtapeModel';
import router from '../router';
import { useEtapeService } from '../composables/EtapeService';
import { Modal } from 'bootstrap';
import { CoordToPosition, CalculDistance, GetZoomMap, GetMiddleCoord } from '../utils/Coordonnes'
import { getParcoursDuration, DateToString } from '../utils/DateTime';
import DetailEtape from '../components/DetailEtape.vue'
import DeleteParcours from '../components/DeleteParcours.vue';


const route = useRoute();
const parcoursService = useParcoursService();
const etapeService = useEtapeService();

const parcoursId = +route.params.parcoursId;
const parcoursDetail = ref<ParcoursModel>(await parcoursService.getParcours(parcoursId));
const etapesModel = ref<Array<EtapeModel>>(await etapeService.list(parcoursId));
const etapeSelected = ref<EtapeModel | null>();
const etapeSelectedInList = ref<EtapeModel | null>();
const activeInListIndex = ref<number>(-1);
const distTotaleEtapes = computed<number>(() => {
  return parseFloat(etapesModel.value.reduce((tot, etp) => tot + etp.distance!, 0).toFixed(2));
})
const etapesList = ref<HTMLElement>()
const nom = ref("");
const loading = ref(false);
const zoomValue = GetZoomMap(parcoursDetail.value.coordonneesList);
//Initialisation du centre de la map
let MiddleCoord = GetMiddleCoord(parcoursDetail.value?.coordonneesList)
let center = MiddleCoord
  ? { lat: MiddleCoord.latitude, lng: MiddleCoord.longitude }
  : { lat: 48.419603, lng: -4.459316 };


const parcoursPath = {
  path: CoordToPosition(parcoursDetail.value.coordonneesList),
  geodesic: true,
  strokeColor: "#FF0000",
  strokeOpacity: 1.0,
  strokeWeight: 2,
  clickable: true,
};

const etapePath = {
  geodesic: true,
  strokeColor: "#39FF14",
  strokeOpacity: 1.0,
  strokeWeight: 2,
  zIndex: 1,
};

const selectedEtapePath = {
  geodesic: true,
  strokeColor: "#00ffff",
  strokeOpacity: 1.0,
  strokeWeight: 3,
  zIndex: 2,
};

function showInfoEtape(etape: EtapeModel) {
  etapeSelected.value = etape;
  new Modal(document.querySelector("#EtapeModal")!).show();
}



async function submitForm() {

  const formData = new FormData();
  formData.append('nom', nom.value);

  var parcours: ParcoursModel;
  loading.value = true;
  try {
    parcours = await parcoursService.getParcours(parcoursId);
    parcours.nom = nom.value;
    parcours.distance = CalculDistance(parcours.coordonneesList);

    //ajout des coordonnées après obtention de l'id
    await parcoursService.updateParcours(parcours);
  } catch (e) {
    loading.value = false;
  }
  loading.value = false;
  router.push('/parcours')
}

function updateSlectedEtape(etape: EtapeModel, indexSelected: number) {
  activeInListIndex.value = indexSelected;
  etapeSelectedInList.value = etape;
}

function onListClick(etape: EtapeModel, indexSelected: number) {
  updateSlectedEtape(etape, indexSelected);
}

function onEtapeClick(etape: EtapeModel, indexSelected: number) {
  updateSlectedEtape(etape, indexSelected);
  if (etapesList.value && activeInListIndex.value != null) {
    //NextTick attend la mise à jour du DOM
    nextTick(() => {
      const activeEtape = etapesList.value!.querySelector('.list-group-item-action.active')
      if (activeEtape) {
        activeEtape.scrollIntoView({ block: 'center' })
      }
    })
  }
}



</script>

<style></style>
  