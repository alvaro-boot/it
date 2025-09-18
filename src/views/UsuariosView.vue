<template>
  <div class="usuarios">
    <div class="header">
      <h1>Gestión de Usuarios</h1>
      <button @click="showAddModal = true" class="btn-primary">
        + Agregar Usuario
      </button>
    </div>

    <div class="filters">
      <input 
        v-model="searchTerm" 
        type="text" 
        placeholder="Buscar usuarios..."
        class="search-input"
      >
      <select v-model="selectedDepartment" class="filter-select">
        <option value="">Todos los departamentos</option>
        <option value="administracion">Administración</option>
        <option value="contabilidad">Contabilidad</option>
        <option value="recursos-humanos">Recursos Humanos</option>
        <option value="ventas">Ventas</option>
        <option value="marketing">Marketing</option>
        <option value="it">Tecnología de la Información</option>
      </select>
      <select v-model="selectedRole" class="filter-select">
        <option value="">Todos los roles</option>
        <option value="admin">Administrador</option>
        <option value="user">Usuario</option>
        <option value="guest">Invitado</option>
      </select>
      <select v-model="selectedStatus" class="filter-select">
        <option value="">Todos los estados</option>
        <option value="activo">Activo</option>
        <option value="inactivo">Inactivo</option>
        <option value="bloqueado">Bloqueado</option>
      </select>
    </div>

    <div class="users-grid">
      <div 
        v-for="user in filteredUsers" 
        :key="user.id" 
        class="user-card"
        @click="selectUser(user)"
      >
        <div class="user-avatar">
          <img :src="user.avatar" :alt="user.name" v-if="user.avatar">
          <div v-else class="avatar-placeholder">
            {{ user.name.charAt(0).toUpperCase() }}
          </div>
        </div>
        
        <div class="user-info">
          <h3>{{ user.name }}</h3>
          <p class="user-email">{{ user.email }}</p>
          <p class="user-department">{{ user.department }}</p>
          <p class="user-position">{{ user.position }}</p>
        </div>

        <div class="user-meta">
          <span class="role-badge" :class="user.role">
            {{ user.role }}
          </span>
          <span class="status-badge" :class="user.status">
            {{ user.status }}
          </span>
        </div>

        <div class="user-actions">
          <button @click.stop="editUser(user)" class="btn-secondary">
            Editar
          </button>
          <button @click.stop="resetPassword(user)" class="btn-secondary">
            Reset Password
          </button>
          <button 
            @click.stop="toggleUserStatus(user)" 
            :class="user.status === 'activo' ? 'btn-warning' : 'btn-success'"
          >
            {{ user.status === 'activo' ? 'Desactivar' : 'Activar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para agregar/editar usuario -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>{{ showAddModal ? 'Agregar Usuario' : 'Editar Usuario' }}</h2>
        
        <form @submit.prevent="saveUser">
          <div class="form-group">
            <label>Nombre Completo:</label>
            <input v-model="form.name" type="text" required>
          </div>
          
          <div class="form-group">
            <label>Email:</label>
            <input v-model="form.email" type="email" required>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Departamento:</label>
              <select v-model="form.department" required>
                <option value="administracion">Administración</option>
                <option value="contabilidad">Contabilidad</option>
                <option value="recursos-humanos">Recursos Humanos</option>
                <option value="ventas">Ventas</option>
                <option value="marketing">Marketing</option>
                <option value="it">Tecnología de la Información</option>
              </select>
            </div>
            <div class="form-group">
              <label>Posición:</label>
              <input v-model="form.position" type="text" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Rol:</label>
              <select v-model="form.role" required>
                <option value="admin">Administrador</option>
                <option value="user">Usuario</option>
                <option value="guest">Invitado</option>
              </select>
            </div>
            <div class="form-group">
              <label>Teléfono:</label>
              <input v-model="form.phone" type="tel">
            </div>
          </div>
          
          <div class="form-group">
            <label>Fecha de Inicio:</label>
            <input v-model="form.startDate" type="date" required>
          </div>
          
          <div v-if="showAddModal" class="form-group">
            <label>Contraseña Temporal:</label>
            <input v-model="form.tempPassword" type="password" required>
            <small>El usuario deberá cambiar esta contraseña en su primer inicio de sesión</small>
          </div>
          
          <div v-if="showEditModal" class="form-group">
            <label>Estado:</label>
            <select v-model="form.status" required>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="bloqueado">Bloqueado</option>
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
const selectedDepartment = ref('')
const selectedRole = ref('')
const selectedStatus = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const selectedUser = ref(null)

const form = ref({
  name: '',
  email: '',
  department: '',
  position: '',
  role: 'user',
  phone: '',
  startDate: '',
  status: 'activo',
  tempPassword: ''
})

const users = ref([
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    department: 'administracion',
    position: 'Gerente General',
    role: 'admin',
    phone: '+57 300 123 4567',
    startDate: '2020-01-15',
    status: 'activo',
    avatar: null
  },
  {
    id: 2,
    name: 'María González',
    email: 'maria.gonzalez@empresa.com',
    department: 'contabilidad',
    position: 'Contadora',
    role: 'user',
    phone: '+57 300 234 5678',
    startDate: '2021-03-20',
    status: 'activo',
    avatar: null
  },
  {
    id: 3,
    name: 'Carlos Ruiz',
    email: 'carlos.ruiz@empresa.com',
    department: 'it',
    position: 'Desarrollador',
    role: 'user',
    phone: '+57 300 345 6789',
    startDate: '2022-06-10',
    status: 'activo',
    avatar: null
  },
  {
    id: 4,
    name: 'Ana López',
    email: 'ana.lopez@empresa.com',
    department: 'recursos-humanos',
    position: 'Especialista en RRHH',
    role: 'user',
    phone: '+57 300 456 7890',
    startDate: '2021-11-05',
    status: 'inactivo',
    avatar: null
  },
  {
    id: 5,
    name: 'Pedro Martínez',
    email: 'pedro.martinez@empresa.com',
    department: 'ventas',
    position: 'Ejecutivo de Ventas',
    role: 'user',
    phone: '+57 300 567 8901',
    startDate: '2023-02-14',
    status: 'activo',
    avatar: null
  }
])

const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                         user.position.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    const matchesDepartment = !selectedDepartment.value || user.department === selectedDepartment.value
    const matchesRole = !selectedRole.value || user.role === selectedRole.value
    const matchesStatus = !selectedStatus.value || user.status === selectedStatus.value
    
    return matchesSearch && matchesDepartment && matchesRole && matchesStatus
  })
})

