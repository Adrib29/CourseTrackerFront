<template>
    <div class="text-center" style="margin-top: 100px">
      <div>
        <h1>
          CourseTracker
        </h1>
    </div>
=       <div>
          <RouterLink to="/parcours" class="btn btn-large btn-primary me-2"> Mes parcours </RouterLink>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import router from '@/router';
  
  </script>


<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-form,
.fade-leave-to {
  opacity: 0;
}
</style>

  