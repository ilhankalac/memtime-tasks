<script setup lang="ts">
import { useClients } from '@/composables/useClients'
import { computed, onMounted } from 'vue'

const { clients, fetchClients } = useClients()

onMounted(() => {
  fetchClients()
})

const treeItems = computed(() => 
  clients.map(client => ({
    id: client.id,
    title: client.name,
    children: [
      { id: `${client.id}-desc`, title: `Description: ${client.description}` },
      { id: `${client.id}-status`, title: `Status: ${client.status}` },
      { id: `${client.id}-created`, title: `Created: ${client.createdAt}` },
      { id: `${client.id}-updated`, title: `Updated: ${client.updatedAt}` },
    ]
  }))
)
</script>

<template>
  <div>
    <h1>Clients</h1>
    <v-treeview :items="treeItems" item-value="id"></v-treeview>
  </div>
</template>
<style>
</style>
