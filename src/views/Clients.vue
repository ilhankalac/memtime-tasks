<script setup lang="ts">
import { useClients } from '@/composables/useClients'
import { onMounted } from 'vue'
import ClientTree from '@/components/ClientTree.vue'

const { clients, fetchClients, fetchProjects, fetchTasks } = useClients()

onMounted(() => {
  fetchClients()
})

const handleClientClick = async (clientId: number) => {
  await fetchProjects(clientId)
}

const handleProjectClick = async (projectId: number) => {
  await fetchTasks(projectId)
}
</script>

<template>
  <div>
    <div class="text-h5 font-weight-light">Task 1</div>
    <ClientTree :clients="clients" @client-click="handleClientClick" @project-click="handleProjectClick" />
  </div>
</template>
<style>
</style>
