<template>
  <div class="min-h-screen bg-gray-50">
    <nav class="bg-rowing-blue text-white p-4">
      <div class="container mx-auto flex items-center justify-between">
        <a href="/">
          <h1 class="text-2xl font-bold">Row Squad 🚣‍♂️</h1>
        </a>
        <div class="flex items-center gap-2">
          <Avatar :user="currentUser.id" />
          <span>{{ currentUser.name }}</span>
        </div>
      </div>
    </nav>
    <main class="container mx-auto p-4">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import Avatar from "~/components/Avatar.vue";
import { currentUser } from "./mock/data";
</script>