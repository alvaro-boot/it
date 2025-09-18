<template>
  <div class="red">
    <div class="header">
      <h1>Gestión de Red</h1>
      <div class="header-actions">
        <button @click="refreshNetworkStatus" class="btn-secondary">
          🔄 Actualizar
        </button>
        <button @click="showAddDeviceModal = true" class="btn-primary">
          + Agregar Dispositivo
        </button>
      </div>
    </div>

    <!-- Estado general de la red -->
    <div class="network-status">
      <h2>Estado de la Red</h2>
      <div class="status-grid">
        <div class="status-card">
          <h3>Conectividad</h3>
          <div class="status-indicator" :class="networkStatus.connectivity">
            {{ networkStatus.connectivity === 'online' ? '🟢' : '🔴' }}
            {{ networkStatus.connectivity === 'online' ? 'Conectado' : 'Desconectado' }}
          </div>
        </div>
        <div class="status-card">
          <h3>Velocidad de Internet</h3>
          <div class="speed-info">
            <span class="speed-value">{{ networkStatus.internetSpeed }}</span>
            <span class="speed-unit">Mbps</span>
          </div>
        </div>
        <div class="status-card">
          <h3>Dispositivos Conectados</h3>
          <div class="device-count">
            <span class="count-value">{{ connectedDevices.length }}</span>
            <span class="count-label">dispositivos</span>
          </div>
        </div>
        <div class="status-card">
          <h3>Uso de Ancho de Banda</h3>
          <div class="bandwidth-usage">
            <div class="usage-bar">
              <div class="usage-fill" :style="{ width: networkStatus.bandwidthUsage + '%' }"></div>
            </div>
            <span class="usage-text">{{ networkStatus.bandwidthUsage }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Dispositivos de red -->
    <div class="network-devices">
      <h2>Dispositivos de Red</h2>
      <div class="devices-grid">
        <div 
          v-for="device in networkDevices" 
          :key="device.id" 
          class="device-card"
          :class="{ 'offline': !device.isOnline }"
        >
          <div class="device-header">
            <div class="device-icon">
              {{ getDeviceIcon(device.type) }}
            </div>
            <div class="device-info">
              <h3>{{ device.name }}</h3>
              <p>{{ device.ipAddress }}</p>
            </div>
            <div class="device-status">
              <span class="status-dot" :class="device.isOnline ? 'online' : 'offline'"></span>
              {{ device.isOnline ? 'En línea' : 'Desconectado' }}
            </div>
          </div>
          
          <div class="device-details">
            <div class="detail-row">
              <span class="label">Tipo:</span>
              <span class="value">{{ device.type }}</span>
            </div>
            <div class="detail-row">
              <span class="label">MAC:</span>
              <span class="value">{{ device.macAddress }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Ubicación:</span>
              <span class="value">{{ device.location }}</span>
            </div>
            <div class="detail-row">
              <span class="label">Última conexión:</span>
              <span class="value">{{ device.lastSeen }}</span>
            </div>
          </div>

          <div class="device-actions">
            <button @click="pingDevice(device)" class="btn-secondary">
              Ping
            </button>
            <button @click="editDevice(device)" class="btn-secondary">
              Editar
            </button>
            <button @click="viewDeviceLogs(device)" class="btn-secondary">
              Logs
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Configuración de red -->
    <div class="network-config">
      <h2>Configuración de Red</h2>
      <div class="config-sections">
        <div class="config-section">
          <h3>Configuración DHCP</h3>
          <div class="config-item">
            <label>Rango de IP:</label>
            <span>{{ dhcpConfig.ipRange }}</span>
          </div>
          <div class="config-item">
            <label>Gateway:</label>
            <span>{{ dhcpConfig.gateway }}</span>
          </div>
          <div class="config-item">
            <label>DNS Primario:</label>
            <span>{{ dhcpConfig.dnsPrimary }}</span>
          </div>
          <div class="config-item">
            <label>DNS Secundario:</label>
            <span>{{ dhcpConfig.dnsSecondary }}</span>
          </div>
        </div>

        <div class="config-section">
          <h3>Configuración de Firewall</h3>
          <div class="config-item">
            <label>Estado:</label>
            <span class="status-badge" :class="firewallConfig.status">
              {{ firewallConfig.status }}
            </span>
          </div>
          <div class="config-item">
            <label>Reglas activas:</label>
            <span>{{ firewallConfig.activeRules }}</span>
          </div>
          <div class="config-item">
            <label>Puertos bloqueados:</label>
            <span>{{ firewallConfig.blockedPorts }}</span>
          </div>
        </div>

        <div class="config-section">
          <h3>Configuración de VPN</h3>
          <div class="config-item">
            <label>Estado:</label>
            <span class="status-badge" :class="vpnConfig.status">
              {{ vpnConfig.status }}
            </span>
          </div>
          <div class="config-item">
            <label>Conexiones activas:</label>
            <span>{{ vpnConfig.activeConnections }}</span>
          </div>
          <div class="config-item">
            <label>Servidor:</label>
            <span>{{ vpnConfig.server }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal para agregar dispositivo -->
    <div v-if="showAddDeviceModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Agregar Dispositivo de Red</h2>
        
        <form @submit.prevent="saveDevice">
          <div class="form-group">
            <label>Nombre del Dispositivo:</label>
            <input v-model="deviceForm.name" type="text" required>
          </div>
          
          <div class="form-group">
            <label>Tipo:</label>
            <select v-model="deviceForm.type" required>
              <option value="router">Router</option>
              <option value="switch">Switch</option>
              <option value="access-point">Access Point</option>
              <option value="firewall">Firewall</option>
              <option value="server">Servidor</option>
              <option value="printer">Impresora</option>
            </select>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Dirección IP:</label>
              <input v-model="deviceForm.ipAddress" type="text" required>
            </div>
            <div class="form-group">
              <label>Dirección MAC:</label>
              <input v-model="deviceForm.macAddress" type="text" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Ubicación:</label>
            <input v-model="deviceForm.location" type="text" required>
          </div>
          
          <div class="form-actions">
            <button type="button" @click="closeModal" class="btn-secondary">
              Cancelar
            </button>
            <button type="submit" class="btn-primary">
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const showAddDeviceModal = ref(false)

const networkStatus = ref({
  connectivity: 'online',
  internetSpeed: 100,
  bandwidthUsage: 45
})

const dhcpConfig = ref({
  ipRange: '192.168.1.100 - 192.168.1.200',
  gateway: '192.168.1.1',
  dnsPrimary: '8.8.8.8',
  dnsSecondary: '8.8.4.4'
})

const firewallConfig = ref({
  status: 'activo',
  activeRules: 15,
  blockedPorts: '22, 23, 135, 139, 445'
})

const vpnConfig = ref({
  status: 'activo',
  activeConnections: 3,
  server: 'vpn.empresa.com'
})

const deviceForm = ref({
  name: '',
  type: 'router',
  ipAddress: '',
  macAddress: '',
  location: ''
})

const networkDevices = ref([
  {
    id: 1,
    name: 'Router Principal',
    type: 'router',
    ipAddress: '192.168.1.1',
    macAddress: '00:1B:44:11:3A:B7',
    location: 'Sala de Servidores',
    isOnline: true,
    lastSeen: 'Hace 2 minutos'
  },
  {
    id: 2,
    name: 'Switch Piso 2',
    type: 'switch',
    ipAddress: '192.168.1.10',
    macAddress: '00:1B:44:11:3A:B8',
    location: 'Piso 2 - Rack Principal',
    isOnline: true,
    lastSeen: 'Hace 1 minuto'
  },
  {
    id: 3,
    name: 'Access Point Oficina',
    type: 'access-point',
    ipAddress: '192.168.1.20',
    macAddress: '00:1B:44:11:3A:B9',
    location: 'Oficina Principal',
    isOnline: true,
    lastSeen: 'Hace 3 minutos'
  },
  {
    id: 4,
    name: 'Firewall Empresa',
    type: 'firewall',
    ipAddress: '192.168.1.5',
    macAddress: '00:1B:44:11:3A:BA',
    location: 'Sala de Servidores',
    isOnline: false,
    lastSeen: 'Hace 2 horas'
  },
  {
    id: 5,
    name: 'Impresora Red',
    type: 'printer',
    ipAddress: '192.168.1.50',
    macAddress: '00:1B:44:11:3A:BB',
    location: 'Área de Contabilidad',
    isOnline: true,
    lastSeen: 'Hace 5 minutos'
  }
])

const connectedDevices = computed(() => {
  return networkDevices.value.filter(device => device.isOnline)
})

const getDeviceIcon = (type) => {
  const icons = {
    'router': '🌐',
    'switch': '🔀',
    'access-point': '📶',
    'firewall': '🛡️',
    'server': '🖥️',
    'printer': '🖨️'
  }
  return icons[type] || '🔧'
}

const refreshNetworkStatus = () => {
  // Simular actualización del estado de la red
  console.log('Actualizando estado de la red...')
  // Aquí iría la lógica real para obtener el estado actual
}

const pingDevice = (device) => {
  console.log(`Haciendo ping a ${device.name} (${device.ipAddress})`)
  // Aquí iría la lógica real para hacer ping
}

const editDevice = (device) => {
  console.log('Editando dispositivo:', device.name)
  // Implementar edición de dispositivo
}

const viewDeviceLogs = (device) => {
  console.log('Viendo logs de:', device.name)
  // Implementar vista de logs
}

const saveDevice = () => {
  const newDevice = {
    id: Date.now(),
    ...deviceForm.value,
    isOnline: true,
    lastSeen: 'Ahora'
  }
  networkDevices.value.push(newDevice)
  closeModal()
}

const closeModal = () => {
  showAddDeviceModal.value = false
  deviceForm.value = {
    name: '',
    type: 'router',
    ipAddress: '',
    macAddress: '',
    location: ''
  }
}
</script>

<style scoped>
.red {
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

.network-status {
  margin-bottom: 3rem;
}

.network-status h2 {
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

.status-indicator {
  font-size: 1.2rem;
  font-weight: 500;
}

.speed-info {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.speed-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.speed-unit {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.device-count {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.count-value {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
}

.count-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.bandwidth-usage {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
}

.network-devices, .network-config {
  margin-bottom: 3rem;
}

.network-devices h2, .network-config h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
}

.device-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.device-card.offline {
  opacity: 0.6;
  border-left: 4px solid #e74c3c;
}

.device-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.device-icon {
  font-size: 2rem;
}

.device-info {
  flex: 1;
}

.device-info h3 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
}

.device-info p {
  margin: 0;
  color: #7f8c8d;
  font-size: 0.9rem;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: #7f8c8d;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-dot.online {
  background: #27ae60;
}

.status-dot.offline {
  background: #e74c3c;
}

.device-details {
  margin-bottom: 1rem;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.detail-row .label {
  color: #7f8c8d;
  font-weight: 500;
}

.detail-row .value {
  color: #2c3e50;
}

.device-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.config-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.config-item label {
  color: #7f8c8d;
  font-weight: 500;
}

.config-item span {
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

.status-badge.inactivo {
  background: #fadbd8;
  color: #e74c3c;
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
  max-width: 500px;
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
  
  .header-actions {
    justify-content: center;
  }
  
  .devices-grid {
    grid-template-columns: 1fr;
  }
  
  .config-sections {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
