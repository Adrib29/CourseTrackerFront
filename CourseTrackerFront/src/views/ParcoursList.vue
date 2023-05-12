<template>
<div class="container">
  <div class="row" v-if="parcoursList.length <= 0">
      <p> Aucun parcours n'a été enregistré !</p>
  </div>
  <div v-else class="row" >
    <div class="col-md-6 col-lg-4" v-for="(parcours, index) in parcoursList" :key="index" >
      <div class="card text-center mb-3 shadow p-3 mb-5 bg-body-tertiary rounded" style="width: 18rem;">
        <div class="card-header d-flex justify-content-between">
            <h5 class="card-title">{{ parcours.nom }}</h5>
            <DeleteParcours :parcours-model="parcours" class-button="btn-close btn btn-large btn-danger" @deleted="updateParcours"> </DeleteParcours>
        </div>
        <div class="progress">
          <div class="progress-bar overflow-visible" role="progressbar" style="min-width: 2em;" :style="{width: distanceRealise.at(index) + '%'}" :aria-valuenow="distanceRealise.at(index)?.toString()" aria-valuemin="0" aria-valuemax="100">{{ distanceRealise.at(index) }}%</div>
        </div>
        <div class="card-body ">
          <RouterLink class="btn btn-primary" :to="{ name: 'parcoursDetail', params: { parcoursId: parcours.id } }"> Détails </RouterLink>
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
      <div class="btn-group" style="margin-bottom: 5px;">
        <button class="btn btn-danger mx-2" data-bs-dismiss="modal" @click="removeParcours">Supprimer</button>
        <button class="btn btn-primary mx-2" data-bs-dismiss="modal">Annuler</button>
      </div>
    </div>
  </div>
</div>
</template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { useParcoursService } from '../composables/ParcoursService';
  import { useEtapeService } from '../composables/EtapeService';
  import DeleteParcours from '../components/DeleteParcours.vue';
  const parcoursService = useParcoursService();
  const parcoursList = ref<Array<ParcoursModel>>(await parcoursService.list());

  const parcoursSelected = ref<ParcoursModel>();
  const etapeService = useEtapeService();
  const distanceRealise = ref<Array<Number>>(await getDistanceParcours());

  async function removeParcours(){
    await parcoursService.deleteParcours(parcoursSelected.value!.id!);
    parcoursList.value = await parcoursService.list();
  }

  async function updateParcours(){
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
  
</script>
  