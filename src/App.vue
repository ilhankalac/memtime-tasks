<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'
import { useNotification } from '@/composables/useNotification'
import { computed, watch } from 'vue'

const { smAndDown } = useDisplay()
const router = useRouter()
const route = useRoute()

const { notification, clearNotification } = useNotification()

const snackbarVisible = computed({
  get: () => notification.value !== null,
  set: (value) => {
    if (!value) {
      clearNotification()
    }
  }
})

const snackbarColor = computed(() => {
  if (!notification.value) return 'info'

  switch (notification.value.type) {
    case 'success':
      return 'success'
    case 'error':
      return 'error'
    case 'warning':
      return 'warning'
    case 'info':
    default:
      return 'info'
  }
})
</script>

<template>
  <div class="app">
    <v-card class="header-card mb-6">
      <v-card-item>
        <div class="header-content">
          <div>
            <h1 class="app-title">Time Management System</h1>
            <p class="app-subtitle">Organize clients, projects, tasks and track your work time efficiently</p>
          </div>
        </div>
      </v-card-item>
      
      <v-divider />
      
      <v-card-item>
        <div 
          class="nav-buttons"
          :class="smAndDown ? 'flex-column align-start' : ''"
        >
          <v-btn
            :variant="route.path === '/clients' ? 'flat' : 'outlined'"
            :color="route.path === '/clients' ? 'primary' : 'default'"
            :size="smAndDown ? 'small' : undefined"
            @click="router.push('/clients')"
          >
            <v-icon start>mdi-folder-multiple</v-icon>
            Task 1 - Clients
          </v-btn>
          <v-btn
            :variant="route.path === '/time-entries' ? 'flat' : 'outlined'"
            :color="route.path === '/time-entries' ? 'primary' : 'default'"
            :size="smAndDown ? 'small' : undefined"
            @click="router.push('/time-entries')"
          >
            <v-icon start>mdi-clock-outline</v-icon>
            Task 2 & 3 - Time Entries
          </v-btn>
        </div>
      </v-card-item>
    </v-card>

    <router-view />

    <v-snackbar
      v-model="snackbarVisible"
      :color="snackbarColor"
      :timeout="notification?.timeout || 3000"
      location="top"
      multi-line
    >
      {{ notification?.message }}
      <template #actions>
        <v-btn
          variant="text"
          @click="clearNotification"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
.app {
  padding: 20px;
}

.header-card {
  background: linear-gradient(135deg, rgba(63, 81, 181, 0.05) 0%, rgba(66, 133, 244, 0.05) 100%);
  border: 1px solid rgba(63, 81, 181, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
}

.app-title {
  font-size: 32px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.app-subtitle {
  font-size: 14px;
  color: #666;
  margin: 0;
  max-width: 500px;
}

.nav-buttons {
  display: flex;
  gap: 12px;
  padding: 8px 0;
}
</style>
