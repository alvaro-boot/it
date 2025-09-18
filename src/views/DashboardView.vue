<template>
  <div class="dashboard">
    <h1>Dashboard de TI</h1>
    
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Equipos Activos</h3>
        <div class="stat-number">{{ stats.activeDevices }}</div>
        <div class="stat-change positive">+5% este mes</div>
      </div>
      
      <div class="stat-card">
        <h3>Tickets Abiertos</h3>
        <div class="stat-number">{{ stats.openTickets }}</div>
        <div class="stat-change negative">+12% esta semana</div>
      </div>
      
      <div class="stat-card">
        <h3>Usuarios Activos</h3>
        <div class="stat-number">{{ stats.activeUsers }}</div>
        <div class="stat-change positive">+3% este mes</div>
      </div>
      
      <div class="stat-card">
        <h3>Uptime del Sistema</h3>
        <div class="stat-number">{{ stats.systemUptime }}%</div>
        <div class="stat-change positive">+0.2% esta semana</div>
      </div>
    </div>

    <div class="dashboard-grid">
      <div class="dashboard-section">
        <h2>Tickets Recientes</h2>
        <div class="ticket-list">
          <div v-for="ticket in recentTickets" :key="ticket.id" class="ticket-item">
            <div class="ticket-priority" :class="ticket.priority"></div>
            <div class="ticket-info">
              <h4>{{ ticket.title }}</h4>
              <p>{{ ticket.description }}</p>
              <span class="ticket-date">{{ ticket.date }}</span>
            </div>
            <div class="ticket-status" :class="ticket.status">
              {{ ticket.status }}
            </div>
          </div>
        </div>
      </div>

      <div class="dashboard-section">
        <h2>Alertas del Sistema</h2>
        <div class="alerts-list">
          <div v-for="alert in systemAlerts" :key="alert.id" class="alert-item" :class="alert.severity">
            <div class="alert-icon">⚠️</div>
            <div class="alert-content">
              <h4>{{ alert.title }}</h4>
              <p>{{ alert.message }}</p>
              <span class="alert-time">{{ alert.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const stats = ref({
  activeDevices: 156,
  openTickets: 23,
  activeUsers: 89,
  systemUptime: 99.8
})

const recentTickets = ref([
  {
    id: 1,
    title: 'Problema con impresora',
    description: 'La impresora del piso 3 no está funcionando',
    priority: 'high',
    status: 'open',
    date: 'Hace 2 horas'
  },
  {
    id: 2,
    title: 'Solicitud de software',
    description: 'Necesito instalar Adobe Creative Suite',
    priority: 'medium',
    status: 'in-progress',
    date: 'Hace 4 horas'
  },
  {
    id: 3,
    title: 'Problema de red',
    description: 'Conexión lenta en el área de contabilidad',
    priority: 'high',
    status: 'open',
    date: 'Hace 6 horas'
  }
])

const systemAlerts = ref([
  {
    id: 1,
    title: 'Alto uso de CPU',
    message: 'El servidor principal está usando 85% de CPU',
    severity: 'warning',
    time: 'Hace 15 minutos'
  },
  {
    id: 2,
    title: 'Espacio en disco bajo',
    message: 'Solo queda 10% de espacio en el disco principal',
    severity: 'critical',
    time: 'Hace 1 hora'
  },
  {
    id: 3,
    title: 'Backup completado',
    message: 'El backup nocturno se completó exitosamente',
    severity: 'info',
    time: 'Hace 3 horas'
  }
])
</script>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard h1 {
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.stat-change {
  font-size: 0.8rem;
  font-weight: 500;
}

.stat-change.positive {
  color: #27ae60;
}

.stat-change.negative {
  color: #e74c3c;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.dashboard-section {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.dashboard-section h2 {
  color: #2c3e50;
  margin-bottom: 1rem;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.ticket-item, .alert-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
  gap: 1rem;
}

.ticket-item:last-child, .alert-item:last-child {
  border-bottom: none;
}

.ticket-priority {
  width: 4px;
  height: 40px;
  border-radius: 2px;
}

.ticket-priority.high {
  background: #e74c3c;
}

.ticket-priority.medium {
  background: #f39c12;
}

.ticket-priority.low {
  background: #27ae60;
}

.ticket-info, .alert-content {
  flex: 1;
}

.ticket-info h4, .alert-content h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 0.9rem;
}

.ticket-info p, .alert-content p {
  margin: 0 0 0.25rem 0;
  color: #7f8c8d;
  font-size: 0.8rem;
}

.ticket-date, .alert-time {
  font-size: 0.7rem;
  color: #95a5a6;
}

.ticket-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.ticket-status.open {
  background: #e74c3c;
  color: white;
}

.ticket-status.in-progress {
  background: #f39c12;
  color: white;
}

.ticket-status.closed {
  background: #27ae60;
  color: white;
}

.alert-icon {
  font-size: 1.5rem;
}

.alert-item.warning {
  border-left: 4px solid #f39c12;
}

.alert-item.critical {
  border-left: 4px solid #e74c3c;
}

.alert-item.info {
  border-left: 4px solid #3498db;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}
</style>
