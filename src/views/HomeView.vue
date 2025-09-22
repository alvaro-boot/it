<template>
  <div class="home">
    <div class="welcome-section">
      <h1>Bienvenido al Sistema de Gestión de TI</h1>
      <p class="welcome-text">
        Gestiona todos los aspectos de tecnología de la información de tu empresa desde un solo lugar.
      </p>
    </div>

    <div class="quick-actions">
      <h2>Acciones Rápidas</h2>
      <div class="actions-grid">
        <RouterLink to="/tickets" class="action-card">
          <div class="action-icon">🎫</div>
          <h3>Crear Ticket</h3>
          <p>Reportar un problema o solicitar soporte</p>
        </RouterLink>
        
        <RouterLink to="/inventario" class="action-card">
          <div class="action-icon">💻</div>
          <h3>Ver Inventario</h3>
          <p>Gestionar equipos y dispositivos</p>
        </RouterLink>
        
        <RouterLink to="/usuarios" class="action-card">
          <div class="action-icon">👥</div>
          <h3>Gestionar Usuarios</h3>
          <p>Administrar cuentas y permisos</p>
        </RouterLink>
        
        <RouterLink to="/backup" class="action-card">
          <div class="action-icon">💾</div>
          <h3>Crear Respaldo</h3>
          <p>Realizar respaldo manual del sistema</p>
        </RouterLink>
      </div>
    </div>

    <!-- Accesos rápidos a Gestión Humana -->
    <div class="gh-shortcuts">
      <h2>Accesos a Gestión Humana</h2>
      <div class="gh-actions">
        <button class="gh-btn" @click="goToGH('/empleados')">
          <span class="gh-icon">👥</span>
          Ir a Empleados
        </button>
        <button class="gh-btn secondary" @click="goToGH('/nomina')">
          <span class="gh-icon">💰</span>
          Ir a Nómina
        </button>
      </div>
    </div>

    <div class="system-overview">
      <h2>Resumen del Sistema</h2>
      <div class="overview-grid">
        <div class="overview-card">
          <div class="overview-icon">📊</div>
          <div class="overview-content">
            <h3>Estado General</h3>
            <div class="status-indicator online">🟢 Todo Operativo</div>
            <p>Última actualización: Hace 5 minutos</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-icon">🎫</div>
          <div class="overview-content">
            <h3>Tickets Activos</h3>
            <div class="number-highlight">12</div>
            <p>3 de alta prioridad</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-icon">💻</div>
          <div class="overview-content">
            <h3>Equipos Conectados</h3>
            <div class="number-highlight">156</div>
            <p>98% funcionando correctamente</p>
          </div>
        </div>
        
        <div class="overview-card">
          <div class="overview-icon">👥</div>
          <div class="overview-content">
            <h3>Usuarios Activos</h3>
            <div class="number-highlight">89</div>
            <p>5 nuevos esta semana</p>
          </div>
        </div>
      </div>
    </div>

    <div class="recent-activity">
      <h2>Actividad Reciente</h2>
      <div class="activity-list">
        <div class="activity-item">
          <div class="activity-icon">✅</div>
          <div class="activity-content">
            <h4>Respaldo completado</h4>
            <p>El respaldo nocturno se completó exitosamente</p>
            <span class="activity-time">Hace 2 horas</span>
          </div>
        </div>
        
        <div class="activity-item">
          <div class="activity-icon">🎫</div>
          <div class="activity-content">
            <h4>Nuevo ticket creado</h4>
            <p>Problema con impresora - Alta prioridad</p>
            <span class="activity-time">Hace 3 horas</span>
          </div>
        </div>
        
        <div class="activity-item">
          <div class="activity-icon">👤</div>
          <div class="activity-content">
            <h4>Usuario agregado</h4>
            <p>Nuevo usuario: María González</p>
            <span class="activity-time">Hace 5 horas</span>
          </div>
        </div>
        
        <div class="activity-item">
          <div class="activity-icon">🛡️</div>
          <div class="activity-content">
            <h4>Actualización de seguridad</h4>
            <p>Se aplicaron parches de seguridad críticos</p>
            <span class="activity-time">Ayer</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
function goToGH(path = '/') {
  window.parent?.postMessage({ type: 'navigate', module: 'gestion-humana', path }, '*')
}
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.welcome-section h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 700;
  line-height: 1.2;
  word-wrap: break-word;
  hyphens: auto;
}

.welcome-text {
  font-size: 1.2rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.quick-actions, .system-overview, .recent-activity {
  margin-bottom: 3rem;
}

.gh-shortcuts {
  margin-bottom: 3rem;
}

.gh-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.gh-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: #fff;
  border: none;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  box-shadow: 0 8px 24px rgba(124,58,237,0.25);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.gh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 30px rgba(124,58,237,0.3);
}

.gh-btn.secondary {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  box-shadow: 0 8px 24px rgba(34,197,94,0.25);
}

.gh-icon { font-size: 14px; }

.quick-actions h2, .system-overview h2, .recent-activity h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.action-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  text-align: center;
}

.action-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 30px rgba(0,0,0,0.15);
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.action-card h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.action-card p {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.overview-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
}

.overview-icon {
  font-size: 2.5rem;
  width: 60px;
  text-align: center;
}

.overview-content {
  flex: 1;
}

.overview-content h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.status-indicator {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.status-indicator.online {
  color: #27ae60;
}

.number-highlight {
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.overview-content p {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin: 0;
}

.activity-list {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #f8f9fa;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  font-size: 1.5rem;
  width: 40px;
  text-align: center;
}

.activity-content {
  flex: 1;
}

.activity-content h4 {
  color: #2c3e50;
  margin-bottom: 0.25rem;
  font-size: 1rem;
}

.activity-content p {
  color: #7f8c8d;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.activity-time {
  color: #95a5a6;
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .home {
    padding: 1rem;
  }
  
  .welcome-section {
    padding: 1.5rem;
  }
  
  .welcome-section h1 {
    font-size: 1.8rem;
    line-height: 1.3;
  }
  
  .welcome-text {
    font-size: 1rem;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .overview-grid {
    grid-template-columns: 1fr;
  }
  
  .overview-card {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .welcome-section {
    padding: 1rem;
  }
  
  .welcome-section h1 {
    font-size: 1.5rem;
    line-height: 1.4;
  }
  
  .welcome-text {
    font-size: 0.9rem;
  }
}
</style>
