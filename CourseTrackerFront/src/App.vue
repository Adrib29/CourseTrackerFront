<template>
  <Navbar />
  <main class="container-fluid" style="margin-top: 40px;">
    <RouterView v-slot="{ Component }">
      <Alert v-if="error" variant="danger" dismissible @dismissed="error = false"> Erreur </Alert>
      <Suspense v-else timeout="0">
        <component :is="Component" />
        <template #fallback>Loading...</template>
      </Suspense>
    </RouterView>
  </main>
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';
import Navbar from './components/Navbar.vue';

const error = ref(false);
onErrorCaptured((e: unknown) => {
  console.warn(e);
  error.value = true;
  return false;
});
</script>

<style>
    .btn-primary, .btn-primary:active, .btn-primary:visited {
        background-color: #1e3d59 !important;
        border-color: #1e3d59 !important;
        
    }
    .btn-primary:hover{
      background-color: #061149 !important;
      border-color: #061149 !important;
    }
    .btn-secondary, .btn-secondary:hover, .btn-secondary:active, .btn-secondary:visited {
        background-color: #f5f0e1 !important;
        color: #1e3d59 !important;
    }

    .dropdown-item:focus, .dropdown-item:hover {
      background-color: #ff6e40 !important;
      color: #1e3d59 !important;
    }
    
    .list-group-item.first-child{
      background-color: #1e3d59 !important;
      color: #ffffff !important;
    }

    .progress-bar {
    background-color: #ff6e40 !important;
    }

    .list-group-item.active {
      background-color: #ff6e40 !important;
      border-color: black;
    }
    

</style>
