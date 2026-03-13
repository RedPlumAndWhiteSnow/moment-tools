<template>
  <aside :class="['sidebar', { open: mobileOpen }]">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-brand">
          <div class="logo-icon-wrapper">
            <img src="/favicon.svg" alt="片刻 Logo" class="logo-icon">
          </div>
          <div class="logo-text-wrapper">
            <span class="logo-text">片刻</span>
            <span class="logo-subtext">MOMENT</span>
          </div>
        </div>
      </div>
      <button class="close-btn" @click="$emit('close')" aria-label="关闭菜单">
        ✕
      </button>
    </div>

    <nav class="nav">
      <a href="#" :class="{ active: current === 'home' }" @click.prevent="$emit('change', 'home')">
        <span class="nav-icon">🏠</span>
        <span class="nav-text">首页</span>
      </a>

      <div class="nav-section">
        <div class="nav-title">文本工具</div>
        <a href="#" :class="{ active: current === 'dedup' }" @click.prevent="$emit('change', 'dedup')">
          <span class="nav-icon">📝</span>
          <span class="nav-text">去重</span>
        </a>
        <a href="#" :class="{ active: current === 'replace' }" @click.prevent="$emit('change', 'replace')">
          <span class="nav-icon">🔄</span>
          <span class="nav-text">替换</span>
        </a>
        <a href="#" :class="{ active: current === 'diff' }" @click.prevent="$emit('change', 'diff')">
          <span class="nav-icon">🔍</span>
          <span class="nav-text">比对</span>
        </a>
        <a href="#" :class="{ active: current === 'clean' }" @click.prevent="$emit('change', 'clean')">
          <span class="nav-icon">🧹</span>
          <span class="nav-text">清洗</span>
        </a>
        <a href="#" :class="{ active: current === 'merge' }" @click.prevent="$emit('change', 'merge')">
          <span class="nav-icon">🔗</span>
          <span class="nav-text">合并</span>
        </a>
        <a href="#" :class="{ active: current === 'calc' }" @click.prevent="$emit('change', 'calc')">
          <span class="nav-icon">🧮</span>
          <span class="nav-text">计算</span>
        </a>
        <a href="#" :class="{ active: current === 'addchar' }" @click.prevent="$emit('change', 'addchar')">
          <span class="nav-icon">📎</span>
          <span class="nav-text">首尾字符</span>
        </a>
        <a href="#" :class="{ active: current === 'case' }" @click.prevent="$emit('change', 'case')">
          <span class="nav-icon">🔤</span>
          <span class="nav-text">转换</span>
        </a>
      </div>

      <div class="nav-section">
        <div class="nav-title">开发工具</div>
        <a href="#" :class="{ active: current === 'encode' }" @click.prevent="$emit('change', 'encode')">
          <span class="nav-icon">🔐</span>
          <span class="nav-text">编解码</span>
        </a>
        <a href="#" :class="{ active: current === 'json' }" @click.prevent="$emit('change', 'json')">
          <span class="nav-icon">{ }</span>
          <span class="nav-text">JSON</span>
        </a>
      </div>

      <div class="nav-section">
        <div class="nav-title">其他</div>
        <a href="#" :class="{ active: current === 'support' }" @click.prevent="$emit('change', 'support')">
          <span class="nav-icon">❤️</span>
          <span class="nav-text">支持我们</span>
        </a>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div class="version-info">v1.0.0</div>
    </div>

    <div v-if="mobileOpen" class="sidebar-overlay" @click="$emit('close')"></div>
  </aside>
</template>

<script setup>
defineProps({
  current: {
    type: String,
    required: true
  },
  mobileOpen: {
    type: Boolean,
    default: false
  }
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
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-overflow-scrolling: touch;
}

@media (min-width: 768px) {
  .sidebar {
    transform: translate(0) !important;
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  flex: 1;
}

.logo-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.14);
  border-radius: 10px;
  padding: 6px;
}

.logo-icon {
  width: 100%;
  height: 100%;
}

.logo-text-wrapper {
  display: flex;
  flex-direction: column;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.logo-subtext {
  font-size: 9px;
  color: rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-top: 3px;
}

.close-btn {
  display: none;
  width: 44px;
  height: 44px;
  border: none;
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.19);
}

.close-btn:active {
  background: rgba(255, 255, 255, 0.25);
}

.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

.sidebar {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05);
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
  text-transform: uppercase;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.38);
  padding: 12px 24px 8px;
  font-weight: 600;
}

.nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 24px;
  margin: 2px 12px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  min-height: 44px;
  -webkit-tap-highlight-color: transparent;
}

.nav a:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
}

.nav a:active {
  background: rgba(255, 255, 255, 0.12);
}

.nav a.active {
  background: var(--brand-primary);
  color: #fff;
}

.nav-icon {
  width: 20px;
  text-align: center;
  font-size: 16px;
}

.sidebar-footer {
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
}

.version-info {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.38);
  text-align: center;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.sidebar-overlay.show {
  opacity: 1;
  pointer-events: auto;
}

@media (min-width: 768px) {
  .sidebar {
    transform: translate(0) !important;
  }
  
  .close-btn,
  .sidebar-overlay {
    display: none !important;
  }
}

@media (max-width: 767px) {
  .sidebar {
    transform: translate(-100%);
    width: 280px;
  }
  
  .sidebar.open {
    transform: translate(0);
  }
  
  .close-btn {
    display: flex;
  }
  
  .sidebar-overlay {
    display: block;
  }
  
  .nav a {
    padding: 14px 24px;
    margin: 2px 12px;
    font-size: 15px;
    min-height: 48px;
  }
  
  .nav-icon {
    font-size: 18px;
  }
  
  .logo {
    padding: 20px;
  }
  
  .logo-text {
    font-size: 18px;
  }
}

/* 安全区域适配（iPhone X+）*/
@supports (padding: max(0px)) {
  .sidebar {
    padding-top: env(safe-area-inset-top);
  }
  
  .logo {
    padding-top: max(24px, env(safe-area-inset-top));
  }
  
  .menu-toggle {
    left: max(16px, env(safe-area-inset-left));
  }
}
</style>
