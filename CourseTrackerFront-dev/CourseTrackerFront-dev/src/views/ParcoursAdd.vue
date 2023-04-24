<template>
    <div class="row">
      <div class="col-md-6 offset-md-3">
        <h1> Ajouter un parcours </h1>
  
        <Alert v-if="authenticationFailed" variant="danger" dismissible @dismissed="authenticationFailed = false">
            Erreur
        </Alert>
        <form @submit.prevent="submitForm">
            <label>
            Nom :
            <input v-model="nom" type="text" required>
            </label>
            <br>
            <label>
            Fichier GPX :
            <input ref="fileInput" type="file" accept=".gpx" required @change="handleFileChange">
            </label>
            <br>
            <button type="submit">Envoyer</button>
        </form>
      </div>
    </div>
    

  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { ErrorMessage, Field, Form } from 'vee-validate';
  import { useForms } from '../composables/Forms';
  import { ParcoursModel } from '../models/ParcoursModel';
import { useParcoursService } from '../composables/ParcoursService';
import { CoordonnesModel } from '@/models/CoordonnesModel';
  

  useForms();
  const router = useRouter();
  const authenticationFailed = ref(false);
  const parcoursService = useParcoursService();
  const submitFailed = ref(false);
  const nom = ref("");
  const fichierGpx = ref();



async function submitForm() {
    const formData = new FormData();
      formData.append('nom', nom.value);
      formData.append('fichierGpx', fichierGpx.value);
      console.log("submit");  
      

    const coordinates: CoordonnesModel[] = [];
    var coord: CoordonnesModel[] = [];
    const nouveauParcours: ParcoursModel = { nom: nom.value, coordonneesList: coordinates };
    var parcours: ParcoursModel;
    authenticationFailed.value = false;
    parcours  = await parcoursService.setParcours(nouveauParcours);


    update(parcours.id!);
}

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


async function pause() {
  console.log('start');
  await delay(10000);
  console.log('end');
}
async function update(id : number) {
    var parcours: ParcoursModel;
    authenticationFailed.value = false;
    parcours  = await parcoursService.getParcours(id);
    var coord: CoordonnesModel[] = [];
        try{
        coord = await processGPXFile(fichierGpx.value, id);
        if(coord){
            const parcoursToSave: ParcoursModel = { id: parcours.id, nom: parcours.nom, coordonneesList: coord };
            await parcoursService.updateParcours(parcoursToSave);
        }
        } catch(e){

        }
    

}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target !== null && target.files !== null && target.files.length > 0) {
    fichierGpx.value = target.files[0];
  }
}

async function processGPXFile(file: File, parcoursid : number): Promise<Array<CoordonnesModel>> {
  const xmlString = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  const trackPoints = xmlDoc.getElementsByTagName('trkpt');
  const coordinates: CoordonnesModel[] = [];


  for (let i = 0; i < trackPoints.length; i++) {
  const latAttr = trackPoints[i].getAttribute('lat');
  const lngAttr = trackPoints[i].getAttribute('lon');
  if (latAttr !== null && lngAttr !== null) {
    const lat = parseFloat(latAttr);
    const lng = parseFloat(lngAttr);
    const newCoordinate: CoordonnesModel = { latitude: lat, longitude: lng, parcours_id: parcoursid};
    coordinates.push(newCoordinate);
  }
}
  return coordinates;
}

  </script>
  
  <style scoped>
  .shake {
    animation: shake 300ms ease;
  }
  @keyframes shake {
    10%,
    50%,
    90% {
      transform: translateX(0.5rem);
    }
    30%,
    70% {
      transform: translateX(-0.5rem);
    }
  }
  </style>
  