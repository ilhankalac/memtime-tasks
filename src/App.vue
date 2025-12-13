<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
</script>

<template>
  <div class="app">
    <div class="d-flex ga-4 mb-4">
      <v-btn
        :variant="route.path === '/clients' ? 'flat' : 'outlined'"
        :color="route.path === '/clients' ? 'primary' : 'default'"
        @click="router.push('/clients')"
      >
        Task 1 - Clients
      </v-btn>
      <v-btn
        :variant="route.path === '/time-entries' ? 'flat' : 'outlined'"
        :color="route.path === '/time-entries' ? 'primary' : 'default'"
        @click="router.push('/time-entries')"
      >
        Task 2 - Time Entries
      </v-btn>
      <v-btn
        :variant="route.path === '/time-entry-form' ? 'flat' : 'outlined'"
        :color="route.path === '/time-entry-form' ? 'primary' : 'default'"
        @click="router.push('/time-entry-form')"
      >
        Task 3 - Time Entry Form
      </v-btn>
    </div>
    <router-view />
  </div>
</template>

<style scoped>
</style>
