<template>
    <nav class="navbar navbar-expand-md navbar-light bg-light">
        <div class="container-fluid">
            <router-link to="/" class="navbar-brand">CourseTracker</router-link>
            <button @click="toggleNavbar()" type="button" class="navbar-toggler">
            <span class="navbar-toggler-icon"></span>
            </button>
            <div id="navbar" class="navbar-collapse" :class="{ collapse : navbarCollapsed}">
            <ul class="navbar-nav me-auto">
                <li class="nav-item">
                    <router-link to="/parcours" class="av-link"> Mes parcours  </router-link>
                </li>

            </ul>
            </div>
        </div>
    </nav>
</template>

  <script setup lang="ts">
import router from '@/router';
import { ref } from 'vue';

    const navbarCollapsed = ref(false);
    const toggleNavbar = () => {
        navbarCollapsed.value = !navbarCollapsed.value;
    }

  </script>
  
  <style></style>
  