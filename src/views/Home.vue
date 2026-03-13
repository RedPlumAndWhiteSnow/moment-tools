<template>
  <div class="home">
    <header class="home-header">
      <h1 class="home-title">片刻工具箱</h1>
      <p class="home-subtitle">在线数据处理工具 · 片刻之间 · 轻松搞定</p>
      
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索工具..." 
          class="search-input"
          @input="filterTools"
        />
        <span class="search-icon">🔍</span>
      </div>
    </header>

    <section class="tools-section">
      <h2 class="section-title">🔥 常用工具</h2>
      <div class="tools-grid">
        <div 
          v-for="tool in filteredTools.slice(0, 6)" 
          :key="tool.id"
          class="tool-card"
          @click="$emit('select', tool.id)"
          tabindex="0"
          @keydown.enter="$emit('select', tool.id)"
        >
          <div class="tool-icon">{{ tool.icon }}</div>
          <h3 class="tool-name">{{ tool.name }}</h3>
          <p class="tool-desc">{{ tool.description }}</p>
        </div>
      </div>
    </section>

    <section class="tools-section">
      <h2 class="section-title">📦 全部工具</h2>
      <div class="tools-grid">
        <div 
          v-for="tool in filteredTools" 
          :key="tool.id"
          class="tool-card"
          @click="$emit('select', tool.id)"
          tabindex="0"
          @keydown.enter="$emit('select', tool.id)"
        >
          <div class="tool-icon">{{ tool.icon }}</div>
          <h3 class="tool-name">{{ tool.name }}</h3>
          <p class="tool-desc">{{ tool.description }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')

const tools = [
  { id: 'dedup', name: '文本去重', icon: '📝', description: '去除重复行，保留唯一值', category: 'text' },
  { id: 'replace', name: '批量替换', icon: '🔄', description: '多规则批量替换文本', category: 'text' },
  { id: 'diff', name: '文本比对', icon: '🔍', description: '对比两个文本的差异', category: 'text' },
  { id: 'clean', name: '文本清洗', icon: '🧹', description: '清理多余空格和特殊字符', category: 'text' },
  { id: 'merge', name: '文本合并', icon: '🔗', description: '合并多个文本文件', category: 'text' },
  { id: 'calc', name: '在线计算', icon: '🧮', description: '表达式计算工具', category: 'calc' },
  { id: 'addchar', name: '首尾字符', icon: '📎', description: '批量添加首尾字符', category: 'text' },
  { id: 'case', name: '大小写转换', icon: '🔤', description: '文本大小写互转', category: 'text' },
  { id: 'encode', name: '编解码', icon: '🔐', description: 'URL/Base64 编解码', category: 'dev' },
  { id: 'json', name: 'JSON 格式化', icon: '{ }', description: 'JSON 校验格式化', category: 'dev' }
]

const filteredTools = computed(() => {
  if (!searchQuery.value.trim()) {
    return tools
  }
  const query = searchQuery.value.toLowerCase()
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(query) || 
    tool.description.toLowerCase().includes(query)
  )
})

function filterTools() {
  // 搜索逻辑已在 computed 中处理
}
</script>

<style scoped>
.home {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: 48px;
  padding: 40px 24px;
  background: var(--brand-gradient);
  border-radius: var(--radius-xl);
  color: #fff;
  box-shadow: var(--shadow-lg);
}

.home-title {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 12px;
  letter-spacing: 2px;
}

.home-subtitle {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 32px;
}

.search-box {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input {
  width: 100%;
  padding: 14px 48px 14px 20px;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 15px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

.search-icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 18px;
  opacity: 0.6;
}

.tools-section {
  margin-bottom: 48px;
}

.section-title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 24px;
  color: var(--text-primary);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.tool-card {
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  padding: 24px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-sm);
}

.tool-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--brand-primary);
}

.tool-card:focus {
  outline: 2px solid var(--brand-primary);
  outline-offset: 2px;
}

.tool-icon {
  font-size: 36px;
  margin-bottom: 16px;
}

.tool-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.tool-desc {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
}

@media (max-width: 767px) {
  .home {
    padding: 16px;
  }
  
  .home-header {
    padding: 24px 16px;
  }
  
  .home-title {
    font-size: 28px;
  }
  
  .home-subtitle {
    font-size: 14px;
  }
  
  .tools-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }
  
  .tool-card {
    padding: 20px;
  }
}
</style>