const selectUser = (user) => {
  selectedUser.value = user
  // Aquí podrías abrir un modal de detalles o navegar a una vista de detalles
}

const editUser = (user) => {
  selectedUser.value = user
  form.value = { ...user }
  showEditModal.value = true
}

const resetPassword = (user) => {
  if (confirm(`¿Estás seguro de que quieres resetear la contraseña de ${user.name}?`)) {
    // Implementar lógica de reset de contraseña
    console.log('Reseteando contraseña para:', user.name)
    alert('Se ha enviado un email con la nueva contraseña temporal')
  }
}

const toggleUserStatus = (user) => {
  const newStatus = user.status === 'activo' ? 'inactivo' : 'activo'
  const index = users.value.findIndex(u => u.id === user.id)
  if (index !== -1) {
    users.value[index].status = newStatus
  }
}

const saveUser = () => {
  if (showAddModal.value) {
    const newUser = {
      id: Date.now(),
      ...form.value,
      avatar: null
    }
    users.value.push(newUser)
  } else {
    const index = users.value.findIndex(u => u.id === selectedUser.value.id)
    if (index !== -1) {
      users.value[index] = { ...form.value, id: selectedUser.value.id, avatar: selectedUser.value.avatar }
    }
  }
  closeModal()
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  selectedUser.value = null
  form.value = {
    name: '',
    email: '',
    department: '',
    position: '',
    role: 'user',
    phone: '',
    startDate: '',
    status: 'activo',
    tempPassword: ''
  }
}
</script>

<style scoped>
.usuarios {
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

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.user-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.user-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.user-avatar {
  margin-bottom: 1rem;
}

.user-avatar img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.user-info {
  margin-bottom: 1rem;
}

.user-info h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.user-email {
  margin: 0 0 0.25rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.user-department {
  margin: 0 0 0.25rem 0;
  color: #3498db;
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: uppercase;
}

.user-position {
  margin: 0;
  color: #555;
  font-size: 0.9rem;
}

.user-meta {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.role-badge, .status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.role-badge.admin {
  background: #e8f5e8;
  color: #27ae60;
}

.role-badge.user {
  background: #e3f2fd;
  color: #1976d2;
}

.role-badge.guest {
  background: #f3e5f5;
  color: #7b1fa2;
}

.status-badge.activo {
  background: #d5f4e6;
  color: #27ae60;
}

.status-badge.inactivo {
  background: #fadbd8;
  color: #e74c3c;
}

.status-badge.bloqueado {
  background: #f8d7da;
  color: #721c24;
}

.user-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  justify-content: center;
}

.btn-primary, .btn-secondary, .btn-success, .btn-warning {
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

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-warning:hover {
  background: #e67e22;
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

.form-group small {
  display: block;
  margin-top: 0.25rem;
  color: #7f8c8d;
  font-size: 0.8rem;
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
  
  .users-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .user-actions {
    flex-direction: column;
  }
}
</style>
