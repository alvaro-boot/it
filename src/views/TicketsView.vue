<template>
  <div class="tickets">
    <div class="header">
      <h1>Gestión de Tickets</h1>
      <button @click="showCreateModal = true" class="btn-primary">
        + Nuevo Ticket
      </button>
    </div>

    <div class="filters">
      <input 
        v-model="searchTerm" 
        type="text" 
        placeholder="Buscar tickets..."
        class="search-input"
      >
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="abierto">Abierto</option>
        <option value="en-progreso">En Progreso</option>
        <option value="cerrado">Cerrado</option>
        <option value="cancelado">Cancelado</option>
      </select>
      <select v-model="selectedPriority" class="filter-select">
        <option value="">Todas las prioridades</option>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
        <option value="critica">Crítica</option>
      </select>
      <select v-model="selectedCategory" class="filter-select">
        <option value="">Todas las categorías</option>
        <option value="hardware">Hardware</option>
        <option value="software">Software</option>
        <option value="red">Red</option>
        <option value="email">Email</option>
        <option value="impresora">Impresora</option>
        <option value="telefono">Teléfono</option>
      </select>
    </div>

    <div class="tickets-list">
      <div 
        v-for="ticket in filteredTickets" 
        :key="ticket.id" 
        class="ticket-card"
        @click="selectTicket(ticket)"
      >
        <div class="ticket-header">
          <div class="ticket-info">
            <h3>#{{ ticket.id }} - {{ ticket.title }}</h3>
            <p class="ticket-description">{{ ticket.description }}</p>
          </div>
          <div class="ticket-meta">
            <span class="priority-badge" :class="ticket.priority">
              {{ ticket.priority }}
            </span>
            <span class="status-badge" :class="ticket.status">
              {{ ticket.status }}
            </span>
          </div>
        </div>
        
        <div class="ticket-details">
          <div class="detail-item">
            <strong>Categoría:</strong> {{ ticket.category }}
          </div>
          <div class="detail-item">
            <strong>Solicitado por:</strong> {{ ticket.requestedBy }}
          </div>
          <div class="detail-item">
            <strong>Asignado a:</strong> {{ ticket.assignedTo || 'Sin asignar' }}
          </div>
          <div class="detail-item">
            <strong>Fecha:</strong> {{ ticket.createdDate }}
          </div>
        </div>

        <div class="ticket-actions">
          <button @click.stop="editTicket(ticket)" class="btn-secondary">
            Editar
          </button>
          <button @click.stop="viewDetails(ticket)" class="btn-secondary">
            Ver Detalles
          </button>
          <button 
            v-if="ticket.status !== 'cerrado'" 
            @click.stop="closeTicket(ticket)" 
            class="btn-success"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para crear/editar ticket -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ showCreateModal ? 'Crear Nuevo Ticket' : 'Editar Ticket' }}</h2>
        
        <form @submit.prevent="saveTicket">
          <div class="form-group">
            <label>Título:</label>
            <input v-model="form.title" type="text" required>
          </div>
          
          <div class="form-group">
            <label>Descripción:</label>
            <textarea v-model="form.description" rows="4" required></textarea>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Categoría:</label>
              <select v-model="form.category" required>
                <option value="hardware">Hardware</option>
                <option value="software">Software</option>
                <option value="red">Red</option>
                <option value="email">Email</option>
                <option value="impresora">Impresora</option>
                <option value="telefono">Teléfono</option>
              </select>
            </div>
            <div class="form-group">
              <label>Prioridad:</label>
              <select v-model="form.priority" required>
                <option value="baja">Baja</option>
                <option value="media">Media</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Solicitado por:</label>
              <input v-model="form.requestedBy" type="text" required>
            </div>
            <div class="form-group">
              <label>Asignado a:</label>
              <select v-model="form.assignedTo">
                <option value="">Sin asignar</option>
                <option value="admin1">Administrador 1</option>
                <option value="admin2">Administrador 2</option>
                <option value="soporte1">Soporte Técnico 1</option>
                <option value="soporte2">Soporte Técnico 2</option>
              </select>
            </div>
          </div>
          
          <div v-if="showEditModal" class="form-group">
            <label>Estado:</label>
            <select v-model="form.status" required>
              <option value="abierto">Abierto</option>
              <option value="en-progreso">En Progreso</option>
              <option value="cerrado">Cerrado</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              {{ showCreateModal ? 'Crear' : 'Actualizar' }}
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
const selectedStatus = ref('')
const selectedPriority = ref('')
const selectedCategory = ref('')
const showCreateModal = ref(false)
const showEditModal = ref(false)
const selectedTicket = ref(null)

