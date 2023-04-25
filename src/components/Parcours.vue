<template>
    <div>
      <h1>{{ parcoursModel.nom }}</h1>
      <h2> {{  }}</h2>
      <div class="row">
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  import { ParcoursModel } from '../models/ParcoursModel';
  import { GoogleMap, Marker, Polyline } from 'vue3-google-map'

  const props = defineProps<{
    parcoursModel: ParcoursModel;
  }>();
  
  </script>
  