<template>
  <button class="theme-toggle" @click="toggleTheme" aria-label="切换主题">
    🌙
  </button>
</template>

<script setup>
function toggleTheme() {
  const html = document.documentElement
  const isDark = html.style.colorScheme === 'dark'
  html.style.colorScheme = isDark ? 'light' : 'dark'
  localStorage.setItem('theme', isDark ? 'light' : 'dark')
}

// 初始化主题
const savedTheme = localStorage.getItem('theme')
if (savedTheme) {
  document.documentElement.style.colorScheme = savedTheme
}
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  top: 16px;
  right: 16px;
  z-index: 999;
  width: 48px;
  height: 48px;
  border: none;
  background: var(--bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  font-size: 20px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  transform: scale(1.05);
}

@media (max-width: 767px) {
  .theme-toggle {
    top: 16px;
    right: 76px;
  }
}
</style>
