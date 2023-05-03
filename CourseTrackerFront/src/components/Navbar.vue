<template>
<nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <RouterLink to="/" class="navbar-brand">
        <img src="\images\CourseTracker_logo.png" class="nav-bar icon" alt="Logo" height="70">
    </RouterLink>
    <button class="navbar-toggle navbar-toggler  navbar-toggler-right" type="button" style="border: 2px solid #E0E0E0;" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon icon-bar"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <div class="dropdown">
            <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
              Parcours
            </button>
            <ul class="dropdown-menu">
              <li><RouterLink to="/parcours" class="dropdown-item" > Mes parcours </RouterLink></li>
              <li><RouterLink to="/parcours/add" class="dropdown-item" > Ajouter un parcours </RouterLink></li>
            </ul>
          </div>
          
      <ul class="navbar-nav me-auto">
        <li class="nav-item">

        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<script setup lang="ts">

</script>


<style>

.navbar {
  background-color: #1e3d59;
}

.navbar img {
  max-height: 100%;
  width: auto;
}
  .navbar .navbar-toggler .icon-bar {
    color: #f5f0e1 !important;
}
</style>
