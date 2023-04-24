<template>
    <GoogleMap 
      api-key=""
      style="width: 100%; height: 500px"
      :center="center"
      :zoom="15"
      @click="addMarker">
        <Polyline :options="flightPath" />
        <Polyline :options="flightPathdone" />
      <Marker v-for="(marker, index) in markers" :key="index" :options={position:marker.position,...markerOptions} @click="removeMarker(index)" @dragend="onMarkerDragEnd(index, $event)"/>
    </GoogleMap>
    <button >Changer la position</button>
  </template>
  
  <script>
  import { defineComponent } from 'vue'
  import { GoogleMap, Marker, Polyline } from 'vue3-google-map'
  import { ref } from 'vue';
  
  export default {
    components:{
      GoogleMap,
      Marker,
      Polyline,
    },
    setup() {
      const center = ref({ lat: 49.4975, lng: 0.20198 });
      const zoom = ref(10);
      const markers = ref([]);
      const markerOptions = {label: "L", title: "LADY LIBERTY", draggable: true};
      
      function addMarker(event) {
        markers.value.push({
          position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
        });
      }

      function addMarkerOnPolyline(lati, longi) {
        markers.value.push({
          position: { lat: lati, lng: longi },
        });
      }
  
      function removeMarker(index) {
        markers.value.splice(index, 1);
      }

      function getClosestPointOnPolyline(lat, long) {
      let closestDistance = Number.MAX_VALUE;
      let closestPoint = { lat: null, lng: null,};
      let point = {lat: lat,lng: long,};
      
      this.flightPathdone.path.forEach((polylinePoint) => {

      const distance = this.getDistance(point.lat, polylinePoint.lat,point.lng, polylinePoint.lng);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPoint.lat = polylinePoint.lat;
          closestPoint.lng = polylinePoint.lng;
        }
      });
        return closestPoint;
    }
        function getDistance(lat1, lat2, lng1, lng2) {
        const latDiff = lat1 - lat2;
        const lngDiff = lng1 - lng2;
        const result = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff);
        
        return result
        }

      const flightPlanCoordinates = [
      { lat: 49.4975, lng: 0.20198 },
       { lat: 49.49907, lng: 0.20095 },
       { lat: 49.50486, lng: 0.19889 },
       { lat: 49.5033, lng: 0.19202 },
       { lat: 49.50236, lng: 0.1875 }, 
       { lat: 49.50275, lng: 0.18244 }, 
       { lat: 49.50437, lng: 0.17626 }, 
       { lat: 49.50501, lng: 0.17541 },
       { lat: 49.50482, lng: 0.17159 },
       { lat: 49.50485, lng: 0.16893 },
       { lat: 49.50429, lng: 0.16769 },
       { lat: 49.50429, lng: 0.16481 },
       { lat: 49.50365, lng: 0.16151 },
       { lat: 49.50331, lng: 0.15704 },
       { lat: 49.5027, lng: 0.15284 },
       { lat: 49.50326, lng: 0.15254 },
       { lat: 49.50343, lng: 0.14945 },
       { lat: 49.50345, lng: 0.14747 },
       { lat: 49.50368, lng: 0.14713 },
       { lat: 49.50398, lng: 0.14824 },
       { lat: 49.50446, lng: 0.14829 },
       { lat: 49.50437, lng: 0.14477 },
       { lat: 49.50462, lng: 0.14095 },
       { lat: 49.50449, lng: 0.13739 },
       { lat: 49.50437, lng: 0.13481 },

    ];
    const flightPlanCoordinatesdone = [
       { lat: 49.50437, lng: 0.13481 },
       { lat: 49.50362, lng: 0.13271 },
       { lat: 49.50354, lng: 0.13185 },
       { lat: 49.50298, lng: 0.13052 },
       { lat: 49.5037, lng: 0.13151 },
       { lat: 49.50318, lng: 0.12777 },
       { lat: 49.50429, lng: 0.13121 },
       { lat: 49.5034, lng: 0.12365 },
       { lat: 49.50223, lng: 0.11803 },
       { lat: 49.50075, lng: 0.11241 },
       { lat: 49.49925, lng: 0.1079 },
       { lat: 49.49869, lng: 0.10705 },
       { lat: 49.49774, lng: 0.10906 },
       { lat: 49.49665, lng: 0.11031 },
       { lat: 49.49796, lng: 0.11529 },  
       { lat: 49.49554, lng: 0.11619 },
       { lat: 49.49584, lng: 0.11855 },
       { lat: 49.49587, lng: 0.11855 },
       { lat: 49.49584, lng: 0.11855 },
    ];
    const flightPath = {
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: "#FFF000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };
    const flightPathdone = {
      path: flightPlanCoordinatesdone,
      geodesic: true,
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    };
  
      return {
        center,
        zoom,
        markers,
        addMarker,
        removeMarker,
        markerOptions,
        flightPathdone,
        flightPath,
        getDistance,
        getClosestPointOnPolyline,
        addMarkerOnPolyline,
      };
    },
    methods:{
        onMarkerDragEnd(index, event) {
            const newPosition = event.latLng;  
            console.log("coucou");  
            //this.markers.value.splice(index, 1);      
            var closestPoint = this.getClosestPointOnPolyline(newPosition.lat(), newPosition.lng());           
            this.addMarkerOnPolyline(closestPoint.lat,closestPoint.lng);
            this.removeMarker(index);
        },
    }
  };
  </script>