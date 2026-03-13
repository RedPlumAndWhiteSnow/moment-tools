<template>
  <button class="theme-toggle" @click="toggleTheme" :title="`切换到${isDark ? '浅色' : '暗色'}模式`">
    <Transition name="flip" mode="out-in">
      <span v-if="isDark" class="theme-icon" key="sun">🌙</span>
      <span v-else class="theme-icon" key="moon">☀️</span>
    </Transition>
  </button>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'moment_theme_preference'
const isDark = ref(false)

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

function getStoredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? stored === 'dark' : null
}

function setTheme(dark) {
  localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
}

function applyTheme(dark) {
  if (dark) {
    document.body.classList.add('dark-theme')
  } else {
    document.body.classList.remove('dark-theme')
  }
  isDark.value = dark
}

function toggleTheme() {
  const newTheme = !isDark.value
  applyTheme(newTheme)
  setTheme(newTheme)
  console.log('[Theme] Switched to', newTheme ? 'dark' : 'light', 'mode')
}

onMounted(() => {
  const stored = getStoredTheme()
  applyTheme(stored !== null ? stored : getSystemTheme())
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const handler = (e) => {
    if (getStoredTheme() === null) {
      applyTheme(e.matches)
    }
  }
  
  mediaQuery.addEventListener('change', handler)
  
  return () => {
    mediaQuery.removeEventListener('change', handler)
  }
})
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  width: 48px;
  height: 48px;
  border: none;
  background: var(--bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 997;
  padding: 0;
}

.theme-toggle:hover {
  background: var(--bg-subtle);
  transform: scale(1.05);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.03);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.theme-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.flip-enter-active,
.flip-leave-active {
  transition: all 0.3s ease;
}

.flip-enter-from {
  opacity: 0;
  transform: rotateY(-90deg);
}

.flip-leave-to {
  opacity: 0;
  transform: rotateY(90deg);
}

@media (max-width: 767px) {
  .theme-toggle {
    top: auto;
    bottom: 16px;
    right: 16px;
    width: 52px;
    height: 52px;
    font-size: 26px;
  }
}
</style>
