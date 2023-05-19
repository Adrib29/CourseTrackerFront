<template>
    <spinner v-if="loading" />
    <div v-else>
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-8">
                    <GoogleMap api-key="" style="width: 100%; height: 700px" :center="center" :zoom=zoomValue
                        @click="addMarker($event)">
                        <Polyline :options="parcoursPath" />
                        <template v-for="(etape, index) in etapesModel" :key="index">
                            <Polyline v-if="etape.coordonneesList" :options="{
                                path: CoordToPosition(etape.coordonneesList),
                                ...etapePath,
                            }" />
                        </template>
                        <Marker v-for="(marker, index) in markers" :key="index" :options="index === 0
                                ? { position: marker, ...markerOptions }
                                : { position: marker, ...markerOptionsArrivee }
                            " @dragend="onMarkerDragEnd(index, $event)">
                        </Marker>
                    </GoogleMap>
                </div>
                <div class="col-md-4 border shadow p-3 mb-5">
                    <h1>{{ parcoursModel.nom }}</h1>
                    <h3>Nouvelle étape :</h3>
                    <EtapeForm :markerPlaced="markers.length >= 2" @submitForm="addEtape" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { GoogleMap, Marker, Polyline, InfoWindow } from "vue3-google-map";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useParcoursService } from "../composables/ParcoursService";
import { ParcoursModel } from "../models/ParcoursModel";
import { CoordonnesEtapeModel } from "../models/CoordonnesEtapeModel";
import { EtapeModel } from "../models/EtapeModel";
import { useEtapeService } from "../composables/EtapeService";
import router from "../router";
import { CoordToPosition, CalculDistance, getEtapeWithMarkers, GetZoomMap, GetMiddleCoord } from "../utils/Coordonnes";
import EtapeForm from "../components/EtapeForm.vue";

const route = useRoute();
const parcoursId = +route.params.parcoursId;
const parcoursSerrvice = useParcoursService();
const etapeService = useEtapeService();
const parcoursModel = ref<ParcoursModel>(await parcoursSerrvice.getParcours(parcoursId));
const etapesModel = ref<Array<EtapeModel>>(await etapeService.list(parcoursId));

const markers = ref<{ lat: number; lng: number }[]>([]);
const markerOptions = { label: "Depart", title: "Depart", draggable: true };
const markerOptionsArrivee = {
    label: "Arrivee",
    title: "Arrivee",
    draggable: true,
};

const loading = ref(false);

const zoomValue = GetZoomMap(parcoursModel.value.coordonneesList);
//Initialisation du centre de la map
let MiddleCoord = GetMiddleCoord(parcoursModel.value?.coordonneesList)
let center = MiddleCoord
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
    geodesic: true,
    strokeColor: "#39FF14",
    strokeOpacity: 1.0,
    strokeWeight: 2,
};

function addMarker(event: google.maps.MapMouseEvent) {
    var idx = markers.value.length;
    if (markers.value.length < 2) {
        markers.value.push({ lat: event.latLng!.lat(), lng: event.latLng!.lng() });
        onMarkerDragEnd(idx, event);
    }
}

function addMarkerOnPolyline(lati: number, longi: number, index: number) {
    markers.value[index] = { lat: lati, lng: longi };
}

function getClosestPointOnPolyline(lat: number, long: number) {
    let closestDistance = Number.MAX_VALUE;
    let closestPoint: { lat: number | null, lng: number | null };
    let point = { lat: lat, lng: long };

    closestPoint = {lat: null,lng: null};

    if (parcoursPath.path != null) {
        parcoursPath.path.forEach((polylinePoint) => {
            const distance = getDistance(
                point.lat,
                polylinePoint.lat,
                point.lng,
                polylinePoint.lng
            );
            if (distance < closestDistance) {
                closestDistance = distance;
                closestPoint.lat = polylinePoint.lat;
                closestPoint.lng = polylinePoint.lng;
            }
        });
    }

    return closestPoint;
}
function getDistance(lat1: number, lat2: number, lng1: number, lng2: number) {
    const latDiff = lat1 - lat2;
    const lngDiff = lng1 - lng2;
    const result = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    return result;
}

function onMarkerDragEnd(index: number, event: google.maps.MapMouseEvent) {
    const newPosition = event.latLng!;
    const lat = newPosition.lat();
    const lng = newPosition.lng();
    var closestPoint = getClosestPointOnPolyline(lat, lng);
    addMarkerOnPolyline(closestPoint.lat!, closestPoint.lng!, index);
}

async function addEtape(startDate: string, endDate: string) {
    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);
    console.log(dateStart);
    console.log(dateEnd);
    if (parcoursModel.value?.coordonneesList?.[0]) {
        center.lat = parcoursModel.value.coordonneesList[0].latitude;
        center.lng = parcoursModel.value.coordonneesList[0].longitude;
    }

    const coordinates: CoordonnesEtapeModel[] = [];
    const nouvelleEtape: EtapeModel = {
        parcours_id: parcoursId,
        coordonneesList: coordinates,
        startDate: dateStart,
        endDate: dateEnd,
    };
    var etape: EtapeModel;
    loading.value = true;
    try {
        etape = await etapeService.setEtape(nouvelleEtape, parcoursId);
        //ajout des coordonnées après obtention de l'id
        await update(etape.id!);
    } catch (e) { }
    loading.value = false;

    router.push({ name: "parcoursDetail", params: { parcoursId: parcoursId } });
}

async function update(id: number) {
    var etape: EtapeModel;
    etape = await etapeService.getEtape(id);
    var coord: CoordonnesEtapeModel[] = [];
    try {
        coord = getEtapeWithMarkers(
            parcoursModel.value.coordonneesList,
            markers.value[0],
            markers.value[1],
            etape.id!
        );

        if (coord) {
            var distance = CalculDistance(coord);
            const etapeToSave: EtapeModel = {
                id: etape.id,
                coordonneesList: coord,
                parcours_id: parcoursId,
                distance: distance,
                startDate: etape.startDate,
                endDate: etape.endDate,
            };
            await etapeService.updateEtape(parcoursId, etapeToSave);
        }
    } catch (e) { }
}
</script>
