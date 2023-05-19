<template>
  <form class="row g-3">
    <div class="mb-3">
      <label class="from-control">Date de début : </label>
      <input v-model="startDate" type="datetime-local" class="form-control" required>

    </div>
    <div class="mb-3">
      <label class="from-control">Date de fin : </label>
      <input v-model="endDate" type="datetime-local" class="form-control" :class="{ 'is-invalid': !dateIsValid }"
        required>
      <span class="invalid-feedback" v-if="!dateIsValid">La date de fin doit être postérieure à la date de début.</span>
    </div>
  </form>

  <button class="btn btn-primary mb-3" background-color="#1e3d59" :disabled="!formIsValid" @click="clicked()"
    :class="{ 'is-invalid': !props.markerPlaced }"> Enregistrer </button>
  <span class="invalid-feedback" v-if="!props.markerPlaced">Les markers ne sont pas en place.</span>
</template>

<script setup lang="ts">
import { EtapeModel } from '../models/EtapeModel';
import { computed, ref } from 'vue';


const props = defineProps<{
  etapeModel?: EtapeModel;
  markerPlaced: boolean;
}>();

const startDate = ref(props.etapeModel?.startDate ? props.etapeModel.startDate.toLocaleString().slice(0, 16) : new Date().toISOString().slice(0, 16));
const endDate = ref(props.etapeModel?.endDate ? props.etapeModel.endDate.toLocaleString().slice(0, 16) : new Date().toISOString().slice(0, 16));

const dateIsValid = computed(() => { return endDate.value > startDate.value });
const formIsValid = computed(() => { return (props.markerPlaced && dateIsValid) });

const emit = defineEmits<{
  (e: 'submitForm', startDate: string, endDate: string): void;
}>();

function clicked() {
  emit('submitForm', startDate.value!, endDate.value!);
}


</script>