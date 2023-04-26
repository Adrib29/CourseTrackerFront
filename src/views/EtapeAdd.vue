<template>
    <GoogleMap 
      api-key=""
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="15"
      @click="addMarker($event)"
      >
        <Polyline :options="flightPath" />
    <Marker v-for="(marker, index) in markers" :key="index" :options="index === 0 ? {position:marker,...markerOptions} : {position:marker,...markerOptionsArrivee}" @dragend="onMarkerDragEnd(index, $event)"/>
    </GoogleMap>
    <button class="btn btn-primary mb-3" background-color="#1e3d59" @click="addEtape">Valider</button>
  </template>
  
<script setup lang="ts">

import { GoogleMap, Marker, Polyline } from 'vue3-google-map'
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useParcoursService } from '../composables/ParcoursService';
import { ParcoursModel } from '../models/ParcoursModel';
import { CoordonnesEtapeModel } from '../models/CoordonnesEtapeModel';
import { CoordonnesModel } from '../models/CoordonnesModel';
import { EtapeModel } from '../models/EtapeModel';
import { useEtapeService } from '../composables/EtapeService';

const route = useRoute();
const parcoursId = +route.params.parcoursId;
const parcoursSerrvice = useParcoursService();

const parcoursModel = ref<ParcoursModel>(await parcoursSerrvice.getParcours(parcoursId));

interface Marker {
  lat: number | null;
  lng: number | null;
}

const markers = ref<{ lat: number, lng: number }[]>([]);
const markerOptions = {label: "Depart", title: "Depart", draggable: true};
const markerOptionsArrivee = {label: "Arrivee", title: "Arrivee", draggable: true};

const etapeService = useEtapeService();

//Initialisation du centre de la map
let center = { lat: 48.419603, lng: -4.459316 }
if (parcoursModel.value?.coordonneesList?.[0]) {
    center.lat = parcoursModel.value.coordonneesList[0].latitude;
    center.lng = parcoursModel.value.coordonneesList[0].longitude;
}

const flightPath = {
    path: transformerCoordonnees(),
    geodesic: true,
    strokeColor: "#FF0000",
    strokeOpacity: 1.0,
    strokeWeight: 2,
};

function addMarker(event: google.maps.MapMouseEvent ) {
        if(markers.value.length < 2){
            markers.value.push({ lat: event.latLng!.lat(), lng: event.latLng!.lng() });
        }

}

function transformerCoordonnees() {
return parcoursModel.value.coordonneesList.map(coord => {
    return {lat: coord.latitude, lng: coord.longitude};
});
}

function addMarkerOnPolyline(lati: number, longi: number, index: number) {
        markers.value[index] = ({ lat: lati, lng: longi });
}

function getClosestPointOnPolyline(lat: number, long: number) {
    let closestDistance = Number.MAX_VALUE;
    let closestPoint: Marker = { lat: null, lng: null,};
    let point = {lat: lat,lng: long,};
    
    flightPath.path.forEach((polylinePoint) => {

    const distance = getDistance(point.lat, polylinePoint.lat,point.lng, polylinePoint.lng);
    if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint.lat = polylinePoint.lat;
        closestPoint.lng = polylinePoint.lng;
    }
    });
    return closestPoint;
}
function getDistance(lat1: number, lat2: number, lng1: number, lng2: number) {
    const latDiff = lat1 - lat2;
    const lngDiff = lng1 - lng2;
    const result = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);

    return result
}


function onMarkerDragEnd(index: number, event: google.maps.MapMouseEvent) {
    const newPosition = event.latLng!;   
    const lat = newPosition.lat();
    const lng = newPosition.lng();    
    var closestPoint = getClosestPointOnPolyline(lat, lng);           
    addMarkerOnPolyline(closestPoint.lat!,closestPoint.lng!, index);
    
}


async function addEtape(){
    if (parcoursModel.value?.coordonneesList?.[0]) {
    center.lat = parcoursModel.value.coordonneesList[0].latitude;
    center.lng = parcoursModel.value.coordonneesList[0].longitude;
    }

    const coordinates: CoordonnesEtapeModel[] = [];
    var coord: CoordonnesEtapeModel[] = [];
    const nouvelleEtape: EtapeModel = { parcours_id: parcoursId, coordonneesList: coordinates };
    var etape: EtapeModel;
    etape  = await etapeService.setEtape(nouvelleEtape, parcoursId);

    //ajout des coordonnées après obtention de l'id
    update(etape.id!);
}

async function update(id : number) {
    var etape: EtapeModel;
    var saveCoord : Boolean = false;
    etape  = await etapeService.getEtape(parcoursId,id);
    var coord: CoordonnesEtapeModel[] = [];
        try{
            for(let c of parcoursModel.value.coordonneesList) {
                
                if(markers.value[0].lat === c.latitude && markers.value[0].lng === c.longitude || markers.value[1].lat === c.latitude && markers.value[1].lng === c.longitude){
                    saveCoord = !saveCoord;
                }
                if(saveCoord === true){
                    var coordToAdd : CoordonnesEtapeModel = {latitude: c.latitude, longitude: c.longitude, etape_id: etape.id!}
                    coord.push(coordToAdd);
                }
             }
            for(let c of coord){
                console.log(c.latitude);
                console.log("c");
            }
        if(coord){
            const etapeToSave: EtapeModel = { id: etape.id, coordonneesList: coord, parcours_id: parcoursId };
            await etapeService.updateEtape(parcoursId,etapeToSave);
        }
        } catch(e){

        }
}




</script>