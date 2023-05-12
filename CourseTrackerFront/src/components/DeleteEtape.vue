<template>
<button type="button" :class="classButton" data-bs-toggle="modal" :data-bs-target="'#EtapeModal-' + etape!.id" @click="updateEtape"> {{ textButton }} </button>   
<!-- Modal pour supression etape -->
<div class="modal fade" :id="'EtapeModal-' + etape!.id" tabindex="-1" aria-labelledby="EtapeModal" aria-hidden="true">
    <div class="modal-dialog">
    <div class="modal-content">
        <div class="modal-header">
        <h1 class="modal-title fs-5" :id="'EtapeModal-' + etape!.id">Supprimer ?</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
                <div> Êtes-vous sûre de vouloir supprimer ce parcours ? </div> 
        </div>
        <div class="btn-group" style="margin-bottom: 5px;">
        <button class="btn btn-danger mx-2" data-bs-dismiss="modal" @click="removeEtape">Supprimer</button>
        <button class="btn btn-primary mx-2" data-bs-dismiss="modal">Annuler</button>
        </div>
    </div>
    </div>
</div>
</template>
    
    <script setup lang="ts">
    import { useEtapeService } from '../composables/EtapeService';
    import { ref } from 'vue';
    import { EtapeModel } from '../models/EtapeModel';
    
    const etapeService = useEtapeService();
    
    const props = defineProps<{
        etapeModel: EtapeModel;
        classButton : String;
        textButton?: String;
    
    }>();
    
    const etape = ref<EtapeModel>();
    etape.value = props.etapeModel;
    
    async function removeEtape(){
   
        await etapeService.deleteEtape(etape.value!.id!);
        emitDeleted();
      }
    
    function updateEtape(){
        etape.value = props.etapeModel;
    }
    
      const emit = defineEmits<{
      (e: 'deleted'): void;
    }>();
    
    function emitDeleted() {
      emit('deleted');
    }
    
    
    </script>