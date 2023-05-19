<template>
    <spinner v-if="loading" />
    <div v-else>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-8">
                    <GoogleMap api-key="" style="width: 100%; height: 700px" :center="center" :zoom=zoomValue>
                        <Polyline :options="parcoursPath" />
                        <template v-for="(etape, index) in etapesModel" :key="index">
                            <Polyline v-if="etape.coordonneesList"
                                :options="{ path: CoordToPosition(etape.coordonneesList), ...etapePath }" />
                        </template>
                        <Polyline v-if="coordApercu.length > 0"
                            :options="{ path: CoordToPosition(coordApercu), ...apercuPath }" />

                    </GoogleMap>
                </div>
                <div class="col-md-4 border shadow p-3 mb-5">
                    <h1> Parcours : {{ parcoursModel.nom }}</h1>
                    <h3> Nouvelle étape : </h3>
                    <form @submit.prevent="addEtape" class="row g-3">
                        <div class="mb-3">
                            <label class="from-control">Date de début : </label>
                            <input v-model="startDate" type="datetime-local" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label class="from-control">Date de fin : </label>
                            <input v-model="endDate" type="datetime-local" class="form-control"
                                :class="{ 'is-invalid': !dateIsValid }" required>
                            <span class="invalid-feedback" v-if="!dateIsValid">La date de fin doit être postérieure à la
                                date de début.</span>
                        </div>
                        <div class="mb-3">
                            <label for="formFileSm" class="form-label">Fichier du tracé (.gpx)</label>
                            <input class="form-control" ref="fileInput" type="file" accept=".gpx" maxlength="200000"
                                :class="{ 'is-invalid': !etapeIsValid || !fichierIsValid }" required
                                @change="handleFileChange">
                            <span class="invalid-feedback" v-if="!etapeIsValid && intputFileIsValid"> Aucune étape trouvée
                            </span>
                            <span class="invalid-feedback" v-if="!fichierIsValid && intputFileIsValid"> Le fichier est trop
                                lourd (200Mo max) </span>
                            <div v-if="loadingFichier" class="d-flex align-items-center justify-content-center mt-4">
                                <Spinner></Spinner>
                                <span class="ml-2"> Recherche de correspondance...</span>
                            </div>
                        </div>
                        <div class="mb-3">
                            <button type="submit" class="btn btn-primary mb-3" background-color="#1e3d59"
                                :disabled="!formIsValid">Ajouter</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">

import { GoogleMap, Polyline } from 'vue3-google-map'
import { computed, nextTick, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useParcoursService } from '../composables/ParcoursService';
import { ParcoursModel } from '../models/ParcoursModel';
import { CoordonnesEtapeModel } from '../models/CoordonnesEtapeModel';
import { EtapeModel } from '../models/EtapeModel';
import { useEtapeService } from '../composables/EtapeService';
import router from '../router';
import { CoordToPosition, CalculDistance, traceEtapeOnParcours, GetMiddleCoord, GetZoomMap } from '../utils/Coordonnes';
import Spinner from '../components/Spinner.vue';

const route = useRoute();
const parcoursId = +route.params.parcoursId;
const parcoursSerrvice = useParcoursService();
const etapeService = useEtapeService();
const parcoursModel = ref<ParcoursModel>(await parcoursSerrvice.getParcours(parcoursId));
const etapesModel = ref<Array<EtapeModel>>(await etapeService.list(parcoursId));

const startDate = ref(new Date().toISOString().slice(0, 16));
const endDate = ref(new Date().toISOString().slice(0, 16));
const fichierGpx = ref();
const dateIsValid = computed(() => { return endDate.value > startDate.value });
const etapeIsValid = computed(() => { return (coordApercu.value.length > 2) });
const fichierIsValid = computed(() => { return (sizeOk.value) });
const formIsValid = computed(() => { return (dateIsValid.value && etapeIsValid.value && fichierIsValid.value) });
const loadingFichier = ref(false);
const loading = ref(false);
const sizeOk = ref(false);
const fileOK = ref(false);
const intputFileIsValid = computed(() => { return (fileOK.value) });


const zoomValue = GetZoomMap(parcoursModel.value.coordonneesList);
//Initialisation du centre de la map
let MiddleCoord = GetMiddleCoord(parcoursModel.value?.coordonneesList)
let center = MiddleCoord
  ? { lat: MiddleCoord.latitude, lng: MiddleCoord.longitude }
  : { lat: 48.419603, lng: -4.459316 };

