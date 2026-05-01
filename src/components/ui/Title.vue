<script setup lang="ts">
import { ITitle } from "../../types/ui";

const props = defineProps<ITitle>();
</script>

<template>
  <h2>{{ text }}</h2>
</template>

<style scoped></style>
