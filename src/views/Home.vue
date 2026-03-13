<template>
  <div class="home">
    <!-- 头部 -->
    <header class="home-header">
      <h1 class="home-title">片刻工具箱</h1>
      <p class="home-subtitle">在线数据处理工具 · 片刻之间 · 轻松搞定</p>
      
      <!-- 搜索框 -->
      <div class="search-box">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索工具..." 
          class="search-input"
        />
        <span class="search-icon">🔍</span>
      </div>
    </header>

    <!-- 常用工具 -->
    <section class="tools-section">
      <h2 class="section-title">🔥 常用工具</h2>
      <div class="tools-grid">
        <div 
          v-for="tool in filteredTools.slice(0, 6)" 
          :key="tool.id"
          class="tool-card"
          @click="$emit('select', tool.id)"
        >
          <div class="tool-icon">{{ tool.icon }}</div>
          <h3 class="tool-name">{{ tool.name }}</h3>
          <p class="tool-desc">{{ tool.description }}</p>
        </div>
      </div>
    </section>

    <!-- 全部工具 -->
    <section class="tools-section">
      <h2 class="section-title">📦 全部工具</h2>
      <div class="tools-grid">
        <div 
          v-for="tool in filteredTools" 
          :key="tool.id"
          class="tool-card"
          @click="$emit('select', tool.id)"
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
  { id: 'dedup', name: '文本去重', icon: '📝', description: '去除重复行，保留唯一值' },
  { id: 'replace', name: '批量替换', icon: '🔄', description: '多规则批量替换文本' },
  { id: 'diff', name: '文本比对', icon: '🔍', description: '对比两个文本的差异' },
  { id: 'clean', name: '文本清洗', icon: '🧹', description: '清理多余空格和特殊字符' },
  { id: 'merge', name: '文本合并', icon: '🔗', description: '合并多个文本文件' },
  { id: 'calc', name: '在线计算', icon: '🧮', description: '表达式计算工具' },
  { id: 'addchar', name: '首尾字符', icon: '📎', description: '批量添加首尾字符' },
  { id: 'case', name: '大小写转换', icon: '🔤', description: '文本大小写互转' },
  { id: 'encode', name: '编解码', icon: '🔐', description: 'URL/Base64 编解码' },
  { id: 'json', name: 'JSON 格式化', icon: '{ }', description: 'JSON 校验格式化' }
]

const filteredTools = computed(() => {
  if (!searchQuery.value.trim()) return tools
  const query = searchQuery.value.toLowerCase()
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(query) || 
    tool.description.toLowerCase().includes(query)
  )
})
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

.tool-icon {
  font-size: 36px;
  margin-bottom: 16px;
}

.tool-name {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
}

.tool-desc {
  font-size: 14px;
  color: var(--text-secondary);
}

@media (max-width: 767px) {
  .home {
    padding: 12px;
  }
  
  .home-header {
    padding: 24px 16px;
    margin-bottom: 24px;
  }
  
  .home-title {
    font-size: 24px;
  }
  
  .home-subtitle {
    font-size: 13px;
  }
  
  .tools-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
