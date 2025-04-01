<template>
  <div class="w-8 h-8" v-html="svg" />
</template>

<script lang="ts" setup>
import { createAvatar } from "@dicebear/core";
import { adventurer } from "@dicebear/collection";
import { computed } from "vue";

const props = defineProps<{
	user: string;
}>();

const svg = computed(() => {
	const avatar = createAvatar(adventurer, {
		seed: props.user,
	});
	return avatar.toString();
});
</script>