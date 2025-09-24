import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/pokemon',
      name: 'pokemon',
      component: () => import('../views/PokemonListView.vue'),
    },
    {
      path: '/pokemon/:id',
      name: 'pokemon-detail',
      component: () => import('../views/PokemonDetailView.vue'),
      props: true,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
    },
    {
      path: '/inventario',
      name: 'inventario',
      component: () => import('../views/InventarioView.vue'),
    },
    {
      path: '/tickets',
      name: 'tickets',
      component: () => import('../views/TicketsView.vue'),
    },
    {
      path: '/usuarios',
      name: 'usuarios',
      component: () => import('../views/UsuariosView.vue'),
    },
    {
      path: '/red',
      name: 'red',
      component: () => import('../views/RedView.vue'),
    },
    {
      path: '/seguridad',
      name: 'seguridad',
      component: () => import('../views/SeguridadView.vue'),
    },
    {
      path: '/backup',
      name: 'backup',
      component: () => import('../views/BackupView.vue'),
    },
  ],
})

export default router