const form = ref({
  title: '',
  description: '',
  category: 'hardware',
  priority: 'media',
  requestedBy: '',
  assignedTo: '',
  status: 'abierto'
})

const tickets = ref([
  {
    id: 1,
    title: 'Problema con impresora',
    description: 'La impresora del piso 3 no está funcionando correctamente. No imprime y muestra error de papel.',
    category: 'impresora',
    priority: 'alta',
    status: 'abierto',
    requestedBy: 'María González',
    assignedTo: 'soporte1',
    createdDate: '2024-01-15'
  },
  {
    id: 2,
    title: 'Solicitud de software',
    description: 'Necesito instalar Adobe Creative Suite en mi computadora para el proyecto de marketing.',
    category: 'software',
    priority: 'media',
    status: 'en-progreso',
    requestedBy: 'Carlos Ruiz',
    assignedTo: 'admin1',
    createdDate: '2024-01-14'
  },
  {
    id: 3,
    title: 'Problema de red',
    description: 'La conexión a internet está muy lenta en el área de contabilidad. Los archivos tardan mucho en cargar.',
    category: 'red',
    priority: 'alta',
    status: 'abierto',
    requestedBy: 'Ana López',
    assignedTo: '',
    createdDate: '2024-01-13'
  },
  {
    id: 4,
    title: 'Configuración de email',
    description: 'Necesito configurar mi cuenta de correo en el nuevo teléfono.',
    category: 'email',
    priority: 'baja',
    status: 'cerrado',
    requestedBy: 'Pedro Martínez',
    assignedTo: 'soporte2',
    createdDate: '2024-01-12'
  }
])

const filteredTickets = computed(() => {
  return tickets.value.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         ticket.requestedBy.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesStatus = !selectedStatus.value || ticket.status === selectedStatus.value
    const matchesPriority = !selectedPriority.value || ticket.priority === selectedPriority.value
    const matchesCategory = !selectedCategory.value || ticket.category === selectedCategory.value
    
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })
})

const selectTicket = (ticket) => {
  selectedTicket.value = ticket
  // Aquí podrías abrir un modal de detalles o navegar a una vista de detalles
}

const editTicket = (ticket) => {
  selectedTicket.value = ticket
  form.value = { ...ticket }
  showEditModal.value = true
}

const viewDetails = (ticket) => {
  // Implementar vista de detalles
  console.log('Ver detalles de ticket:', ticket.id)
}

const closeTicket = (ticket) => {
  const index = tickets.value.findIndex(t => t.id === ticket.id)
  if (index !== -1) {
    tickets.value[index].status = 'cerrado'
  }
}

const saveTicket = () => {
  if (showCreateModal.value) {
    const newTicket = {
      id: Date.now(),
      ...form.value,
      createdDate: new Date().toISOString().split('T')[0]
    }
    tickets.value.unshift(newTicket)
  } else {
    const index = tickets.value.findIndex(t => t.id === selectedTicket.value.id)
    if (index !== -1) {
      tickets.value[index] = { ...form.value, id: selectedTicket.value.id, createdDate: selectedTicket.value.createdDate }
    }
  }
  closeModal()
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  selectedTicket.value = null
  form.value = {
    title: '',
    description: '',
    category: 'hardware',
    priority: 'media',
    requestedBy: '',
    assignedTo: '',
    status: 'abierto'
  }
}
</script>

<style scoped>
.tickets {
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

.tickets-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.ticket-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.ticket-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.ticket-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.ticket-description {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.ticket-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-items: flex-end;
}

.priority-badge, .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.priority-badge.baja {
  background: #d5f4e6;
  color: #27ae60;
}

.priority-badge.media {
  background: #fef5e7;
  color: #f39c12;
}

.priority-badge.alta {
  background: #fadbd8;
  color: #e74c3c;
}

.priority-badge.critica {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.abierto {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.en-progreso {
  background: #fff3e0;
  color: #f57c00;
}

.status-badge.cerrado {
  background: #e8f5e8;
  color: #388e3c;
}

.status-badge.cancelado {
  background: #ffebee;
  color: #d32f2f;
}

.ticket-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.detail-item {
  font-size: 0.9rem;
  color: #555;
}

.ticket-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-primary, .btn-secondary, .btn-success {
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

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
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

.form-group input, .form-group select, .form-group textarea {
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
  
  .ticket-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .ticket-meta {
    align-items: flex-start;
    flex-direction: row;
  }
  
  .ticket-details {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
