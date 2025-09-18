<template>
  <div class="backup">
    <div class="header">
      <h1>Gestión de Respaldos</h1>
      <div class="header-actions">
        <button @click="createBackup" class="btn-primary">
          💾 Crear Respaldo
        </button>
        <button @click="showScheduleModal = true" class="btn-secondary">
          ⏰ Programar
        </button>
      </div>
    </div>

    <!-- Estado de respaldos -->
    <div class="backup-status">
      <h2>Estado de Respaldos</h2>
      <div class="status-grid">
        <div class="status-card">
          <h3>Último Respaldo</h3>
          <div class="backup-info">
            <div class="backup-date">{{ backupStatus.lastBackup.date }}</div>
            <div class="backup-time">{{ backupStatus.lastBackup.time }}</div>
            <div class="backup-size">{{ backupStatus.lastBackup.size }}</div>
          </div>
        </div>
        <div class="status-card">
          <h3>Próximo Respaldo</h3>
          <div class="next-backup">
            <div class="next-date">{{ backupStatus.nextBackup.date }}</div>
            <div class="next-time">{{ backupStatus.nextBackup.time }}</div>
            <div class="countdown">{{ backupStatus.nextBackup.countdown }}</div>
          </div>
        </div>
        <div class="status-card">
          <h3>Espacio Utilizado</h3>
          <div class="storage-usage">
            <div class="usage-bar">
              <div class="usage-fill" :style="{ width: backupStatus.storageUsage.percentage + '%' }"></div>
            </div>
            <div class="usage-text">
              {{ backupStatus.storageUsage.used }} / {{ backupStatus.storageUsage.total }}
            </div>
            <div class="usage-percentage">{{ backupStatus.storageUsage.percentage }}%</div>
          </div>
        </div>
        <div class="status-card">
          <h3>Estado del Sistema</h3>
          <div class="system-status">
            <span class="status-indicator" :class="backupStatus.systemStatus">
              {{ backupStatus.systemStatus === 'activo' ? '🟢' : '🔴' }}
            </span>
            <span>{{ backupStatus.systemStatus === 'activo' ? 'Activo' : 'Inactivo' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de respaldos -->
    <div class="backups-list">
      <h2>Historial de Respaldos</h2>
      <div class="backups-filters">
        <select v-model="selectedType" class="filter-select">
          <option value="">Todos los tipos</option>
          <option value="completo">Completo</option>
          <option value="incremental">Incremental</option>
          <option value="diferencial">Diferencial</option>
        </select>
        <select v-model="selectedStatus" class="filter-select">
          <option value="">Todos los estados</option>
          <option value="exitoso">Exitoso</option>
          <option value="fallido">Fallido</option>
          <option value="en-progreso">En Progreso</option>
        </select>
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Buscar respaldos..."
          class="search-input"
        >
      </div>
      
      <div class="backups-table">
        <div class="backups-header">
          <div class="backup-column">Fecha/Hora</div>
          <div class="backup-column">Tipo</div>
          <div class="backup-column">Tamaño</div>
          <div class="backup-column">Estado</div>
          <div class="backup-column">Duración</div>
          <div class="backup-column">Acciones</div>
        </div>
        <div 
          v-for="backup in filteredBackups" 
          :key="backup.id" 
          class="backup-row"
          :class="backup.status"
        >
          <div class="backup-cell">{{ backup.timestamp }}</div>
          <div class="backup-cell">
            <span class="backup-type-badge" :class="backup.type">
              {{ backup.type }}
            </span>
          </div>
          <div class="backup-cell">{{ backup.size }}</div>
          <div class="backup-cell">
            <span class="backup-status-badge" :class="backup.status">
              {{ backup.status }}
            </span>
          </div>
          <div class="backup-cell">{{ backup.duration }}</div>
          <div class="backup-cell">
            <div class="backup-actions">
              <button @click="viewBackupDetails(backup)" class="btn-secondary">
                Ver
              </button>
              <button @click="restoreBackup(backup)" class="btn-primary" :disabled="backup.status !== 'exitoso'">
                Restaurar
              </button>
              <button @click="downloadBackup(backup)" class="btn-secondary" :disabled="backup.status !== 'exitoso'">
                Descargar
              </button>
              <button @click="deleteBackup(backup)" class="btn-danger">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuración de respaldos -->
    <div class="backup-config">
      <h2>Configuración de Respaldos</h2>
      <div class="config-sections">
        <div class="config-section">
          <h3>Configuración General</h3>
          <div class="config-item">
            <label>Frecuencia:</label>
            <span>{{ backupConfig.frequency }}</span>
            <button @click="editConfig('frequency')" class="btn-secondary">Editar</button>
          </div>
          <div class="config-item">
            <label>Hora de ejecución:</label>
            <span>{{ backupConfig.executionTime }}</span>
            <button @click="editConfig('executionTime')" class="btn-secondary">Editar</button>
          </div>
          <div class="config-item">
            <label>Retención:</label>
            <span>{{ backupConfig.retention }}</span>
            <button @click="editConfig('retention')" class="btn-secondary">Editar</button>
          </div>
        </div>

        <div class="config-section">
          <h3>Ubicaciones de Respaldo</h3>
          <div class="backup-locations">
            <div 
              v-for="location in backupConfig.locations" 
              :key="location.id" 
              class="location-item"
            >
              <div class="location-info">
                <h4>{{ location.name }}</h4>
                <p>{{ location.path }}</p>
                <span class="location-status" :class="location.status">
                  {{ location.status }}
                </span>
              </div>
              <div class="location-actions">
                <button @click="testLocation(location)" class="btn-secondary">
                  Probar
                </button>
                <button @click="editLocation(location)" class="btn-secondary">
                  Editar
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="config-section">
          <h3>Tipos de Respaldo</h3>
          <div class="backup-types">
            <div 
              v-for="type in backupConfig.types" 
              :key="type.name" 
              class="type-item"
            >
              <div class="type-info">
                <h4>{{ type.name }}</h4>
                <p>{{ type.description }}</p>
                <span class="type-frequency">{{ type.frequency }}</span>
              </div>
              <div class="type-toggle">
                <label class="toggle-switch">
                  <input 
                    type="checkbox" 
                    :checked="type.enabled"
                    @change="toggleBackupType(type)"
                  >
                  <span class="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para programar respaldo -->
    <div v-if="showScheduleModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Programar Respaldo</h2>
        
        <form @submit.prevent="scheduleBackup">
          <div class="form-group">
            <label>Tipo de Respaldo:</label>
            <select v-model="scheduleForm.type" required>
              <option value="completo">Completo</option>
              <option value="incremental">Incremental</option>
              <option value="diferencial">Diferencial</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Frecuencia:</label>
            <select v-model="scheduleForm.frequency" required>
              <option value="diario">Diario</option>
              <option value="semanal">Semanal</option>
              <option value="mensual">Mensual</option>
              <option value="personalizado">Personalizado</option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Hora de inicio:</label>
              <input v-model="scheduleForm.startTime" type="time" required>
            </div>
            <div class="form-group">
              <label>Día de la semana:</label>
              <select v-model="scheduleForm.dayOfWeek" v-if="scheduleForm.frequency === 'semanal'">
                <option value="lunes">Lunes</option>
                <option value="martes">Martes</option>
                <option value="miercoles">Miércoles</option>
                <option value="jueves">Jueves</option>
                <option value="viernes">Viernes</option>
                <option value="sabado">Sábado</option>
                <option value="domingo">Domingo</option>
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label>Ubicación de destino:</label>
            <select v-model="scheduleForm.destination" required>
              <option 
                v-for="location in backupConfig.locations" 
                :key="location.id" 
                :value="location.id"
              >
                {{ location.name }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Descripción:</label>
            <textarea v-model="scheduleForm.description" rows="3"></textarea>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Programar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showScheduleModal = ref(false)
const selectedType = ref('')
const selectedStatus = ref('')
const searchTerm = ref('')

const backupStatus = ref({
  lastBackup: {
    date: '2024-01-15',
    time: '02:00:00',
    size: '2.5 GB'
  },
  nextBackup: {
    date: '2024-01-16',
    time: '02:00:00',
    countdown: 'En 8 horas'
  },
  storageUsage: {
    used: '45.2 GB',
    total: '100 GB',
    percentage: 45
  },
  systemStatus: 'activo'
})

const scheduleForm = ref({
  type: 'completo',
  frequency: 'diario',
  startTime: '02:00',
  dayOfWeek: 'lunes',
  destination: '',
  description: ''
})

const backupConfig = ref({
  frequency: 'Diario',
  executionTime: '02:00 AM',
  retention: '30 días',
  locations: [
    {
      id: 1,
      name: 'Servidor Local',
      path: '/backups/local',
      status: 'activo'
    },
    {
      id: 2,
      name: 'Nube AWS',
      path: 's3://backup-bucket',
      status: 'activo'
    },
    {
      id: 3,
      name: 'Disco Externo',
      path: '/media/external',
      status: 'inactivo'
    }
  ],
  types: [
    {
      name: 'Respaldo Completo',
      description: 'Respalda todos los archivos del sistema',
      frequency: 'Semanal',
      enabled: true
    },
    {
      name: 'Respaldo Incremental',
      description: 'Respalda solo los archivos modificados',
      frequency: 'Diario',
      enabled: true
    },
    {
      name: 'Respaldo Diferencial',
      description: 'Respalda cambios desde el último completo',
      frequency: 'Diario',
      enabled: false
    }
  ]
})

const backups = ref([
  {
    id: 1,
    timestamp: '2024-01-15 02:00:00',
    type: 'completo',
    size: '2.5 GB',
    status: 'exitoso',
    duration: '45 min'
  },
  {
    id: 2,
    timestamp: '2024-01-14 02:00:00',
    type: 'incremental',
    size: '150 MB',
    status: 'exitoso',
    duration: '8 min'
  },
  {
    id: 3,
    timestamp: '2024-01-13 02:00:00',
    type: 'incremental',
    size: '200 MB',
    status: 'exitoso',
    duration: '12 min'
  },
  {
    id: 4,
    timestamp: '2024-01-12 02:00:00',
    type: 'incremental',
    size: '180 MB',
    status: 'fallido',
    duration: '0 min'
  },
  {
    id: 5,
    timestamp: '2024-01-11 02:00:00',
    type: 'incremental',
    size: '160 MB',
    status: 'exitoso',
    duration: '10 min'
  }
])

const filteredBackups = computed(() => {
  return backups.value.filter(backup => {
    const matchesType = !selectedType.value || backup.type === selectedType.value
    const matchesStatus = !selectedStatus.value || backup.status === selectedStatus.value
    const matchesSearch = backup.timestamp.toLowerCase().includes(searchTerm.value.toLowerCase())
    
    return matchesType && matchesStatus && matchesSearch
  })
})

const createBackup = () => {
  console.log('Creando respaldo manual...')
  // Implementar creación de respaldo
}

const viewBackupDetails = (backup) => {
  console.log('Viendo detalles de respaldo:', backup.id)
  // Implementar vista de detalles
}

const restoreBackup = (backup) => {
  if (confirm(`¿Estás seguro de que quieres restaurar el respaldo del ${backup.timestamp}?`)) {
    console.log('Restaurando respaldo:', backup.id)
    // Implementar restauración
  }
}

const downloadBackup = (backup) => {
  console.log('Descargando respaldo:', backup.id)
  // Implementar descarga
}

const deleteBackup = (backup) => {
  if (confirm(`¿Estás seguro de que quieres eliminar el respaldo del ${backup.timestamp}?`)) {
    const index = backups.value.findIndex(b => b.id === backup.id)
    if (index !== -1) {
      backups.value.splice(index, 1)
    }
  }
}

const editConfig = (configType) => {
  console.log('Editando configuración:', configType)
  // Implementar edición de configuración
}

const testLocation = (location) => {
  console.log('Probando ubicación:', location.name)
  // Implementar prueba de ubicación
}

const editLocation = (location) => {
  console.log('Editando ubicación:', location.name)
  // Implementar edición de ubicación
}

const toggleBackupType = (type) => {
  type.enabled = !type.enabled
}

const scheduleBackup = () => {
  console.log('Programando respaldo:', scheduleForm.value)
  // Implementar programación de respaldo
  closeModal()
}

const closeModal = () => {
  showScheduleModal.value = false
  scheduleForm.value = {
    type: 'completo',
    frequency: 'diario',
    startTime: '02:00',
    dayOfWeek: 'lunes',
    destination: '',
    description: ''
  }
}
</script>

<style scoped>
.backup {
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

.header-actions {
  display: flex;
  gap: 1rem;
}

.backup-status, .backups-list, .backup-config {
  margin-bottom: 3rem;
}

.backup-status h2, .backups-list h2, .backup-config h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.status-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.status-card h3 {
  color: #7f8c8d;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.backup-info, .next-backup {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.backup-date, .next-date {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.backup-time, .next-time {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.backup-size {
  color: #3498db;
  font-weight: 500;
}

.countdown {
  color: #f39c12;
  font-weight: 500;
}

.storage-usage {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.usage-bar {
  width: 100%;
  height: 8px;
  background: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
}

.usage-fill {
  height: 100%;
  background: linear-gradient(90deg, #27ae60, #f39c12, #e74c3c);
  transition: width 0.3s ease;
}

.usage-text {
  font-size: 0.9rem;
  color: #2c3e50;
}

.usage-percentage {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.system-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.status-indicator.activo {
  color: #27ae60;
}

.status-indicator.inactivo {
  color: #e74c3c;
}

.backups-filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-select, .search-input {
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

.backups-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.backups-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr;
  background: #f8f9fa;
  padding: 1rem;
  font-weight: 500;
  color: #2c3e50;
}

.backup-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 2fr;
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  transition: background-color 0.2s;
}

.backup-row:hover {
  background: #f8f9fa;
}

.backup-row:last-child {
  border-bottom: none;
}

.backup-row.exitoso {
  border-left: 4px solid #27ae60;
}

.backup-row.fallido {
  border-left: 4px solid #e74c3c;
}

.backup-row.en-progreso {
  border-left: 4px solid #f39c12;
}

.backup-cell {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.backup-type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.backup-type-badge.completo {
  background: #e3f2fd;
  color: #1976d2;
}

.backup-type-badge.incremental {
  background: #e8f5e8;
  color: #388e3c;
}

.backup-type-badge.diferencial {
  background: #fff3e0;
  color: #f57c00;
}

.backup-status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.backup-status-badge.exitoso {
  background: #d5f4e6;
  color: #27ae60;
}

.backup-status-badge.fallido {
  background: #fadbd8;
  color: #e74c3c;
}

.backup-status-badge.en-progreso {
  background: #fef5e7;
  color: #f39c12;
}

.backup-actions {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.config-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.config-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.config-section h3 {
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.config-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.config-item label {
  font-weight: 500;
  color: #2c3e50;
}

.config-item span {
  color: #7f8c8d;
  margin-right: 1rem;
}

.backup-locations, .backup-types {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.location-item, .type-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.location-info, .type-info {
  flex: 1;
}

.location-info h4, .type-info h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.location-info p, .type-info p {
  margin: 0 0 0.25rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.location-status, .type-frequency {
  font-size: 0.8rem;
  color: #95a5a6;
}

.location-status.activo {
  color: #27ae60;
}

.location-status.inactivo {
  color: #e74c3c;
}

.location-actions, .type-toggle {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #3498db;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.btn-primary, .btn-secondary, .btn-danger {
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

.btn-primary:hover:not(:disabled) {
  background: #2980b9;
}

.btn-primary:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #d5dbdb;
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
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
  
  .header-actions {
    justify-content: center;
  }
  
  .backups-header, .backup-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .backups-filters {
    flex-direction: column;
  }
  
  .config-sections {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
