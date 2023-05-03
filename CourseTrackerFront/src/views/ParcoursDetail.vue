<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-8">
      <GoogleMap
          api-key=""
          style="width: 100%; height: 900px"
          :zoom="zoomValue"
          :center="center"
          >
          <Polyline :options="parcoursPath">
          </Polyline>
      
          <template v-for="(etape, index) in etapesModel" :key="index" >
            <Polyline v-if="etape.coordonneesList" :options="{ path: CoordToPosition(etape.coordonneesList),...etapePath }" @click="showInfoEtape(etape)"/> 
          </template>
        </GoogleMap>
    </div>
    <div class="col-md-4">
        <div>
          <h3> Parcours : {{ parcoursDetail.nom }} </h3>  
        </div>
        <div>
          <ul class="list-group">
            <li class="list-group-item active" aria-current="true">Données :</li>
            <li class="list-group-item">Distance du parcours : {{ parcoursDetail.distance }} km </li>
            <li class="list-group-item">Distance parcourue : {{ distParcourue }} km </li>
            <li class="list-group-item">Nombre d'étapes réalisées : {{ etapesModel.length }} </li>
            <li class="list-group-item">Durée totale réalisée : {{ getParcoursDuration(etapesModel) }} </li>
          </ul>
        </div>
        <div style="margin-top: 10px;">
          <div style="height: 200px; overflow-y: scroll;">
            <div class="list-group">
              <li class="list-group-item active sticky-top" aria-current="true">Les étapes :</li>
              <template v-for="(etape, index) in etapesModel" :key="index" >
                <li class="list-group-item">Etape : {{ etape.id }}, duree = {{ DateTimeToString(etape.startDate, etape.endDate) }} </li>
              </template>
          </div>
        </div>
        <div style="margin-top: 10px;">
          <button type="button" class="btn btn-danger" @click="deleteParcours"> Supprimer</button>
          <RouterLink class="btn btn-primary" :to="{ name: 'etapesList', params: { parcoursId: parcoursId } }"> Les étapes </RouterLink>
          <RouterLink class="btn btn-primary" :to="{ name: 'etapeAdd', params: { parcoursId: parcoursId } }"> Ajouter etape </RouterLink>
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#FormModal"> Modifier </button>
        </div>
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
              <form  @submit.prevent="submitForm">
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
        <h1 class="modal-title fs-5" id="EtapeModal">Détail de l'étape</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
              <div> {{ etapeSelected?.id }}  </div> 
              <div> {{ etapeSelected?.distance }}  </div>
              <div> {{ DateTimeToString(etapeSelected?.startDate, etapeSelected?.endDate) }}  </div> 
      </div>
      <button class="btn btn-primary" data-bs-dismiss="modal" @click="modifyEtape">Modifier</button>
    </div>
  </div>
</div>
</template>
  
<script setup lang="ts">
  import { computed, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { useParcoursService } from '../composables/ParcoursService';
  import { GoogleMap, Polyline } from 'vue3-google-map'
  import { EtapeModel } from '../models/EtapeModel';
  import router from '../router';
  import { useEtapeService } from '../composables/EtapeService';
  import { Modal } from 'bootstrap';
  import { CoordToPosition, CalculDistance, GetZoomMap, GetMiddleCoord } from '../utils/Coordonnes'
  import { DateTimeToString, getParcoursDuration } from '../utils/DateTime';



  const route = useRoute();
  const parcoursService = useParcoursService();
  const etapeService = useEtapeService();

  const parcoursId = +route.params.parcoursId;
  const parcoursDetail = ref<ParcoursModel>(await parcoursService.getParcours(parcoursId));
  const etapesModel = ref<Array<EtapeModel>>(await etapeService.list(parcoursId));
  const etapeSelected = ref<EtapeModel | null >();

  const distParcourue = computed<number>(()=>{
    return parseFloat(etapesModel.value.reduce((tot, etp) => tot + etp.distance!, 0).toFixed(2));
  })

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
  };
 


  async function deleteParcours(){
    await parcoursService.deleteParcours(parcoursId);
    router.push({ name: 'parcours' });
  }

  function showInfoEtape(etape : EtapeModel){
      etapeSelected.value = etape;
      new Modal(document.querySelector("#EtapeModal")!).show();
  }



  async function submitForm() {
    
    const formData = new FormData();
    formData.append('nom', nom.value);     
   
    var parcours: ParcoursModel;
    loading.value= true;
    try{
      parcours  = await parcoursService.getParcours(parcoursId);
      parcours.nom = nom.value;
      parcours.distance = CalculDistance(parcours.coordonneesList);

      //ajout des coordonnées après obtention de l'id
      await parcoursService.updateParcours(parcours);
    }catch(e){
      loading.value= false;
    }
    loading.value= false;
    router.push('/parcours')
}

function modifyEtape(){
  router.push({name: 'etapeModify', params: { parcoursId: parcoursId, etapeId: etapeSelected.value!.id}});
}

</script>

<style>
    .btn-primary, .btn-primary:hover, .btn-primary:active, .btn-primary:visited {
        background-color: #1e3d59 !important;
    }

</style>
  