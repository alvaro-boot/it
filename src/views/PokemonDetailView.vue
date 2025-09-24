<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">{{ title }}</h2>
      </div>
      <div v-if="loading">Cargando...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="detail">
        <div class="hero">
          <img :src="imageUrl" :alt="pokemon.name">
          <div class="chips">
            <span v-for="t in types" :key="t" class="chip">{{ t }}</span>
          </div>
        </div>
        <div class="info">
          <h3>Estadísticas</h3>
          <ul class="stats">
            <li v-for="s in pokemon.stats" :key="s.stat.name">
              <span class="stat-name">{{ s.stat.name }}</span>
              <div class="bar"><span class="fill" :style="{ width: s.base_stat + 'px' }"></span></div>
              <span class="value">{{ s.base_stat }}</span>
            </li>
          </ul>

          <h3>Detalles</h3>
          <p><strong>Peso:</strong> {{ (pokemon.weight/10).toFixed(1) }} kg</p>
          <p><strong>Altura:</strong> {{ (pokemon.height/10).toFixed(1) }} m</p>

          <h3>Habilidades</h3>
          <ul>
            <li v-for="a in pokemon.abilities" :key="a.ability.name">{{ a.ability.name }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const name = computed(() => route.params.name)
const pokemon = ref(null)
const loading = ref(false)
const error = ref('')

const title = computed(() => pokemon.value ? pokemon.value.name.charAt(0).toUpperCase() + pokemon.value.name.slice(1) : 'Pokémon')
const imageUrl = computed(() => pokemon.value?.sprites?.other?.['official-artwork']?.front_default || pokemon.value?.sprites?.front_default)
const types = computed(() => pokemon.value?.types?.map(t => t.type.name) || [])

async function fetchDetail() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.value}`)
    if (!res.ok) throw new Error('No encontrado')
    pokemon.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(fetchDetail)
</script>

<style scoped>
.container {
  padding: 1.5rem;
}
.detail {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
}
.hero {
  background: linear-gradient(135deg, #f0f4ff 0%, #f9f9ff 100%);
  border-radius: 12px;
  display: grid;
  place-items: center;
  padding: 1rem;
}
.hero img {
  width: 260px;
  height: 260px;
  object-fit: contain;
}
.chips { margin-top: 0.75rem; display: flex; gap: 0.5rem; flex-wrap: wrap; }
.chip { background: #eef2ff; color: #4f46e5; padding: 0.25rem 0.6rem; border-radius: 999px; font-size: 0.8rem; }
.stats { list-style: none; padding: 0; margin: 0 0 1rem 0; display: grid; gap: 0.5rem; }
.stats li { display: grid; grid-template-columns: 120px 1fr 40px; align-items: center; gap: 0.5rem; }
.bar { background: #f1f5f9; height: 10px; border-radius: 999px; overflow: hidden; }
.fill { display: block; height: 100%; background: #4f46e5; }
.error { color: #e11d48; }

@media (max-width: 900px) {
  .detail { grid-template-columns: 1fr; }
}
</style>


