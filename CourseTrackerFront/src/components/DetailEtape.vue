<template>
    <div style="margin-top: 10px;">
        <ul class="list-group" >
        <li class="list-group-item first-child" aria-current="true">Détail de l'étape :
            <div>
            <button type="button" class="btn btn-secondary m-4" data-bs-dismiss="modal" @click="modifyEtape"> 
                
                <i class="bi bi-gear"></i>  
            </button>
            </div> 
        </li>
        <li class="list-group-item"> Début : {{ DateTimeToString(etapeModel.startDate!) }} </li>
        <li class="list-group-item"> Fin : {{ DateTimeToString(etapeModel.endDate!) }} </li>
        <li class="list-group-item"> Distance : {{ etapeModel.distance }}  km </li>
        <li class="list-group-item"> Durée : {{ DurationDateTimeToString(etapeModel.startDate, etapeModel.endDate) }} </li>
        <li class="list-group-item"> Vitesse moyenne : {{ etapeModel.vitesse }} km/h </li>
        </ul>
    </div>
</template>


<script setup lang="ts">
import router from '../router';
import { EtapeModel } from '../models/EtapeModel';
import { DurationDateTimeToString, DateTimeToString } from '../utils/DateTime';
import DeleteEtape from './DeleteEtape.vue';



const props = defineProps<{
    etapeModel: EtapeModel;
    parcoursId : number;
}>();

const etape = props.etapeModel;

function modifyEtape(){
  router.push({name: 'etapeModify', params: { parcoursId: props.parcoursId, etapeId: props.etapeModel.id}});
}

function goToParcoursDetail(){
    router.push({name: 'parcoursDetail', params: { parcoursId: props.parcoursId}});   
}

</script>
