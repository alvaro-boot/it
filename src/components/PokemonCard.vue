<template>
  <div class="pokemon-card" @click="$emit('click')">
    <div class="image-wrapper">
      <img :src="imageUrl" :alt="pokemonName" loading="lazy">
    </div>
    <div class="card-body">
      <h3 class="title">{{ capitalizedName }}</h3>
      <div class="types">
        <span v-for="t in types" :key="t" class="type">{{ t }}</span>
      </div>
    </div>
  </div>
  
  
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pokemonName: { type: String, required: true },
  imageUrl: { type: String, required: true },
  types: { type: Array, default: () => [] }
})

const capitalizedName = computed(() => props.pokemonName.charAt(0).toUpperCase() + props.pokemonName.slice(1))
</script>

<style scoped>
.pokemon-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
}

.pokemon-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.12);
}

.image-wrapper {
  background: linear-gradient(135deg, #f0f4ff 0%, #f9f9ff 100%);
  display: grid;
  place-items: center;
  min-height: 140px;
}

.image-wrapper img {
  width: 120px;
  height: 120px;
  object-fit: contain;
}

.card-body {
  padding: 1rem;
}

.title {
  margin: 0 0 0.5rem 0;
}

.types {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.type {
  background: #eef2ff;
  color: #4f46e5;
  padding: 0.2rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
}
</style>


