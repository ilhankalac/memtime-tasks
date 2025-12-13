<script setup lang="ts">
import { useClients } from '@/composables/useClients'
import { onMounted } from 'vue'
import ClientTree from '@/components/ClientTree.vue'

const { clients, fetchClients, fetchProjects } = useClients()

onMounted(() => {
  fetchClients()
})

const handleClientClick = async (clientId: number) => {
  await fetchProjects(clientId)
}
</script>

<template>
  <div>
    <div class="text-h5 font-weight-light">Clients</div>
    <ClientTree :clients="clients" @client-click="handleClientClick" />
  </div>
</template>
<style>
</style>
