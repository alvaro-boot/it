<template>
  <nav class="top-navigation">
    <div class="nav-container">
      <div class="nav-brand">
        <h1>🔧 Tecnología de la Información</h1>
      </div>
      
      <div class="nav-menu">
        <RouterLink to="/" class="nav-link" :class="{ active: $route.name === 'home' }">
          <span class="nav-icon">🏠</span>
          <span class="nav-text">Inicio</span>
        </RouterLink>
        
        <RouterLink to="/dashboard" class="nav-link" :class="{ active: $route.name === 'dashboard' }">
          <span class="nav-icon">📊</span>
          <span class="nav-text">Dashboard</span>
        </RouterLink>
        
        <RouterLink to="/inventario" class="nav-link" :class="{ active: $route.name === 'inventario' }">
          <span class="nav-icon">💻</span>
          <span class="nav-text">Inventario</span>
        </RouterLink>
        
        <RouterLink to="/tickets" class="nav-link" :class="{ active: $route.name === 'tickets' }">
          <span class="nav-icon">🎫</span>
          <span class="nav-text">Tickets</span>
          <span v-if="pendingTickets > 0" class="nav-badge">{{ pendingTickets }}</span>
        </RouterLink>
        
        <RouterLink to="/usuarios" class="nav-link" :class="{ active: $route.name === 'usuarios' }">
          <span class="nav-icon">👥</span>
          <span class="nav-text">Usuarios</span>
        </RouterLink>
        
        <RouterLink to="/red" class="nav-link" :class="{ active: $route.name === 'red' }">
          <span class="nav-icon">🌐</span>
          <span class="nav-text">Red</span>
        </RouterLink>
        
        <RouterLink to="/seguridad" class="nav-link" :class="{ active: $route.name === 'seguridad' }">
          <span class="nav-icon">🛡️</span>
          <span class="nav-text">Seguridad</span>
          <span v-if="securityAlerts > 0" class="nav-badge alert">{{ securityAlerts }}</span>
        </RouterLink>
        
        <RouterLink to="/backup" class="nav-link" :class="{ active: $route.name === 'backup' }">
          <span class="nav-icon">💾</span>
          <span class="nav-text">Respaldos</span>
        </RouterLink>
      </div>
      
      <div class="nav-actions">
        <div class="search-container">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Buscar..."
            class="search-input"
            @keyup.enter="performSearch"
          >
          <button @click="performSearch" class="search-button">
            🔍
          </button>
        </div>
        
        <div class="notifications">
          <button @click="toggleNotifications" class="notification-button">
            🔔
            <span v-if="notificationCount > 0" class="notification-badge">
              {{ notificationCount }}
            </span>
          </button>
        </div>
        
        <div class="user-menu">
          <div class="user-info">
            <span class="user-name">{{ currentUser.name }}</span>
            <span class="user-role">{{ currentUser.role }}</span>
          </div>
          <div class="user-avatar">
            <img :src="currentUser.avatar" :alt="currentUser.name" v-if="currentUser.avatar">
            <div v-else class="avatar-placeholder">
              {{ currentUser.name.charAt(0).toUpperCase() }}
            </div>
          </div>
          <div class="user-dropdown">
            <button @click="toggleUserMenu" class="dropdown-toggle">
              ▼
            </button>
            <div v-if="showUserMenu" class="dropdown-menu">
              <a href="#" @click="viewProfile">👤 Mi Perfil</a>
              <a href="#" @click="changePassword">🔒 Cambiar Contraseña</a>
              <a href="#" @click="settings">⚙️ Configuración</a>
              <hr>
              <a href="#" @click="logout">🚪 Cerrar Sesión</a>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Notificaciones dropdown -->
    <div v-if="showNotifications" class="notifications-dropdown">
      <div class="notifications-header">
        <h3>Notificaciones</h3>
        <button @click="markAllAsRead" class="mark-all-read">Marcar todas como leídas</button>
      </div>
      <div class="notifications-list">
        <div 
          v-for="notification in notifications" 
          :key="notification.id" 
          class="notification-item"
          :class="{ unread: !notification.read }"
        >
          <div class="notification-icon">
            {{ getNotificationIcon(notification.type) }}
          </div>
          <div class="notification-content">
            <h4>{{ notification.title }}</h4>
            <p>{{ notification.message }}</p>
            <span class="notification-time">{{ notification.time }}</span>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const showUserMenu = ref(false)
const showNotifications = ref(false)
const notificationCount = ref(3)
const pendingTickets = ref(5)
const securityAlerts = ref(2)

const currentUser = ref({
  name: 'Admin TI',
  role: 'Administrador',
  avatar: null
})

