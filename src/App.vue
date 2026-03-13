<template>
  <div class="app">
    <!-- 侧边栏 -->
    <Sidebar 
      :current="currentTool" 
      :mobileOpen="mobileMenuOpen"
      @change="selectTool"
      @close="mobileMenuOpen = false"
    />
    
    <!-- 主内容区 -->
    <main class="main">
      <!-- 移动端菜单按钮 -->
      <button class="menu-toggle" @click="mobileMenuOpen = true" aria-label="打开菜单">
        ☰
      </button>
      
      <!-- 主题切换 -->
      <ThemeToggle />
      
      <!-- 工具内容 -->
      <component :is="currentComponent" @select="selectTool" />
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import Sidebar from './components/Sidebar.vue'
import ThemeToggle from './components/ThemeToggle.vue'

// 导入所有工具视图
import Home from './views/Home.vue'
import Dedup from './views/Dedup.vue'
import Replace from './views/Replace.vue'
import Diff from './views/Diff.vue'
import Clean from './views/Clean.vue'
import Merge from './views/Merge.vue'
import Calc from './views/Calc.vue'
import AddChar from './views/AddChar.vue'
import Case from './views/Case.vue'
import Encode from './views/Encode.vue'
import JsonTool from './views/JsonTool.vue'
import Support from './views/Support.vue'

// 当前工具
const currentTool = ref('home')
const mobileMenuOpen = ref(false)

// 工具组件映射
const toolComponents = {
  home: Home,
  dedup: Dedup,
  replace: Replace,
  diff: Diff,
  clean: Clean,
  merge: Merge,
  calc: Calc,
  addchar: AddChar,
  case: Case,
  encode: Encode,
  json: JsonTool,
  support: Support
}

// 当前组件
const currentComponent = computed(() => {
  return toolComponents[currentTool.value] || Home
})

// 切换工具
function selectTool(tool) {
  currentTool.value = tool
  if (window.innerWidth < 768) {
    mobileMenuOpen.value = false
  }
}
</script>

<style scoped>
.app {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.main {
  flex: 1;
  margin-left: var(--sidebar-width, 260px);
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  width: calc(100% - var(--sidebar-width, 260px));
  min-width: 0;
  -webkit-overflow-scrolling: touch;
}

.menu-toggle {
  display: none;
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 998;
  width: 48px;
  height: 48px;
  border: none;
  background: var(--bg-white);
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  font-size: 24px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}

.menu-toggle:hover {
  background: var(--bg-subtle);
  transform: scale(1.05);
}

.menu-toggle:active {
  transform: scale(0.95);
}

@media (max-width: 767px) {
  .main {
    margin-left: 0 !important;
    width: 100% !important;
    overflow-x: hidden;
  }
  
  .menu-toggle {
    display: flex;
  }
}

/* 安全区域适配 */
@supports (padding: max(0px)) {
  .menu-toggle {
    top: max(16px, env(safe-area-inset-top));
    left: max(16px, env(safe-area-inset-left));
  }
  
  .main {
    padding-bottom: env(safe-area-inset-bottom);
  }
}
</style>
