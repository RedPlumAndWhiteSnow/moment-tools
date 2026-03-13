<template>
  <aside :class="['sidebar', { open: mobileOpen }]">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-text">片刻</span>
        <span class="logo-subtext">MOMENT</span>
      </div>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <nav class="nav">
      <a href="#" :class="{ active: current === 'home' }" @click.prevent="$emit('change', 'home')">🏠 首页</a>
      
      <div class="nav-section">
        <div class="nav-title">文本工具</div>
        <a href="#" :class="{ active: current === 'dedup' }" @click.prevent="$emit('change', 'dedup')">📝 去重</a>
        <a href="#" :class="{ active: current === 'replace' }" @click.prevent="$emit('change', 'replace')">🔄 替换</a>
        <a href="#" :class="{ active: current === 'diff' }" @click.prevent="$emit('change', 'diff')">🔍 比对</a>
        <a href="#" :class="{ active: current === 'clean' }" @click.prevent="$emit('change', 'clean')">🧹 清洗</a>
        <a href="#" :class="{ active: current === 'merge' }" @click.prevent="$emit('change', 'merge')">🔗 合并</a>
      </div>
      
      <div class="nav-section">
        <div class="nav-title">开发工具</div>
        <a href="#" :class="{ active: current === 'encode' }" @click.prevent="$emit('change', 'encode')">🔐 编解码</a>
        <a href="#" :class="{ active: current === 'json' }" @click.prevent="$emit('change', 'json')">{ } JSON</a>
      </div>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  current: String,
  mobileOpen: Boolean
})
defineEmits(['change', 'close'])
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width, 260px);
  background: var(--bg-dark);
  color: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  z-index: 1000;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  display: block;
}

.logo-subtext {
  font-size: 9px;
  opacity: 0.5;
  letter-spacing: 2px;
}

.close-btn {
  display: none;
  position: absolute;
  right: 16px;
  top: 16px;
  background: none;
  border: none;
  color: #fff;
  font-size: 24px;
  cursor: pointer;
}

.nav {
  flex: 1;
  padding: 16px 0;
}

.nav-section {
  margin-bottom: 12px;
}

.nav-title {
  font-size: 11px;
  opacity: 0.38;
  padding: 12px 24px 8px;
  text-transform: uppercase;
}

.nav a {
  display: block;
  padding: 12px 24px;
  margin: 2px 12px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: all 0.2s ease;
}

.nav a:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.nav a.active {
  background: var(--brand-primary);
  color: #fff;
}

@media (max-width: 767px) {
  .sidebar {
    transform: translateX(-100%);
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
  
  .close-btn {
    display: block;
  }
}
</style>
