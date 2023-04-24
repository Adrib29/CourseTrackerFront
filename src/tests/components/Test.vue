<template>
  <GoogleMap 
    api-key=""
    style="width: 100%; height: 500px"
    :center="center"
    :zoom="15"
    @click="addMarker">
    <Marker v-for="(marker, index) in markers" :key="index" :options={position:marker.position,...markerOptions} @click="removeMarker(index)"/>
  </GoogleMap>
  <button >Changer la position</button>
</template>

<script>
import { defineComponent } from 'vue'
import { GoogleMap, Marker } from 'vue3-google-map'
import { ref } from 'vue';

export default {
  components:{
    GoogleMap,
    Marker,
  },
  setup() {
    const center = ref({ lat: 48.8566, lng: 2.3522 });
    const zoom = ref(10);
    const markers = ref([]);
    const markerOptions = {label: "L", title: "LADY LIBERTY"};
    function addMarker(event) {
      markers.value.push({
        position: { lat: event.latLng.lat(), lng: event.latLng.lng() },
      });
    }

    function removeMarker(index) {
      markers.value.splice(index, 1);
    }

    return {
      center,
      zoom,
      markers,
      addMarker,
      removeMarker,
      markerOptions,
    };
  },
};
</script>