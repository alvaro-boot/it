# Sistema de Gestión de Tecnología de la Información (TI)

## Descripción

Este es un sistema completo de gestión de TI desarrollado con Vue 3 que permite administrar todos los aspectos de tecnología de la información en una empresa. El sistema incluye funcionalidades para gestión de inventario, tickets de soporte, usuarios, red, seguridad y respaldos.

## Características Principales

### 🏠 Dashboard
- Vista general del estado del sistema
- Métricas en tiempo real
- Alertas y notificaciones
- Acceso rápido a funciones principales

### 💻 Gestión de Inventario
- Registro de equipos y dispositivos
- Seguimiento de estado y ubicación
- Historial de mantenimiento
- Categorización por tipo de equipo

### 🎫 Sistema de Tickets
- Creación y seguimiento de tickets
- Gestión de prioridades y categorías
- Asignación de técnicos
- Historial completo de incidencias

### 👥 Gestión de Usuarios
- Administración de cuentas de usuario
- Control de permisos y roles
- Gestión de departamentos
- Seguimiento de actividad

### 🌐 Gestión de Red
- Monitoreo de dispositivos de red
- Estado de conectividad
- Configuración de firewall y VPN
- Análisis de ancho de banda

### 🛡️ Seguridad Informática
- Monitoreo de alertas de seguridad
- Gestión de políticas de seguridad
- Logs de auditoría
- Control de acceso

### 💾 Gestión de Respaldos
- Programación de respaldos automáticos
- Monitoreo de estado de respaldos
- Configuración de ubicaciones
- Restauración de datos

## Tecnologías Utilizadas

- **Vue 3** - Framework de JavaScript
- **Vue Router** - Enrutamiento
- **Pinia** - Gestión de estado
- **Vite** - Herramienta de construcción
- **CSS3** - Estilos y diseño responsivo

## Estructura del Proyecto

```
IT/
├── src/
│   ├── components/
│   │   ├── ITNavigation.vue    # Navegación lateral
│   │   └── ITHeader.vue        # Encabezado principal
│   ├── views/
│   │   ├── HomeView.vue        # Página de inicio
│   │   ├── DashboardView.vue   # Dashboard principal
│   │   ├── InventarioView.vue  # Gestión de inventario
│   │   ├── TicketsView.vue     # Sistema de tickets
│   │   ├── UsuariosView.vue    # Gestión de usuarios
│   │   ├── RedView.vue         # Gestión de red
│   │   ├── SeguridadView.vue   # Seguridad informática
│   │   └── BackupView.vue      # Gestión de respaldos
│   ├── router/
│   │   └── index.js            # Configuración de rutas
│   └── App.vue                 # Componente principal
├── package.json
└── README.md
```

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 20.19.0 o superior)
- npm

### Pasos de Instalación

1. **Clonar o navegar al directorio del proyecto:**
   ```bash
   cd IT
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo desarrollo:**
   ```bash
   npm run dev
   ```

4. **Construir para producción:**
   ```bash
   npm run build
   ```

## Uso del Sistema

### Navegación
- **Sidebar**: Navegación principal con acceso a todas las secciones
- **Header**: Búsqueda global, notificaciones y perfil de usuario
- **Breadcrumbs**: Navegación contextual

### Funcionalidades por Módulo

#### Dashboard
- Visualización de métricas clave
- Estado del sistema en tiempo real
- Acceso rápido a funciones principales

#### Inventario
- Agregar nuevos equipos
- Filtrar por categoría, estado o ubicación
- Editar información de equipos
- Ver historial de mantenimiento

#### Tickets
- Crear nuevos tickets de soporte
- Asignar prioridades y categorías
- Seguimiento del estado de resolución
- Comunicación con usuarios

#### Usuarios
- Crear y gestionar cuentas
- Asignar roles y permisos
- Control de acceso por departamento
- Reset de contraseñas

#### Red
- Monitoreo de dispositivos conectados
- Configuración de firewall
- Gestión de VPN
- Análisis de tráfico

#### Seguridad
- Monitoreo de alertas
- Gestión de políticas
- Logs de auditoría
- Escaneos de seguridad

#### Respaldos
- Programación automática
- Monitoreo de estado
- Configuración de ubicaciones
- Restauración de datos

## Personalización

### Colores y Temas
El sistema utiliza una paleta de colores consistente definida en los estilos globales:
- **Primario**: #3498db (Azul)
- **Éxito**: #27ae60 (Verde)
- **Advertencia**: #f39c12 (Naranja)
- **Peligro**: #e74c3c (Rojo)
- **Gris**: #7f8c8d

### Responsive Design
El sistema está optimizado para:
- **Desktop**: Experiencia completa con sidebar
- **Tablet**: Navegación adaptada
- **Mobile**: Interfaz simplificada

## Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature
3. Realizar los cambios
4. Crear un Pull Request

## Licencia

Este proyecto está bajo la licencia MIT.

## Soporte

Para soporte técnico o consultas sobre el sistema, contactar al equipo de desarrollo.

---

**Desarrollado con ❤️ para la gestión eficiente de TI**