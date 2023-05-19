<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-md-8">
                <GoogleMap api-key="" style="width: 100%; height: 700px" :center="center" :zoom=zoomValue>
                    <Polyline :options="flightPath" />
                    <Polyline v-if="etapeModel.coordonneesList" :options="{
                        path: CoordToPosition(etapeModel.coordonneesList),
                        ...etapePath,
                    }">
                    </Polyline>
                    <Marker v-for="(marker, index) in markers" :key="index" :options="index === 0
                        ? { position: marker, ...markerOptions }
                        : { position: marker, ...markerOptionsArrivee }" @dragend="onMarkerDragEnd(index, $event)">
                    </Marker>
                </GoogleMap>
            </div>
            <div class="col-md-4">
                <div>
                    <h1>Parcours : {{ parcoursModel.nom }}</h1>
                    <h2>{{ etapeModel.parcours_id }}</h2>
                </div>
                <div>
                    <EtapeForm :markerPlaced="markers.length >= 2" :etapeModel="etapeModel" @submitForm="saveEtape" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { ParcoursModel } from "../models/ParcoursModel";
import { GoogleMap, Marker, Polyline } from "vue3-google-map";
import { EtapeModel } from "../models/EtapeModel";
import { useEtapeService } from "../composables/EtapeService";
import { useRoute } from "vue-router";
import { useParcoursService } from "../composables/ParcoursService";
import { CalculDistance, CoordToPosition, GetMiddleCoord, GetZoomMap, getEtapeWithMarkers } from "../utils/Coordonnes";
import { onMounted } from "vue";
import router from "../router";
import { CoordonnesEtapeModel } from "../models/CoordonnesEtapeModel";
import EtapeForm from "../components/EtapeForm.vue";

const route = useRoute();
const etapeId = +route.params.etapeId;
const parcoursId = +route.params.parcoursId;
const etapeService = useEtapeService();
const parcoursSerrvice = useParcoursService();

const parcoursModel = ref<ParcoursModel>(
    await parcoursSerrvice.getParcours(parcoursId)
);
const etapeModel = ref<EtapeModel>(await etapeService.getEtape(etapeId));

const markers = ref<{ lat: number; lng: number }[]>([]);
const markerOptions = { label: "Depart", title: "Depart", draggable: true };
const markerOptionsArrivee = {
    label: "Arrivee",
    title: "Arrivee",
    draggable: true,
};

const zoomValue = GetZoomMap(etapeModel.value.coordonneesList);
//Initialisation du centre de la map
let MiddleCoord = GetMiddleCoord(etapeModel.value?.coordonneesList);
let center = MiddleCoord
    ? { lat: MiddleCoord.latitude, lng: MiddleCoord.longitude }
    : { lat: 48.419603, lng: -4.459316 };

const flightPath = {
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

function addMarkerOnPolyline(lati: number, longi: number, index: number) {
    markers.value[index] = { lat: lati, lng: longi };
}

function getClosestPointOnPolyline(lat: number, long: number) {
    let closestDistance = Number.MAX_VALUE;
    let closestPoint: { lat: number | null, lng: number | null };
    let point = { lat: lat, lng: long };
    closestPoint = {lat : null, lng : null};
    if (flightPath.path != null) {
        flightPath.path.forEach((polylinePoint) => {
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

onMounted(() => {
    let start = etapeModel.value.coordonneesList.at(0);
    let end = etapeModel.value.coordonneesList.at(
        etapeModel.value.coordonneesList.length - 1
    );
    markers.value.push({ lat: start!.latitude, lng: start!.longitude });
    markers.value.push({ lat: end!.latitude, lng: end!.longitude });
});

async function saveEtape(startDate: string, endDate: string) {
    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);

    var etape: EtapeModel;
    etape = etapeModel.value;
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
                startDate: dateStart,
                endDate: dateEnd,
            };
            await etapeService.updateEtape(parcoursId, etapeToSave);
        }
    } catch (e) { }
    router.push({ name: "parcoursDetail", params: { parcoursId: parcoursId } });
}
</script>
