import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import singleSpaVue from 'single-spa-vue'

import App from './App.vue'
import router from './router'

function setupRouterSync(r) {
  const safePost = (path) => {
    try {
      if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
        if (typeof path === 'string' && path.startsWith('/pokemon')) {
          window.parent.postMessage({ type: 'navigate', module: 'it', path }, '*')
        }
      }
    } catch (e) {}
  }

  try {
    r.afterEach((to) => safePost(to.fullPath))
    if (typeof window !== 'undefined') {
      r.isReady().then(() => {
        const current = r.currentRoute.value?.fullPath || '/'
        safePost(current)
      })
    }
  } catch (e) {}
}

// Configuración de Single SPA para IT
const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return createApp(App).use(createPinia()).use(router).mount(this.el)
    }
  },
  handleInstance(app, props) {
    app.use(createPinia())
    app.use(router)
    setupRouterSync(router)
  }
})

// Exportar las funciones de ciclo de vida de Single SPA
export const { bootstrap, mount, unmount } = vueLifecycles

// Para desarrollo independiente y producción
const app = createApp(App)
app.use(createPinia())
app.use(router)
setupRouterSync(router)
app.mount('#app')
