<template>
  <button type="button" :class="classButton" data-bs-toggle="modal" :data-bs-target="'#ParcoursModal-' + parcours!.id"
    @click="updateParcours"> {{ textButton }} </button>
  <!-- Modal pour supression etape -->
  <div class="modal fade" :id="'ParcoursModal-' + parcours!.id" tabindex="-1" aria-labelledby="ParcoursModal"
    aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" :id="'ParcoursModal-' + parcours!.id">Supprimer ?</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div> Voulez-vous supprimer ce parcours ? </div>
        </div>
        <div class="btn-group" style="margin-bottom: 5px;">
          <button class="btn btn-danger mx-2" data-bs-dismiss="modal" @click="removeParcours">Supprimer</button>
          <button class="btn btn-primary mx-2" data-bs-dismiss="modal">Annuler</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ParcoursModel } from '../models/ParcoursModel';
import { useParcoursService } from '../composables/ParcoursService';
import { ref } from 'vue';

const parcoursService = useParcoursService();

const props = defineProps<{
  parcoursModel: ParcoursModel;
  classButton: String;
  textButton?: String;

}>();

const parcours = ref<ParcoursModel>();
parcours.value = props.parcoursModel;

async function removeParcours() {
  await parcoursService.deleteParcours(parcours.value!.id!);
  emitDeleted();
}

function updateParcours() {
  parcours.value = props.parcoursModel;
}

const emit = defineEmits<{
  (e: 'deleted'): void;
}>();

function emitDeleted() {
  emit('deleted');
}


</script>