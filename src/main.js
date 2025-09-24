import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import singleSpaVue from 'single-spa-vue'

import App from './App.vue'
import router from './router'

function setupRouterSync(r) {
  try {
    r.afterEach((to) => {
      try {
        if (typeof window !== 'undefined' && window.parent) {
          window.parent.postMessage({ type: 'navigate', module: 'it', path: to.fullPath }, '*')
        }
      } catch (e) {
        // noop
      }
    })
  } catch (e) {
    // noop
  }
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
