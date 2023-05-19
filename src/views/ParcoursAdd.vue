<template>
  <spinner v-if="loading" />
  <div v-else class="row">
    <div class="col-md-6 offset-md-3">
      <h1> Ajouter un parcours </h1>
      <form @submit.prevent="submitForm" class="row g-3">
        <div class="mb-3">
          <label class="from-control">Nom du parcours</label>
          <input v-model="nom" type="text" class="form-control" required>
        </div>
        <div class="mb-3">
          <label for="formFileSm" class="form-label">Fichier du tracé (.gpx)</label>
          <input class="form-control" ref="fileInput" type="file" accept=".gpx" required @change="onFileChange">
        </div>
        <div class="mb-3">
          <button type="submit" class="btn btn-primary mb-3" background-color="#1e3d59">Ajouter</button>
        </div>
      </form>
    </div>
  </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Form } from 'vee-validate';
import { ParcoursModel } from '../models/ParcoursModel';
import { useParcoursService } from '../composables/ParcoursService';
import { CoordonnesModel } from '../models/CoordonnesModel';
import spinner from '../components/Spinner.vue'
import { CalculDistance } from '../utils/Coordonnes';


const router = useRouter();
const parcoursService = useParcoursService();
const nom = ref("");
const fichierGpx = ref();
const loading = ref(false);


async function submitForm() {
  const formData = new FormData();
  formData.append('nom', nom.value);
  formData.append('fichierGpx', fichierGpx.value);

  const coordinates: CoordonnesModel[] = [];
  const nouveauParcours: ParcoursModel = { nom: nom.value, coordonneesList: coordinates, distance: 0.1 };
  var parcours: ParcoursModel;
  loading.value = true
  try {
    parcours = await parcoursService.setParcours(nouveauParcours);
    //ajout des coordonnées après obtention de l'id
    await update(parcours.id!);
  } catch (e) {
    loading.value = false;
  }
  loading.value = false;
  router.push('/parcours')
}


async function update(id: number) {
  var parcours: ParcoursModel;
  const coord = ref<Array<CoordonnesModel>>([]);
  try {
    parcours = await parcoursService.getParcours(id);
    coord.value = await processGPXFile(fichierGpx.value, id);
    if (coord) {
      parcours.coordonneesList = coord.value;

      await parcoursService.updateParcours(parcours);

      await setDist(id);
    }
  } catch (e) {

  }
}

async function setDist(id: number) {
  var parcours: ParcoursModel;

  try {
    parcours = await parcoursService.getParcours(id);
    parcours.nom = nom.value;
    parcours.distance = CalculDistance(parcours.coordonneesList);

    //ajout des coordonnées après obtention de l'id
    await parcoursService.updateParcours(parcours);
  } catch (e) {

  }
}

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target !== null && target.files !== null && target.files.length > 0) {
    fichierGpx.value = target.files[0];
  }
}

async function processGPXFile(file: File, parcoursid: number): Promise<Array<CoordonnesModel>> {
  const xmlString = await file.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
  const trackPoints = xmlDoc.getElementsByTagName('trkpt');
  const coordinates: Array<CoordonnesModel> = [];


  for (let i = 0; i < trackPoints.length; i++) {
    const latAttr = trackPoints[i].getAttribute('lat');
    const lngAttr = trackPoints[i].getAttribute('lon');
    if (latAttr !== null && lngAttr !== null) {
      const lat = parseFloat(latAttr);
      const lng = parseFloat(lngAttr);
      const newCoordinate: CoordonnesModel = { latitude: lat, longitude: lng, parcours_id: parcoursid };
      coordinates.push(newCoordinate);
    }
  }
  return coordinates;
}

</script>
  
<style></style>
  