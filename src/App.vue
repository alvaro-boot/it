<script setup>
import { RouterView } from 'vue-router'
import TopNavigation from './components/TopNavigation.vue'
</script>

<template>
  <div class="app">
    <TopNavigation />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f8f9fa;
  color: #2c3e50;
  overflow-x: hidden;
  word-wrap: break-word;
  hyphens: auto;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  padding-top: 70px;
  min-height: calc(100vh - 70px);
  overflow-x: hidden;
  width: 100%;
}

/* Estilos globales para componentes */
.btn-primary, .btn-secondary, .btn-success, .btn-warning, .btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #3498db;
  color: white;
}

.btn-primary:hover {
  background: #2980b9;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #ecf0f1;
  color: #2c3e50;
}

.btn-secondary:hover {
  background: #d5dbdb;
  transform: translateY(-1px);
}

.btn-success {
  background: #27ae60;
  color: white;
}

.btn-success:hover {
  background: #229954;
  transform: translateY(-1px);
}

.btn-warning {
  background: #f39c12;
  color: white;
}

.btn-warning:hover {
  background: #e67e22;
  transform: translateY(-1px);
}

.btn-danger {
  background: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background: #c0392b;
  transform: translateY(-1px);
}

/* Estilos para formularios */
.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #2c3e50;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/* Estilos para tarjetas */
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.card-header {
  border-bottom: 1px solid #ecf0f1;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

.card-title {
  margin: 0;
  color: #2c3e50;
  font-size: 1.2rem;
  font-weight: 600;
}

/* Estilos para tablas */
.table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.table th,
.table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #ecf0f1;
}

.table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #2c3e50;
}

.table tr:hover {
  background: #f8f9fa;
}

/* Estilos para badges */
.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
  text-transform: uppercase;
}

.badge-success {
  background: #d5f4e6;
  color: #27ae60;
}

.badge-warning {
  background: #fef5e7;
  color: #f39c12;
}

.badge-danger {
  background: #fadbd8;
  color: #e74c3c;
}

.badge-info {
  background: #e3f2fd;
  color: #1976d2;
}

/* Responsive */
@media (max-width: 768px) {
  .content {
    padding: 1rem;
  }
  
  .btn-primary, .btn-secondary, .btn-success, .btn-warning, .btn-danger {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