const notifications = ref([
  {
    id: 1,
    type: 'warning',
    title: 'Alerta de Seguridad',
    message: 'Se detectó un intento de acceso no autorizado',
    time: 'Hace 5 minutos',
    read: false
  },
  {
    id: 2,
    type: 'info',
    title: 'Respaldo Completado',
    message: 'El respaldo nocturno se completó exitosamente',
    time: 'Hace 2 horas',
    read: false
  },
  {
    id: 3,
    type: 'error',
    title: 'Servidor Desconectado',
    message: 'El servidor de base de datos está fuera de línea',
    time: 'Hace 1 hora',
    read: true
  }
])

const getNotificationIcon = (type) => {
  const icons = {
    'warning': '⚠️',
    'info': 'ℹ️',
    'error': '🚨',
    'success': '✅'
  }
  return icons[type] || '📢'
}

const performSearch = () => {
  console.log('Buscando:', searchQuery.value)
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
}

const markAllAsRead = () => {
  notifications.value.forEach(notification => {
    notification.read = true
  })
  notificationCount.value = 0
}

const viewProfile = () => {
  console.log('Ver perfil')
  showUserMenu.value = false
}

const changePassword = () => {
  console.log('Cambiar contraseña')
  showUserMenu.value = false
}

const settings = () => {
  console.log('Configuración')
  showUserMenu.value = false
}

const logout = () => {
  console.log('Cerrar sesión')
  showUserMenu.value = false
}

// Cerrar dropdowns al hacer click fuera
document.addEventListener('click', (e) => {
  if (!e.target.closest('.user-menu')) {
    showUserMenu.value = false
  }
  if (!e.target.closest('.notifications')) {
    showNotifications.value = false
  }
})
</script>

<style scoped>
.top-navigation {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 70px;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.nav-brand h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  justify-content: center;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  white-space: nowrap;
}

.nav-link:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.nav-link.active {
  background: rgba(255,255,255,0.2);
  color: white;
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.nav-badge {
  background: #e74c3c;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.nav-badge.alert {
  background: #f39c12;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.search-container {
  display: flex;
  background: rgba(255,255,255,0.1);
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.search-input {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.9rem;
  outline: none;
  width: 200px;
}

.search-input::placeholder {
  color: rgba(255,255,255,0.7);
}

.search-button {
  background: rgba(255,255,255,0.2);
  border: none;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  color: white;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.search-button:hover {
  background: rgba(255,255,255,0.3);
}

.notifications {
  position: relative;
}

.notification-button {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  position: relative;
  transition: transform 0.2s;
  color: white;
}

.notification-button:hover {
  transform: scale(1.1);
}

.notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: #e74c3c;
  color: white;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 0.2rem 0.4rem;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 500;
  color: white;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.8rem;
  color: rgba(255,255,255,0.7);
}

.user-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
}

.dropdown-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: rgba(255,255,255,0.7);
  font-size: 0.8rem;
  padding: 0.25rem;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
  margin-top: 0.5rem;
}

.dropdown-menu a {
  display: block;
  padding: 0.75rem 1rem;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-menu a:hover {
  background: #f8f9fa;
}

.dropdown-menu hr {
  margin: 0;
  border: none;
  border-top: 1px solid #ecf0f1;
}

.notifications-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 0.5rem;
}

.notifications-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #ecf0f1;
}

.notifications-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

.mark-all-read {
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  font-size: 0.8rem;
  text-decoration: underline;
}

.notifications-list {
  max-height: 300px;
  overflow-y: auto;
}

.notification-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f8f9fa;
  transition: background-color 0.2s;
}

.notification-item:hover {
  background: #f8f9fa;
}

.notification-item.unread {
  background: #f0f8ff;
  border-left: 3px solid #3498db;
}

.notification-icon {
  font-size: 1.2rem;
  margin-top: 0.25rem;
}

.notification-content {
  flex: 1;
}

.notification-content h4 {
  margin: 0 0 0.25rem 0;
  color: #2c3e50;
  font-size: 0.9rem;
}

.notification-content p {
  margin: 0 0 0.5rem 0;
  color: #7f8c8d;
  font-size: 0.8rem;
}

.notification-time {
  font-size: 0.7rem;
  color: #95a5a6;
}

@media (max-width: 1024px) {
  .nav-menu {
    gap: 0.25rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.75rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .search-input {
    width: 150px;
  }
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-brand h1 {
    font-size: 1.2rem;
  }
  
  .nav-menu {
    gap: 0.25rem;
  }
  
  .nav-link {
    padding: 0.5rem;
  }
  
  .nav-text {
    display: none;
  }
  
  .search-container {
    display: none;
  }
  
  .user-info {
    display: none;
  }
  
  .notifications-dropdown {
    width: 300px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 0.5rem;
  }
  
  .nav-brand h1 {
    font-size: 1rem;
  }
  
  .nav-menu {
    gap: 0.1rem;
  }
  
  .nav-link {
    padding: 0.4rem;
  }
  
  .nav-actions {
    gap: 0.5rem;
  }
}
</style>
