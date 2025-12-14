<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
import { useNotification } from '@/composables/useNotification'
import { computed } from 'vue'

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
  <main-layout />

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
</template>
