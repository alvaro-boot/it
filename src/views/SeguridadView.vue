<template>
  <div class="seguridad">
    <div class="header">
      <h1>Seguridad Informática</h1>
      <div class="header-actions">
        <button @click="runSecurityScan" class="btn-warning">
          🔍 Escanear Sistema
        </button>
        <button @click="showAddPolicyModal = true" class="btn-primary">
          + Nueva Política
        </button>
      </div>
    </div>

    <!-- Estado de seguridad -->
    <div class="security-status">
      <h2>Estado de Seguridad</h2>
      <div class="status-grid">
        <div class="status-card">
          <h3>Nivel de Seguridad</h3>
          <div class="security-level" :class="securityStatus.level">
            <div class="level-icon">
              {{ getSecurityIcon(securityStatus.level) }}
            </div>
            <div class="level-text">{{ securityStatus.level.toUpperCase() }}</div>
          </div>
        </div>
        <div class="status-card">
          <h3>Antivirus</h3>
          <div class="antivirus-status">
            <span class="status-indicator" :class="securityStatus.antivirus.status">
              {{ securityStatus.antivirus.status === 'activo' ? '🟢' : '🔴' }}
            </span>
            <span>{{ securityStatus.antivirus.status === 'activo' ? 'Activo' : 'Inactivo' }}</span>
            <div class="last-scan">
              Último escaneo: {{ securityStatus.antivirus.lastScan }}
            </div>
          </div>
        </div>
        <div class="status-card">
          <h3>Firewall</h3>
          <div class="firewall-status">
            <span class="status-indicator" :class="securityStatus.firewall.status">
              {{ securityStatus.firewall.status === 'activo' ? '🟢' : '🔴' }}
            </span>
            <span>{{ securityStatus.firewall.status === 'activo' ? 'Activo' : 'Inactivo' }}</span>
            <div class="blocked-attacks">
              Ataques bloqueados: {{ securityStatus.firewall.blockedAttacks }}
            </div>
          </div>
        </div>
        <div class="status-card">
          <h3>Actualizaciones</h3>
          <div class="updates-status">
            <div class="pending-updates">
              <span class="update-count">{{ securityStatus.updates.pending }}</span>
              <span class="update-label">Pendientes</span>
            </div>
            <div class="last-update">
              Última actualización: {{ securityStatus.updates.lastUpdate }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Alertas de seguridad -->
    <div class="security-alerts">
      <h2>Alertas de Seguridad</h2>
      <div class="alerts-list">
        <div 
          v-for="alert in securityAlerts" 
          :key="alert.id" 
          class="alert-item"
          :class="alert.severity"
        >
          <div class="alert-icon">
            {{ getAlertIcon(alert.severity) }}
          </div>
          <div class="alert-content">
            <h4>{{ alert.title }}</h4>
            <p>{{ alert.description }}</p>
            <div class="alert-meta">
              <span class="alert-time">{{ alert.timestamp }}</span>
              <span class="alert-source">{{ alert.source }}</span>
            </div>
          </div>
          <div class="alert-actions">
            <button @click="dismissAlert(alert)" class="btn-secondary">
              Descartar
            </button>
            <button @click="investigateAlert(alert)" class="btn-primary">
              Investigar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Políticas de seguridad -->
    <div class="security-policies">
      <h2>Políticas de Seguridad</h2>
      <div class="policies-grid">
        <div 
          v-for="policy in securityPolicies" 
          :key="policy.id" 
          class="policy-card"
        >
          <div class="policy-header">
            <h3>{{ policy.name }}</h3>
            <span class="policy-status" :class="policy.status">
              {{ policy.status }}
            </span>
          </div>
          <div class="policy-description">
            <p>{{ policy.description }}</p>
          </div>
          <div class="policy-details">
            <div class="detail-item">
              <span class="label">Tipo:</span>
              <span class="value">{{ policy.type }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Última modificación:</span>
              <span class="value">{{ policy.lastModified }}</span>
            </div>
            <div class="detail-item">
              <span class="label">Aplicada a:</span>
              <span class="value">{{ policy.appliedTo }}</span>
            </div>
          </div>
          <div class="policy-actions">
            <button @click="editPolicy(policy)" class="btn-secondary">
              Editar
            </button>
            <button @click="viewPolicyDetails(policy)" class="btn-secondary">
              Ver Detalles
            </button>
            <button 
              @click="togglePolicy(policy)" 
              :class="policy.status === 'activa' ? 'btn-warning' : 'btn-success'"
            >
              {{ policy.status === 'activa' ? 'Desactivar' : 'Activar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Logs de seguridad -->
    <div class="security-logs">
      <h2>Logs de Seguridad</h2>
      <div class="logs-filters">
        <select v-model="selectedLogType" class="filter-select">
          <option value="">Todos los tipos</option>
          <option value="login">Inicios de sesión</option>
          <option value="access">Accesos</option>
          <option value="firewall">Firewall</option>
          <option value="antivirus">Antivirus</option>
          <option value="system">Sistema</option>
        </select>
        <input 
          v-model="logSearchTerm" 
          type="text" 
          placeholder="Buscar en logs..."
          class="search-input"
        >
        <button @click="exportLogs" class="btn-secondary">
          Exportar Logs
        </button>
      </div>
      <div class="logs-table">
        <div class="logs-header">
          <div class="log-column">Fecha/Hora</div>
          <div class="log-column">Tipo</div>
          <div class="log-column">Usuario/IP</div>
          <div class="log-column">Evento</div>
          <div class="log-column">Estado</div>
        </div>
        <div 
          v-for="log in filteredLogs" 
          :key="log.id" 
          class="log-row"
          :class="log.severity"
        >
          <div class="log-cell">{{ log.timestamp }}</div>
          <div class="log-cell">
            <span class="log-type-badge" :class="log.type">
              {{ log.type }}
            </span>
          </div>
          <div class="log-cell">{{ log.userOrIp }}</div>
          <div class="log-cell">{{ log.event }}</div>
          <div class="log-cell">
            <span class="log-status" :class="log.status">
              {{ log.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar política -->
    <div v-if="showAddPolicyModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Nueva Política de Seguridad</h2>
        
        <form @submit.prevent="savePolicy">
          <div class="form-group">
            <label>Nombre de la Política:</label>
            <input v-model="policyForm.name" type="text" required>
          </div>
          
          <div class="form-group">
            <label>Tipo:</label>
            <select v-model="policyForm.type" required>
              <option value="password">Contraseñas</option>
              <option value="access">Control de Acceso</option>
              <option value="network">Red</option>
              <option value="data">Protección de Datos</option>
              <option value="backup">Respaldo</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Descripción:</label>
            <textarea v-model="policyForm.description" rows="4" required></textarea>
          </div>
          
          <div class="form-group">
            <label>Aplicar a:</label>
            <select v-model="policyForm.appliedTo" required>
              <option value="todos">Todos los usuarios</option>
              <option value="administradores">Solo administradores</option>
              <option value="usuarios">Solo usuarios</option>
              <option value="departamento">Por departamento</option>
            </select>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Crear Política
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showAddPolicyModal = ref(false)
const selectedLogType = ref('')
const logSearchTerm = ref('')

const securityStatus = ref({
  level: 'alto',
  antivirus: {
    status: 'activo',
    lastScan: 'Hace 2 horas'
  },
  firewall: {
    status: 'activo',
    blockedAttacks: 15
  },
  updates: {
    pending: 3,
    lastUpdate: 'Ayer'
  }
})

const policyForm = ref({
  name: '',
  type: 'password',
  description: '',
  appliedTo: 'todos'
})

const securityAlerts = ref([
  {
    id: 1,
    title: 'Intento de acceso no autorizado',
    description: 'Se detectó un intento de acceso desde una IP no reconocida',
    severity: 'high',
    timestamp: 'Hace 5 minutos',
    source: 'Firewall'
  },
  {
    id: 2,
    title: 'Virus detectado',
    description: 'Se encontró malware en el archivo descargado por usuario',
    severity: 'critical',
    timestamp: 'Hace 15 minutos',
    source: 'Antivirus'
  },
  {
    id: 3,
    title: 'Actualización de seguridad disponible',
    description: 'Hay actualizaciones críticas de seguridad pendientes',
    severity: 'medium',
    timestamp: 'Hace 1 hora',
    source: 'Sistema'
  }
])

const securityPolicies = ref([
  {
    id: 1,
    name: 'Política de Contraseñas',
    description: 'Establece los requisitos mínimos para las contraseñas de usuario',
    type: 'password',
    status: 'activa',
    lastModified: '2024-01-10',
    appliedTo: 'Todos los usuarios'
  },
  {
    id: 2,
    name: 'Control de Acceso a Archivos',
    description: 'Define los permisos de acceso a archivos y carpetas del sistema',
    type: 'access',
    status: 'activa',
    lastModified: '2024-01-08',
    appliedTo: 'Por departamento'
  },
  {
    id: 3,
    name: 'Política de Respaldo',
    description: 'Establece la frecuencia y métodos de respaldo de datos',
    type: 'backup',
    status: 'activa',
    lastModified: '2024-01-05',
    appliedTo: 'Sistema completo'
  }
])

const securityLogs = ref([
  {
    id: 1,
    timestamp: '2024-01-15 14:30:25',
    type: 'login',
    userOrIp: '192.168.1.100',
    event: 'Intento de inicio de sesión fallido',
    status: 'fallido',
    severity: 'high'
  },
  {
    id: 2,
    timestamp: '2024-01-15 14:25:10',
    type: 'access',
    userOrIp: 'juan.perez',
    event: 'Acceso a archivo confidencial',
    status: 'exitoso',
    severity: 'medium'
  },
  {
    id: 3,
    timestamp: '2024-01-15 14:20:45',
    type: 'firewall',
    userOrIp: '203.0.113.1',
    event: 'Conexión bloqueada',
    status: 'bloqueado',
    severity: 'high'
  },
  {
    id: 4,
    timestamp: '2024-01-15 14:15:30',
    type: 'antivirus',
    userOrIp: 'maria.gonzalez',
    event: 'Escaneo completado',
    status: 'exitoso',
    severity: 'low'
  }
])

const filteredLogs = computed(() => {
  return securityLogs.value.filter(log => {
    const matchesType = !selectedLogType.value || log.type === selectedLogType.value
    const matchesSearch = log.event.toLowerCase().includes(logSearchTerm.value.toLowerCase()) ||
                         log.userOrIp.toLowerCase().includes(logSearchTerm.value.toLowerCase())
    
    return matchesType && matchesSearch
  })
})

const getSecurityIcon = (level) => {
  const icons = {
    'alto': '🛡️',
    'medio': '⚠️',
    'bajo': '🚨'
  }
  return icons[level] || '❓'
}

const getAlertIcon = (severity) => {
  const icons = {
    'critical': '🚨',
    'high': '⚠️',
    'medium': 'ℹ️',
    'low': '✅'
  }
  return icons[severity] || '❓'
}

const runSecurityScan = () => {
  console.log('Ejecutando escaneo de seguridad...')
  // Implementar lógica de escaneo
}

const dismissAlert = (alert) => {
  const index = securityAlerts.value.findIndex(a => a.id === alert.id)
  if (index !== -1) {
    securityAlerts.value.splice(index, 1)
  }
}

const investigateAlert = (alert) => {
  console.log('Investigando alerta:', alert.title)
  // Implementar investigación de alerta
}

const editPolicy = (policy) => {
  console.log('Editando política:', policy.name)
  // Implementar edición de política
}

const viewPolicyDetails = (policy) => {
  console.log('Viendo detalles de política:', policy.name)
  // Implementar vista de detalles
}

const togglePolicy = (policy) => {
  const index = securityPolicies.value.findIndex(p => p.id === policy.id)
  if (index !== -1) {
    securityPolicies.value[index].status = policy.status === 'activa' ? 'inactiva' : 'activa'
  }
}

const exportLogs = () => {
  console.log('Exportando logs de seguridad...')
  // Implementar exportación de logs
}

const savePolicy = () => {
  const newPolicy = {
    id: Date.now(),
    ...policyForm.value,
    status: 'activa',
    lastModified: new Date().toISOString().split('T')[0]
  }
  securityPolicies.value.push(newPolicy)
  closeModal()
}

const closeModal = () => {
  showAddPolicyModal.value = false
  policyForm.value = {
    name: '',
    type: 'password',
    description: '',
    appliedTo: 'todos'
  }
}
</script>

<style scoped>
.seguridad {
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

.security-status, .security-alerts, .security-policies, .security-logs {
  margin-bottom: 3rem;
}

.security-status h2, .security-alerts h2, .security-policies h2, .security-logs h2 {
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

.security-level {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.security-level.alto {
  color: #27ae60;
}

.security-level.medio {
  color: #f39c12;
}

.security-level.bajo {
  color: #e74c3c;
}

.level-icon {
  font-size: 2rem;
}

.level-text {
  font-size: 1.2rem;
  font-weight: bold;
}

.antivirus-status, .firewall-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.status-indicator {
  font-size: 1.5rem;
}

.status-indicator.activo {
  color: #27ae60;
}

.status-indicator.inactivo {
  color: #e74c3c;
}

.last-scan, .blocked-attacks {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.updates-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.pending-updates {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.update-count {
  font-size: 2rem;
  font-weight: bold;
  color: #e74c3c;
}

.update-label {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.last-update {
  font-size: 0.8rem;
  color: #7f8c8d;
}

.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.alert-item.critical {
  border-left: 4px solid #e74c3c;
  background: #fdf2f2;
}

.alert-item.high {
  border-left: 4px solid #f39c12;
  background: #fef9e7;
}

.alert-item.medium {
  border-left: 4px solid #3498db;
  background: #ebf3fd;
}

.alert-icon {
  font-size: 1.5rem;
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.alert-content p {
  margin: 0 0 0.5rem 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.alert-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  color: #95a5a6;
}

.alert-actions {
  display: flex;
  gap: 0.5rem;
}

.policies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.policy-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.policy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.policy-header h3 {
  margin: 0;
  color: #2c3e50;
}

.policy-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.policy-status.activa {
  background: #d5f4e6;
  color: #27ae60;
}

.policy-status.inactiva {
  background: #fadbd8;
  color: #e74c3c;
}

.policy-description {
  margin-bottom: 1rem;
}

.policy-description p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.policy-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-item .label {
  color: #7f8c8d;
  font-weight: 500;
}

.detail-item .value {
  color: #2c3e50;
}

.policy-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.logs-filters {
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

.logs-table {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.logs-header {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr 1fr;
  background: #f8f9fa;
  padding: 1rem;
  font-weight: 500;
  color: #2c3e50;
}

.log-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 2fr 1fr;
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  transition: background-color 0.2s;
}

.log-row:hover {
  background: #f8f9fa;
}

.log-row:last-child {
  border-bottom: none;
}

.log-row.high {
  border-left: 4px solid #e74c3c;
}

.log-row.medium {
  border-left: 4px solid #f39c12;
}

.log-row.low {
  border-left: 4px solid #27ae60;
}

.log-cell {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.log-type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.log-type-badge.login {
  background: #e3f2fd;
  color: #1976d2;
}

.log-type-badge.access {
  background: #f3e5f5;
  color: #7b1fa2;
}

.log-type-badge.firewall {
  background: #fff3e0;
  color: #f57c00;
}

.log-type-badge.antivirus {
  background: #e8f5e8;
  color: #388e3c;
}

.log-type-badge.system {
  background: #fce4ec;
  color: #c2185b;
}

.log-status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.log-status.exitoso {
  background: #d5f4e6;
  color: #27ae60;
}

.log-status.fallido {
  background: #fadbd8;
  color: #e74c3c;
}

.log-status.bloqueado {
  background: #fef5e7;
  color: #f39c12;
}

.btn-primary, .btn-secondary, .btn-warning, .btn-success {
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

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-warning:hover {
  background: #e67e22;
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
  
  .policies-grid {
    grid-template-columns: 1fr;
  }
  
  .logs-header, .log-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .logs-filters {
    flex-direction: column;
  }
}
</style>
