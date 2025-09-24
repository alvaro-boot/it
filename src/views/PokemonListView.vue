<template>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h2 class="card-title">Pokémon</h2>
      </div>
      <div class="controls">
        <input v-model="search" type="text" class="search" placeholder="Buscar por nombre..." @keyup.enter="goSearch">
        <button class="btn-primary" @click="goSearch">Buscar</button>
      </div>
      <div class="grid">
        <PokemonCard
          v-for="p in pokemons"
          :key="p.name"
          :pokemon-name="p.name"
          :image-url="p.image"
          :types="p.types"
          @click="goDetail(p.name)"
        />
      </div>

      <div class="pagination">
        <button class="btn-secondary" :disabled="page === 1 || loading" @click="prevPage">Anterior</button>
        <span>Página {{ page }}</span>
        <button class="btn-secondary" :disabled="!hasMore || loading" @click="nextPage">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import PokemonCard from '../components/PokemonCard.vue'

const router = useRouter()
const page = ref(1)
const limit = 20
const pokemons = ref([])
const loading = ref(false)
const hasMore = ref(true)
const search = ref('')

const goDetail = (name) => {
  router.push({ name: 'pokemon-detail', params: { name } })
}

const goSearch = () => {
  if (!search.value) return
  goDetail(search.value.toLowerCase().trim())
}

async function fetchList() {
  loading.value = true
  try {
    const offset = (page.value - 1) * limit
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    const data = await res.json()
    hasMore.value = Boolean(data.next)
    // enrich each pokemon with image and types
    const detailed = await Promise.all(
      data.results.map(async (item) => {
        const r = await fetch(item.url)
        const d = await r.json()
        return {
          name: d.name,
          image: d.sprites.other['official-artwork'].front_default || d.sprites.front_default,
          types: d.types.map(t => t.type.name)
        }
      })
    )
    pokemons.value = detailed
  } finally {
    loading.value = false
  }
}

function nextPage() {
  if (hasMore.value) {
    page.value += 1
  }
}

function prevPage() {
  if (page.value > 1) {
    page.value -= 1
  }
}

watch(page, fetchList)
onMounted(fetchList)
</script>

<style scoped>
.container {
  padding: 1.5rem;
}

.controls {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.search {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 0.95rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1rem;
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}
</style>


