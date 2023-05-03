<template>
    <div>
      <h1>{{ parcoursModel.nom }}</h1>
      <h2> {{ etapeModel.id  }}  </h2>
      <h2> {{ etapeModel.parcours_id  }}  </h2>
      <GoogleMap 
        api-key=""
        style="width: 100%; height: 500px"
        :center="center"
        :zoom="15"
        >
        <Polyline :options="flightPath" />
        <Polyline v-if="etapeModel.coordonneesList" :options="{ path: CoordToPosition(etapeModel.coordonneesList),...etapePath }"> 
        </Polyline>
        <Marker v-for="(marker, index) in markers" :key="index" :options="index === 0 ? {position:marker,...markerOptions} : {position:marker,...markerOptionsArrivee}" @dragend="onMarkerDragEnd(index, $event)">

        </Marker>
        </GoogleMap>
        <button class="btn btn-primary mb-3" background-color="#1e3d59" @click="saveEtape">Sauvegarder</button>      
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { GoogleMap, Marker, Polyline } from 'vue3-google-map'
  import { EtapeModel } from '../models/EtapeModel';
  import { useEtapeService } from '../composables/EtapeService';
  import { useRoute } from 'vue-router';
  import { useParcoursService } from '../composables/ParcoursService';
  import { CalculDistance, CoordToPosition, GetMiddleCoord } from '../utils/Coordonnes';
  import { onMounted } from 'vue'
  import router from '../router';
  import { CoordonnesEtapeModel } from '../models/CoordonnesEtapeModel';



  const route = useRoute();
  const etapeId = +route.params.etapeId;
  const parcoursId = +route.params.parcoursId;
  const etapeService = useEtapeService();
  const parcoursSerrvice = useParcoursService();

  const parcoursModel = ref<ParcoursModel>(await parcoursSerrvice.getParcours(parcoursId));
  const etapeModel = ref<EtapeModel>(await etapeService.getEtape(etapeId));

  interface Marker {
    lat: number | null;
    lng: number | null;
  }
  const markers = ref<{ lat: number, lng: number }[]>([]);
  const markerOptions = {label: "Depart", title: "Depart", draggable: true};
  const markerOptionsArrivee = {label: "Arrivee", title: "Arrivee", draggable: true};


  //Initialisation du centre de la map
  let MiddleCoord = GetMiddleCoord(etapeModel.value?.coordonneesList)
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


    onMounted(() => {
        
        let start = etapeModel.value.coordonneesList.at(0);
        let end = etapeModel.value.coordonneesList.at(etapeModel.value.coordonneesList.length-1);
        console.log(start?.latitude);
        console.log(start?.longitude);
        console.log(end?.latitude);
        console.log(end?.longitude);
        
        markers.value.push({ lat: start!.latitude, lng: start!.longitude });
        markers.value.push({ lat: end!.latitude, lng: end!.longitude });
        /*addMarkerOnPolyline(start!.latitude,start!.longitude,0);
        addMarkerOnPolyline(end!.latitude,end!.longitude,1);*/
    })

  async function saveEtape() {
    var etape: EtapeModel;
    var saveCoord : Boolean = false;
    var reverseCoord : Boolean = false;
    etape  = etapeModel.value;
    var coord: CoordonnesEtapeModel[] = [];
        try{
            for(let c of parcoursModel.value.coordonneesList) {
                
                if(markers.value[0].lat === c.latitude && markers.value[0].lng === c.longitude || markers.value[1].lat === c.latitude && markers.value[1].lng === c.longitude){
                    saveCoord = !saveCoord;
                    if(markers.value[1].lat === c.latitude && markers.value[1].lng === c.longitude && saveCoord){
                        reverseCoord = true;
                    }
                }
                if(saveCoord === true){
                    var coordToAdd : CoordonnesEtapeModel = {latitude: c.latitude, longitude: c.longitude, etape_id: etape.id!}
                    coord.push(coordToAdd);
                }
             }
             if(reverseCoord){
                coord.reverse();
             }
        if(coord){
            var distance = CalculDistance(coord);
            const etapeToSave: EtapeModel = { id: etape.id, coordonneesList: coord, parcours_id: parcoursId, distance: distance };
            await etapeService.updateEtape(parcoursId,etapeToSave);
            console.log(distance);
        }
        } catch(e){

        }
        router.push({ name: 'parcoursDetail', params: { parcoursId: parcoursId } })
  }
  
  </script>
  