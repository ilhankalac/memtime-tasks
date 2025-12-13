<script setup lang="ts">
import { useClients } from '@/composables/useClients'
import { onMounted } from 'vue'
import ClientTree from '@/components/ClientTree.vue'

const {
  clients,
  fetchClients,
  fetchProjects,
  fetchTasks,
  hasMoreClients,
  hasMoreProjects,
  hasMoreTasks
} = useClients()

onMounted(() => {
  fetchClients()
})

const handleClientClick = async (clientId: number) => {
  await fetchProjects(clientId)
}

const handleProjectClick = async (projectId: number) => {
  await fetchTasks(projectId)
}

const handleLoadMoreClients = async () => {
  await fetchClients()
}

const handleLoadMoreProjects = async (clientId: number) => {
  await fetchProjects(clientId)
}

const handleLoadMoreTasks = async (projectId: number) => {
  await fetchTasks(projectId)
}
</script>

<template>
  <div>
    <ClientTree
      :clients="clients"
      :has-more-clients="hasMoreClients"
      :has-more-projects="hasMoreProjects"
      :has-more-tasks="hasMoreTasks"
      @client-click="handleClientClick"
      @project-click="handleProjectClick"
      @load-more-clients="handleLoadMoreClients"
      @load-more-projects="handleLoadMoreProjects"
      @load-more-tasks="handleLoadMoreTasks"
    />
  </div>
</template>
<style>
</style>