const coordApercu = ref<Array<CoordonnesEtapeModel>>([]);

const parcoursPath = {
    path: CoordToPosition(parcoursModel.value.coordonneesList),
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
    zIndex: 1,
};

const etapePath = {
    geodesic: true,
    strokeColor: "#39FF14",
    strokeOpacity: 1.0,
    strokeWeight: 2,
    zIndex: 2,
};

const apercuPath = {
    geodesic: true,
    strokeColor: "#00ffff",
    strokeOpacity: 1.0,
    strokeWeight: 3,
    zIndex: 3,
};

async function processGPXFile(file: File, etape_id: number): Promise<Array<CoordonnesEtapeModel>> {
    const xmlString = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    const trackPoints = xmlDoc.getElementsByTagName('trkpt');
    const coordinates: Array<CoordonnesEtapeModel> = [];


    for (let i = 0; i < trackPoints.length; i++) {
        const latAttr = trackPoints[i].getAttribute('lat');
        const lngAttr = trackPoints[i].getAttribute('lon');
        if (latAttr !== null && lngAttr !== null) {
            const lat = parseFloat(latAttr);
            const lng = parseFloat(lngAttr);
            const newCoordinate: CoordonnesEtapeModel = { latitude: lat, longitude: lng, etape_id: etape_id };
            coordinates.push(newCoordinate);
        }
    }
    return coordinates;
}


async function handleFileChange(event: Event) {
    loadingFichier.value = true;
    const target = event.target as HTMLInputElement;

    fileOK.value = (target !== null && target.files !== null);

    const coordEnCommun = ref<Array<CoordonnesEtapeModel>>([]);
    const memo = fichierGpx.value;

    if (target !== null && target.files !== null) {

        if (target.files.length > 0 && target.files[0].size < 200000) {
            fichierGpx.value = target.files[0];

            sizeOk.value = true;
            const coordEtape = await processGPXFile(fichierGpx.value, 1);

            
            if (coordEtape.length > 0 && memo != fichierGpx.value) {

                await nextTick(); // attendre la mise à jour du DOM
                coordEnCommun.value = await traceEtapeOnParcours(coordEtape, parcoursModel.value.coordonneesList);
            }
            if (coordEnCommun.value.length > 2) {
                coordApercu.value = coordEnCommun.value;
            } else {
                coordApercu.value.splice(0, coordApercu.value.length);
            }
        } else {
            console.log("fichier invalide");
            sizeOk.value = false;
        }
    }
    loadingFichier.value = false;
}


async function addEtape() {
    const formData = new FormData();
    formData.append('startDate', startDate.value);
    formData.append('endDate', endDate.value);
    const dateStart = new Date(startDate.value);
    const dateEnd = new Date(endDate.value);

    const coordinates: CoordonnesEtapeModel[] = [];
    const nouvelleEtape: EtapeModel = { parcours_id: parcoursId, coordonneesList: coordinates, startDate: dateStart, endDate: dateEnd };
    var etape: EtapeModel;
    loading.value = true;
    try {
        etape = await etapeService.setEtape(nouvelleEtape, parcoursId);
        //ajout des coordonnées après obtention de l'id
        await update(etape.id!);

    } catch (e) {

    }
    loading.value = false;

    router.push({ name: 'parcoursDetail', params: { parcoursId: parcoursId } });

}

async function update(id: number) {
    var etape: EtapeModel;
    etape = await etapeService.getEtape(id);
    const formData = new FormData();
    formData.append('startDate', startDate.value);
    formData.append('endDate', endDate.value);
    formData.append('fichierGpx', fichierGpx.value);


    const coord = ref<Array<CoordonnesEtapeModel>>([]);

    coord.value = coordApercu.value;
    try {
        if (coord) {

            var distance = CalculDistance(coord.value);
            const etapeToSave: EtapeModel = { id: etape.id, coordonneesList: coord.value, parcours_id: parcoursId, distance: distance, startDate: etape.startDate, endDate: etape.endDate };
            await etapeService.updateEtape(parcoursId, etapeToSave);
            console.log(distance);
        }
    } catch (e) {

    }
}

</script>