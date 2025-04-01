<template>
  <div class="w-6 h-6" v-html="svg" />
</template>

<script lang="ts" setup>
import { createAvatar } from '@dicebear/core';
import { bigSmile } from '@dicebear/collection';
import { computed } from 'vue';

const props = defineProps<{
  user: string;
}>();

const svg = computed(() => {
  const avatar = createAvatar(bigSmile, {
    seed: props.user,
  });
  return avatar.toString();
})

</script>