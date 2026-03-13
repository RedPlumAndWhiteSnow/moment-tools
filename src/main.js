import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

// 创建 Vue 应用
const app = createApp(App)

// 挂载应用
app.mount('#app')

// PWA Service Worker 注册
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[PWA] SW registered:', reg.scope))
      .catch(err => console.error('[PWA] SW registration failed:', err))
  })
}
