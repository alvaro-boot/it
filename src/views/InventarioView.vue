<template>
  <div class="inventario">
    <div class="header">
      <h1>Inventario de Equipos</h1>
      <button @click="showAddModal = true" class="btn-primary">
        + Agregar Equipo
      </button>
    </div>

    <div class="filters">
      <input 
        v-model="searchTerm" 
        type="text" 
        placeholder="Buscar equipos..."
        class="search-input"
      >
      <select v-model="selectedCategory" class="filter-select">
        <option value="">Todas las categorías</option>
        <option value="computadora">Computadoras</option>
        <option value="impresora">Impresoras</option>
        <option value="servidor">Servidores</option>
        <option value="red">Equipos de Red</option>
        <option value="telefono">Teléfonos</option>
      </select>
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="mantenimiento">En Mantenimiento</option>
        <option value="retirado">Retirado</option>
      </select>
    </div>

    <div class="equipment-grid">
      <div 
        v-for="equipment in filteredEquipment" 
        :key="equipment.id" 
        class="equipment-card"
        @click="selectEquipment(equipment)"
      >
        <div class="equipment-header">
          <h3>{{ equipment.name }}</h3>
          <span class="status-badge" :class="equipment.status">
            {{ equipment.status }}
          </span>
        </div>
        
        <div class="equipment-details">
          <p><strong>Tipo:</strong> {{ equipment.type }}</p>
          <p><strong>Marca:</strong> {{ equipment.brand }}</p>
          <p><strong>Modelo:</strong> {{ equipment.model }}</p>
          <p><strong>Serie:</strong> {{ equipment.serialNumber }}</p>
          <p><strong>Ubicación:</strong> {{ equipment.location }}</p>
          <p><strong>Asignado a:</strong> {{ equipment.assignedTo }}</p>
          <p><strong>Fecha de compra:</strong> {{ equipment.purchaseDate }}</p>
        </div>

        <div class="equipment-actions">
          <button @click.stop="editEquipment(equipment)" class="btn-secondary">
            Editar
          </button>
          <button @click.stop="viewHistory(equipment)" class="btn-secondary">
            Historial
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar equipo -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ showAddModal ? 'Agregar Equipo' : 'Editar Equipo' }}</h2>
        
        <form @submit.prevent="saveEquipment">
          <div class="form-group">
            <label>Nombre del Equipo:</label>
            <input v-model="form.name" type="text" required>
          </div>
          
          <div class="form-group">
            <label>Tipo:</label>
            <select v-model="form.type" required>
              <option value="computadora">Computadora</option>
              <option value="impresora">Impresora</option>
              <option value="servidor">Servidor</option>
              <option value="red">Equipo de Red</option>
              <option value="telefono">Teléfono</option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Marca:</label>
              <input v-model="form.brand" type="text" required>
            </div>
            <div class="form-group">
              <label>Modelo:</label>
              <input v-model="form.model" type="text" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Número de Serie:</label>
            <input v-model="form.serialNumber" type="text" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Ubicación:</label>
              <input v-model="form.location" type="text" required>
            </div>
            <div class="form-group">
              <label>Asignado a:</label>
              <input v-model="form.assignedTo" type="text">
            </div>
          </div>
          
          <div class="form-group">
            <label>Fecha de Compra:</label>
            <input v-model="form.purchaseDate" type="date" required>
          </div>
          
          <div class="form-group">
            <label>Estado:</label>
            <select v-model="form.status" required>
              <option value="activo">Activo</option>
              <option value="mantenimiento">En Mantenimiento</option>
              <option value="retirado">Retirado</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ showAddModal ? 'Agregar' : 'Actualizar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchTerm = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedEquipment = ref(null)

const form = ref({
  name: '',
  type: '',
  brand: '',
  model: '',
  serialNumber: '',
  location: '',
  assignedTo: '',
  purchaseDate: '',
  status: 'activo'
})

const equipment = ref([
  {
    id: 1,
    name: 'PC Oficina 001',
    type: 'computadora',
    brand: 'Dell',
    model: 'OptiPlex 7090',
    serialNumber: 'DL001234567',
    location: 'Oficina Principal - Piso 2',
    assignedTo: 'Juan Pérez',
    purchaseDate: '2023-01-15',
    status: 'activo'
  },
  {
    id: 2,
    name: 'Impresora Contabilidad',
    type: 'impresora',
    brand: 'HP',
    model: 'LaserJet Pro 400',
    serialNumber: 'HP987654321',
    location: 'Área de Contabilidad',
    assignedTo: 'María González',
    purchaseDate: '2022-11-20',
    status: 'activo'
  },
  {
    id: 3,
    name: 'Servidor Principal',
    type: 'servidor',
    brand: 'IBM',
    model: 'System x3650',
    serialNumber: 'IBM555666777',
    location: 'Sala de Servidores',
    assignedTo: 'Sistema',
    purchaseDate: '2021-08-10',
    status: 'activo'
  },
  {
    id: 4,
    name: 'Switch Red Principal',
    type: 'red',
    brand: 'Cisco',
    model: 'Catalyst 2960',
    serialNumber: 'CS111222333',
    location: 'Rack Principal',
    assignedTo: 'Sistema',
    purchaseDate: '2022-03-05',
    status: 'mantenimiento'
  }
])

const filteredEquipment = computed(() => {
  return equipment.value.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         item.serialNumber.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         item.assignedTo.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesCategory = !selectedCategory.value || item.type === selectedCategory.value
    const matchesStatus = !selectedStatus.value || item.status === selectedStatus.value
    
    return matchesSearch && matchesCategory && matchesStatus
  })
})

const selectEquipment = (equipment) => {
  selectedEquipment.value = equipment
  // Aquí podrías abrir un modal de detalles o navegar a una vista de detalles
}

const editEquipment = (equipment) => {
  selectedEquipment.value = equipment
  form.value = { ...equipment }
  showEditModal.value = true
}

const viewHistory = (equipment) => {
  // Implementar vista de historial
  console.log('Ver historial de:', equipment.name)
}

const saveEquipment = () => {
  if (showAddModal.value) {
    const newEquipment = {
      id: Date.now(),
      ...form.value
    }
    equipment.value.push(newEquipment)
  } else {
    const index = equipment.value.findIndex(e => e.id === selectedEquipment.value.id)
    if (index !== -1) {
      equipment.value[index] = { ...form.value, id: selectedEquipment.value.id }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedEquipment.value = null
  form.value = {
    name: '',
    type: '',
    brand: '',
    model: '',
    serialNumber: '',
    location: '',
    assignedTo: '',
    purchaseDate: '',
    status: 'activo'
  }
}
</script>

<style scoped>
.inventario {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  margin: 0;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input, .filter-select {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.search-input {
  flex: 1;
  min-width: 200px;
}

.filter-select {
  min-width: 150px;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.equipment-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.equipment-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.equipment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.equipment-header h3 {
  margin: 0;
  color: #2c3e50;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.status-badge.activo {
  background: #d5f4e6;
  color: #27ae60;
}

.status-badge.mantenimiento {
  background: #fef5e7;
  color: #f39c12;
}

.status-badge.retirado {
  background: #fadbd8;
  color: #e74c3c;
}

.equipment-details p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
  color: #555;
}

.equipment-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #d5dbdb;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content h2 {
  margin-top: 0;
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input, .form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .filters {
    flex-direction: column;
  }
  
  .equipment-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
