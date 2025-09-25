<template>
  <div class="allows-view">
    <h1 class="title">Permisos de Propiedad</h1>

    <div class="card">
      <div class="card-header">
        <h2>Consultar último registro</h2>
        <button class="btn" @click="fetchLast">Consultar</button>
      </div>
      <div class="card-body" v-if="last">
        <div class="grid">
          <div class="field"><label>ID</label><span>{{ last.id }}</span></div>
          <div class="field"><label>Documento</label><span>{{ last.identity }}</span></div>
          <div class="field"><label>Nombre</label><span>{{ last.name }}</span></div>
          <div class="field"><label>Placa</label><span>{{ last.number_plate }}</span></div>
          <div class="field full"><label>Observación</label><span>{{ last.observation }}</span></div>
          <div class="field"><label>Entrada</label><span>{{ last.arrival_date }}</span></div>
          <div class="field"><label>Salida</label><span>{{ last.exit_date }}</span></div>
          <div class="field"><label>Estado</label><span>{{ last.estado }}</span></div>
          <div class="field"><label>Creado</label><span>{{ last.created_at }}</span></div>
          <div class="field"><label>Actualizado</label><span>{{ last.updated_at }}</span></div>
        </div>
      </div>
      <div class="empty" v-else>
        <p>No se ha consultado aún.</p>
      </div>
    </div>

    <div class="card">
      <div class="card-header">
        <h2>Registrar Permiso</h2>
      </div>
      <div class="card-body">
        <form @submit.prevent="submitForm" class="form">
          <div class="form-row">
            <label>Documento</label>
            <input v-model.trim="form.identity" type="text" required placeholder="Cédula/NIT" />
          </div>
          <div class="form-row">
            <label>Nombre</label>
            <input v-model.trim="form.name" type="text" required placeholder="Nombre completo" />
          </div>
          <div class="form-row">
            <label>Placa</label>
            <input v-model.trim="form.number_plate" type="text" placeholder="ABC123" />
          </div>
          <div class="form-row">
            <label>Observación</label>
            <textarea v-model.trim="form.observation" rows="3" placeholder="Notas"></textarea>
          </div>

          <div class="constants">
            <span>residential_unit_id: <strong>1</strong></span>
            <span>property_id: <strong>187</strong></span>
          </div>

          <div class="actions">
            <button class="btn primary" type="submit" :disabled="loading">
              {{ loading ? 'Enviando...' : 'Guardar' }}
            </button>
            <button class="btn" type="button" @click="resetForm" :disabled="loading">Limpiar</button>
          </div>
        </form>

        <p v-if="error" class="error">{{ error }}</p>
        <p v-if="success" class="success">Registro guardado correctamente.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const API_BASE = 'https://apiph.cootravir.app/api/v1'
const RESIDENTIAL_UNIT_ID = 1
const PROPERTY_ID = 187

const last = ref(null)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const form = reactive({
  identity: '',
  name: '',
  number_plate: '',
  observation: '',
})

async function fetchLast() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    const url = `${API_BASE}/allows/property/${RESIDENTIAL_UNIT_ID}/${PROPERTY_ID}`
    const res = await fetch(url, { method: 'GET' })
    if (!res.ok) throw new Error(`Error ${res.status}`)
    const data = await res.json()
    last.value = data
  } catch (e) {
    error.value = 'No se pudo consultar la información.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

async function submitForm() {
  error.value = ''
  success.value = false
  loading.value = true
  try {
    const payload = {
      residential_unit_id: RESIDENTIAL_UNIT_ID,
      property_id: PROPERTY_ID,
      identity: form.identity,
      name: form.name,
      number_plate: form.number_plate,
      observation: form.observation,
    }

    const res = await fetch(`${API_BASE}/allows/property/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
    if (!res.ok) throw new Error(`Error ${res.status}`)
    success.value = true
    // refrescar consulta
    await fetchLast()
  } catch (e) {
    error.value = 'No se pudo guardar el registro.'
    console.error(e)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.identity = ''
  form.name = ''
  form.number_plate = ''
  form.observation = ''
  success.value = false
  error.value = ''
}
</script>

<style scoped>
.allows-view {
  padding: 90px 24px 24px;
  max-width: 1000px;
  margin: 0 auto;
}

.title {
  margin-bottom: 16px;
}

.card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.06);
  margin-bottom: 16px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #eee;
}

.card-body {
  padding: 16px 20px;
}


.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px 24px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field.full { grid-column: 1 / -1; }

.field label {
  font-size: 12px;
  color: #64748b;
}

.field span {
  font-size: 14px;
  color: #111827;
}

.empty { color: #64748b; }

.form {
  display: grid;
  gap: 12px;
}

.form-row { display: grid; gap: 6px; }

input, textarea {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
}

.constants { color: #6b7280; display: flex; gap: 16px; margin-top: 4px; }

.actions { display: flex; gap: 8px; margin-top: 8px; }

.btn {
  background: #e5e7eb;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  cursor: pointer;
}

.btn.primary { background: #667eea; color: #fff; }

.error { color: #dc2626; margin-top: 8px; }
.success { color: #16a34a; margin-top: 8px; }

@media (max-width: 640px) {
  .grid { grid-template-columns: 1fr; }
}
</style>


