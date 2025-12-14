<script setup lang="ts">
import { ref } from 'vue'
import { VProgressLinear } from 'vuetify/components'
import type { Client } from '@/types/entities'
import { formatDate } from '@/utils/dateFormat'

interface Props {
  clients: Client[]
  hasMoreClients?: boolean
  hasMoreProjects?: Record<number, boolean>
  hasMoreTasks?: Record<number, boolean>
  loadingClients?: boolean
  loadingProjects?: Record<number, boolean>
  loadingTasks?: Record<number, boolean>
}

const props = defineProps<Props>()

const emit = defineEmits<{
  clientClick: [clientId: number]
  projectClick: [projectId: number]
  loadMoreClients: []
  loadMoreProjects: [clientId: number]
  loadMoreTasks: [projectId: number]
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

const toggleProject = (projectId: number) => {
  if (expandedProjects.value.has(String(projectId))) {
    expandedProjects.value.delete(String(projectId))
  } else {
    expandedProjects.value.add(String(projectId))
    emit('projectClick', projectId)
  }
}

const isClientExpanded = (clientId: number) => expandedClients.value.has(clientId)
const isProjectExpanded = (projectId: number) => expandedProjects.value.has(String(projectId))
</script>

<template>
  <div class="bg-white rounded-lg pa-2" style="border: 1px solid #e0e0e0; user-select: none;">
    <!-- Global loading bar for clients -->
    <v-progress-linear
      v-if="loadingClients"
      indeterminate
      color="primary"
      class="my-2 mx-2 rounded"
    />

    <!-- No data message -->
    <div v-if="!loadingClients && clients.length === 0" class="no-data-message">
      <v-icon size="64" color="grey-lighten-1">mdi-briefcase-outline</v-icon>
      <p class="text-h6 text-grey-darken-1 mt-4">No data available</p>
    </div>

    <div
      v-for="client in clients"
      :key="client.id"
      class="my-1"
    >
      <!-- Client -->
      <div
        class="tree-item"
        @click="toggleClient(client.id)"
      >
        <v-icon class="toggle" size="20">
          {{ isClientExpanded(client.id) ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
        </v-icon>
        <v-icon class="mr-2" color="primary" size="20">mdi-briefcase</v-icon>
        <span class="flex-1-1 font-weight-medium text-truncate">{{ client.name }}</span>
      </div>

      <!-- Client Details -->
      <div v-if="isClientExpanded(client.id)">
        <div class="d-flex align-center pa-2 pl-5 text-grey-darken-1 text-body-2">
          <span style="width: 20px; margin-right: 8px;" />
          <span class="flex-1-1"><strong>Description:</strong> {{ client.description }}</span>
        </div>
        <div class="d-flex align-center pa-2 pl-5 text-grey-darken-1 text-body-2">
          <span style="width: 20px; margin-right: 8px;" />
          <span class="flex-1-1">
            <strong>Status:</strong>
            <v-chip :color="client.status === 'completed' ? 'success' : client.status === 'in-progress' ? 'primary' : 'warning'" size="small" class="ml-2">
              {{ client.status }}
            </v-chip>
          </span>
        </div>
        <div class="d-flex align-center pa-2 pl-5 text-grey-darken-1 text-body-2">
          <span style="width: 20px; margin-right: 8px;" />
          <span class="flex-1-1"><strong>Created:</strong> {{ formatDate(client.createdAt) }}</span>
        </div>
        <div class="d-flex align-center pa-2 pl-5 text-grey-darken-1 text-body-2">
          <span style="width: 20px; margin-right: 8px;" />
          <span class="flex-1-1"><strong>Updated:</strong> {{ formatDate(client.updatedAt) }}</span>
        </div>

        <!-- Projects loading indicator -->
        <v-progress-linear
          v-if="loadingProjects?.[client.id]"
          indeterminate
          color="info"
          class="my-2 ml-5 rounded"
          style="width: calc(100% - 36px);"
        />

        <!-- Projects -->
        <div
          v-for="project in client.projects"
          :key="project.id"
          class="my-1"
        >
          <div
            class="tree-item pl-5"
            @click="toggleProject(project.id)"
          >
            <v-icon class="toggle" size="20">
              {{ isProjectExpanded(project.id) ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
            </v-icon>
            <v-icon class="mr-2" color="info" size="20">mdi-folder-outline</v-icon>
            <span class="flex-1-1 font-weight-medium text-truncate">{{ project.name }}</span>
          </div>

          <!-- Project Details -->
          <div v-if="isProjectExpanded(project.id)">
            <div class="d-flex align-center pa-2 pl-10 text-grey-darken-1 text-body-2">
              <span style="width: 20px; margin-right: 8px;" />
              <span class="flex-1-1">
                <strong>Status:</strong>
                <v-chip :color="project.status === 'completed' ? 'success' : project.status === 'in-progress' ? 'primary' : 'warning'" size="small" class="ml-2">
                  {{ project.status }}
                </v-chip>
              </span>
            </div>
            <div class="d-flex align-center pa-2 pl-10 text-grey-darken-1 text-body-2">
              <span style="width: 20px; margin-right: 8px;" />
              <span class="flex-1-1"><strong>Created:</strong> {{ formatDate(project.createdAt) }}</span>
            </div>
            <div class="d-flex align-center pa-2 pl-10 text-grey-darken-1 text-body-2">
              <span style="width: 20px; margin-right: 8px;" />
              <span class="flex-1-1"><strong>Updated:</strong> {{ formatDate(project.updatedAt) }}</span>
            </div>

            <!-- Tasks loading indicator -->
            <v-progress-linear
              v-if="loadingTasks?.[project.id]"
              indeterminate
              color="success"
              class="my-2 ml-5 rounded"
              style="width: calc(100% - 36px);"
            />

            <!-- Tasks -->
            <div
              v-for="task in project.tasks"
              :key="task.id"
              class="my-1"
            >
              <div class="tree-item pl-10" style="cursor: default;">
                <span style="width: 20px; margin-right: 8px;" />
                <v-icon class="mr-2" color="success" size="18">mdi-checkbox-marked-circle-outline</v-icon>
                <span class="flex-1-1 font-weight-medium text-truncate text-decoration-underline">
                  {{ task.name }}
                </span>
              </div>
              <div>
                <div class="d-flex align-center pa-2 text-grey-darken-1 text-body-2" style="padding-left: 60px;">
                  <span style="width: 20px; margin-right: 8px;" />
                  <span class="flex-1-1 pl-14">
                    <strong>Status:</strong>
                    <v-chip :color="task.status === 'completed' ? 'success' : task.status === 'in-progress' ? 'primary' : 'warning'" size="small" class="ml-2">
                      {{ task.status }}
                    </v-chip>
                  </span>
                </div>
                <div class="d-flex align-center pa-2 text-grey-darken-1 text-body-2" style="padding-left: 60px;">
                  <span style="width: 20px; margin-right: 8px;" />
                  <span class="flex-1-1 pl-14"><strong>Created:</strong> {{ formatDate(task.createdAt) }}</span>
                </div>
              </div>
            </div>

            <!-- Load More Tasks Button -->
            <div v-if="hasMoreTasks?.[project.id]" class="my-3 pa-2 pl-10">
              <button class="load-btn" @click="emit('loadMoreTasks', project.id)">
                Load More Tasks
              </button>
            </div>
          </div>
        </div>

        <!-- Load More Projects Button -->
        <div v-if="hasMoreProjects?.[client.id]" class="my-3 pa-2 pl-5">
          <button class="load-btn" @click="emit('loadMoreProjects', client.id)">
            Load More Projects
          </button>
        </div>
      </div>
    </div>

    <!-- Load More Clients Button -->
    <div v-if="hasMoreClients && clients.length > 0" class="my-3 pa-2">
      <button class="load-btn" @click="emit('loadMoreClients')">
        Load More Clients
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-data-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.tree-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.tree-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

.toggle {
  margin-right: 8px;
  color: #616161;
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

.load-btn {
  width: 100%;
  padding: 10px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.load-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.load-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);
}
</style>
