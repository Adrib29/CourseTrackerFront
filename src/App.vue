<template>
  <Navbar />
  <main class="container" style="margin-top: 70px">
    <p>coucouc</p>
  </main>
</template>

<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue';
import Navbar from '@/components/Navbar.vue';

const error = ref(false);
onErrorCaptured((e: unknown) => {
  console.warn(e);
  error.value = true;
  return false;
});
</script>
