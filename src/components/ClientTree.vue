<script setup lang="ts">
import { ref } from 'vue'
import type { Client } from '@/types/entities'

interface Props {
  clients: Client[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  clientClick: [clientId: number]
}>()

const expandedClients = ref<Set<number>>(new Set())
const expandedProjects = ref<Set<string>>(new Set())

const toggleClient = (clientId: number) => {
  if (expandedClients.value.has(clientId)) {
    expandedClients.value.delete(clientId)
  } else {
    expandedClients.value.add(clientId)
    emit('clientClick', clientId)
  }
}

const toggleProject = (projectId: string) => {
  if (expandedProjects.value.has(projectId)) {
    expandedProjects.value.delete(projectId)
  } else {
    expandedProjects.value.add(projectId)
  }
}

const isClientExpanded = (clientId: number) => expandedClients.value.has(clientId)
const isProjectExpanded = (projectId: string) => expandedProjects.value.has(projectId)
</script>

<template>
  <div class="client-tree">
    <div v-for="client in clients" :key="client.id" class="tree-item">
      <!-- Client -->
      <div
        class="tree-item-content clickable"
        @click="toggleClient(client.id)"
      >
        <span class="tree-item-toggle">
          {{ isClientExpanded(client.id) ? '▼' : '▶' }}
        </span>
        <span class="tree-item-icon">📁</span>
        <span class="tree-item-title">{{ client.name }}</span>
      </div>

      <!-- Client Details -->
      <div v-if="isClientExpanded(client.id)" class="tree-item-children">
        <div class="tree-item-content data-item level-1">
          <span class="tree-item-toggle-placeholder" />
          <span class="tree-item-title"><strong>Description:</strong> {{ client.description }}</span>
        </div>
        <div class="tree-item-content data-item level-1">
          <span class="tree-item-toggle-placeholder" />
          <span class="tree-item-title"><strong>Status:</strong> <span :class="`status-badge status-${client.status}`">{{ client.status }}</span></span>
        </div>
        <div class="tree-item-content data-item level-1">
          <span class="tree-item-toggle-placeholder" />
          <span class="tree-item-title"><strong>Created:</strong> {{ client.createdAt }}</span>
        </div>
        <div class="tree-item-content data-item level-1">
          <span class="tree-item-toggle-placeholder" />
          <span class="tree-item-title"><strong>Updated:</strong> {{ client.updatedAt }}</span>
        </div>

        <!-- Projects -->
        <div v-for="project in client.projects" :key="project.id" class="tree-item">
          <div
            class="tree-item-content clickable level-1"
            @click="toggleProject(`${client.id}-${project.id}`)"
          >
            <span class="tree-item-toggle">
              {{ isProjectExpanded(`${client.id}-${project.id}`) ? '▼' : '▶' }}
            </span>
            <span class="tree-item-icon">📁</span>
            <span class="tree-item-title">{{ project.name }}</span>
          </div>

          <!-- Project Details -->
          <div v-if="isProjectExpanded(`${client.id}-${project.id}`)" class="tree-item-children">
            <div class="tree-item-content data-item level-2">
              <span class="tree-item-toggle-placeholder" />
              <span class="tree-item-title"><strong>Status:</strong> <span :class="`status-badge status-${project.status}`">{{ project.status }}</span></span>
            </div>
            <div class="tree-item-content data-item level-2">
              <span class="tree-item-toggle-placeholder" />
              <span class="tree-item-title"><strong>Created:</strong> {{ project.createdAt }}</span>
            </div>
            <div class="tree-item-content data-item level-2">
              <span class="tree-item-toggle-placeholder" />
              <span class="tree-item-title"><strong>Updated:</strong> {{ project.updatedAt }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.client-tree {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 14px;
  user-select: none;
  background: #ffffff;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  padding: 8px;
}

.tree-item {
  margin: 2px 0;
}

.tree-item-content {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  transition: all 0.2s ease;
  border-radius: 6px;
}

.tree-item-content.clickable {
  cursor: pointer;
}

.tree-item-content.clickable:hover {
  background-color: #f5f5f5;
  transform: translateX(2px);
}

.tree-item-content.data-item {
  cursor: default;
  padding: 8px 12px;
  color: #616161;
  font-size: 13px;
}

.tree-item-toggle {
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
  font-size: 10px;
  color: #757575;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.tree-item-content.clickable:hover .tree-item-toggle {
  color: #424242;
}

.tree-item-toggle-placeholder {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  flex-shrink: 0;
}

.tree-item-icon {
  margin-right: 10px;
  font-size: 18px;
  flex-shrink: 0;
  filter: grayscale(0.2);
}

.tree-item-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
}

.tree-item-content.data-item .tree-item-title {
  font-weight: 400;
}

.tree-item-children {
  margin: 4px 0;
}

.level-1 {
  padding-left: 20px;
}

.level-2 {
  padding-left: 40px;
}

.status-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.status-in-progress {
  background-color: #e3f2fd;
  color: #1976d2;
}

.status-pending {
  background-color: #fff3e0;
  color: #f57c00;
}

.status-completed {
  background-color: #e8f5e9;
  color: #388e3c;
}
</style>
