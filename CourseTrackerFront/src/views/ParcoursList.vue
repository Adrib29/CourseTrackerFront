<template>
<div class="container">
  <div class="row">
    <div class="col-md-6 col-lg-4" v-for="(parcours, index) in parcoursList" :key="index" :parcoursModel="parcours" >
      <div class="card text-center mb-3 shadow p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem;">
        <div class="card-header d-flex justify-content-between">
            <h5 class="card-title">{{ parcours.nom }}</h5>
            <button type="button" class="btn-close btn btn-large btn-danger" aria-label="Close" @click="parcoursSelected = parcours" data-bs-toggle="modal" data-bs-target="#ParcoursModal"></button>        
        </div>
        <div class="progress">
          <div class="progress-bar overflow-visible" role="progressbar" style="min-width: 2em;" :style="{width: distanceRealise.at(index) + '%'}" :aria-valuenow="distanceRealise.at(index)?.toString()" aria-valuemin="0" aria-valuemax="100">{{ distanceRealise.at(index) }}%</div>
        </div>
        <div class="card-body ">
          <RouterLink href="" class="btn btn-primary" :to="{ name: 'parcoursDetail', params: { parcoursId: parcours.id } }"> Détails </RouterLink>
        </div> 
      </div>
    </div>
  </div>
  <div class="row">
    <div class="center">
      <RouterLink to="/parcours/add" class="btn btn-large btn-primary">Ajouter un parcours</RouterLink>
    </div>
  </div>
</div>



<!-- Modal pour informations etape -->
<div class="modal fade" id="ParcoursModal" tabindex="-1" aria-labelledby="ParcoursModal" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-5" id="ParcoursModal">Supprimer ?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
              <div> Êtes vous sûre de vouloir supprimer ce parcours ? </div> 
      </div>
      <button class="btn btn-danger" data-bs-dismiss="modal" @click="removeParcours">Supprimer</button>
      <button class="btn btn-primary" data-bs-dismiss="modal">Annuler</button>
    </div>
  </div>
</div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { useParcoursService } from '../composables/ParcoursService';
  import router from '../router';
  import { EtapeModel } from '../models/EtapeModel';
  import { useEtapeService } from '../composables/EtapeService';

  const parcoursService = useParcoursService();
  const parcoursList = ref<Array<ParcoursModel>>(await parcoursService.list());

  const parcoursSelected = ref<ParcoursModel>();
  const etapeService = useEtapeService();
  const distanceRealise = ref<Array<Number>>(await getDistanceParcours());



  async function removeParcours(){
    await parcoursService.deleteParcours(parcoursSelected.value!.id!);
    parcoursList.value = await parcoursService.list();
  }

  async function getDistanceParcours(): Promise<number[]> {

const valeurs : number[] = [];
for (let i = 0; i < parcoursList.value.length; i++) {
  const etapeList = await etapeService.list(parcoursList.value.at(i)!.id!);
  let distanceTotal = parcoursList.value.at(i)!.distance;
  let distanceParcourue = 0;
  for (let j = 0; j < etapeList.length; j++) {
    distanceParcourue += etapeList[j].distance ?? 0;
  }
  valeurs.push(Math.floor((distanceParcourue / distanceTotal) * 100));
}
return valeurs;
}

  async function getTotalDistance(parcours: ParcoursModel) {
    try{
      const listEtapes  = ref<Array<EtapeModel>>(await etapeService.list(parcours.id!));
        
      const total = listEtapes.value.reduce((totalDistance, etape) => totalDistance + (etape.distance ?? 0 ),0);
      
      console.log("result" + (total*100)/parcours.distance );
      return (total*100)/parcours.distance;

    }catch(e){

    }

    return 0;

  }
  
  
function mounted() {
throw new Error('Function not implemented.');
}
</script>
  