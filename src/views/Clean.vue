<template>
  <div class="clean-page">
    <div class="clean-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">🧹 文本清洗</span>
        </div>
        <div class="toolbar-actions">
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
          <button class="btn btn-success" @click="copyResult" :disabled="!output">📋 复制</button>
        </div>
      </div>

      <div class="options-card">
        <label class="options-title">🔧 清洗模式</label>
        <div class="options-grid">
          <button 
            v-for="opt in options" 
            :key="opt.value"
            :class="['option-btn', { active: mode === opt.value }]"
            @click="setMode(opt.value)"
          >
            <span class="option-icon">{{ opt.icon }}</span>
            <span class="option-label">{{ opt.label }}</span>
          </button>
        </div>
      </div>

      <div class="work-area">
        <div class="input-section">
          <label class="section-label">
            <span class="label-icon">📄</span>
            <span>原始文本</span>
            <span v-if="inputStats" class="stats">{{ inputStats }} 行</span>
          </label>
          <textarea 
            v-model="input" 
            @input="process"
            placeholder="粘贴需要清洗的文本... (Ctrl+Enter 清洗)"
            class="clean-input"
          ></textarea>
        </div>

        <div class="output-section">
          <label class="section-label">
            <span class="label-icon">✨</span>
            <span>清洗结果</span>
            <span v-if="outputStats" class="stats">{{ outputStats }} 行</span>
          </label>
          <textarea 
            v-model="output" 
            readonly
            placeholder="结果将显示在这里..."
            class="clean-output"
          ></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const input = ref('')
const output = ref('')
const mode = ref('spaces')

const options = [
  { value: 'spaces', label: '删除空格', icon: '␣' },
  { value: 'emptyLines', label: '删除空行', icon: '¶' },
  { value: 'html', label: '移除 HTML', icon: '<>' },
  { value: 'special', label: '移除特殊字符', icon: '#' },
  { value: 'trim', label: '去除首尾空格', icon: '✂️' },
  { value: 'all', label: '综合清洗', icon: '🧽' },
  { value: 'novel', label: '小说格式', icon: '📖' }
]

const inputStats = computed(() => {
  if (!input.value.trim()) return 0
  return input.value.split('\n').filter(line => line.trim()).length
})

const outputStats = computed(() => {
  if (!output.value.trim()) return 0
  return output.value.split('\n').filter(line => line.trim()).length
})

function setMode(newMode) {
  mode.value = newMode
  process()
  saveToStorage()
}

function process() {
  if (!input.value.trim()) {
    output.value = ''
    saveToStorage()
    return
  }

  let result = input.value
  
  switch (mode.value) {
    case 'spaces':
      result = input.value.replace(/\s+/g, '')
      break
    case 'emptyLines':
      result = input.value.replace(/\n\s*\n/g, '\n').replace(/^\s*\n/gm, '')
      break
    case 'html':
      result = input.value.replace(/<[^>]*>/g, '')
      break
    case 'special':
      result = input.value.replace(/[^\u4e00-\u9fa5a-zA-Z0-9，。！？、；：""''（）【】《》…—\s\n]/g, '')
      break
    case 'trim':
      result = input.value.split('\n').map(line => line.trim()).join('\n')
      break
    case 'all':
      result = input.value.replace(/<[^>]*>/g, '')
      result = result.replace(/[ \t]+/g, ' ')
      result = result.replace(/^\s*/gm, '')
      result = result.replace(/\s*$/gm, '')
      result = result.replace(/\n\s*\n/g, '\n')
      result = result.replace(/^\s*\n/gm, '')
      break
    case 'novel':
      result = input.value.replace(/<[^>]*>/g, '')
      result = result.replace(/^\s*/gm, '')
      result = result.replace(/\s*$/gm, '')
      result = result.replace(/[ \t]+/g, ' ')
      result = result.replace(/\n{3,}/g, '\n\n')
      result = result.replace(/^\s*\n/gm, '')
      break
  }
  
  output.value = result
  saveToStorage()
}

function saveToStorage() {
  localStorage.setItem('moment_clean_input', input.value)
  localStorage.setItem('moment_clean_option', mode.value)
}

function loadFromStorage() {
  const savedInput = localStorage.getItem('moment_clean_input')
  if (savedInput) input.value = savedInput
  
  const savedMode = localStorage.getItem('moment_clean_option')
  if (savedMode) mode.value = savedMode
}

function clear() {
  if (confirm('确定要清空所有内容吗？')) {
    input.value = ''
    output.value = ''
    localStorage.removeItem('moment_clean_input')
    localStorage.removeItem('moment_clean_option')
  }
}

function copyResult() {
  if (output.value.trim()) {
    navigator.clipboard.writeText(output.value)
  }
}

function handleKeydown(e) {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault()
    process()
  }
  if (e.ctrlKey && e.key === 'd') {
    e.preventDefault()
    clear()
  }
  if (e.ctrlKey && e.key === 'c' && document.activeElement.tagName !== 'TEXTAREA') {
    e.preventDefault()
    copyResult()
  }
}

onMounted(() => {
  loadFromStorage()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.clean-page {
  padding: 32px 32px 32px 40px;
  background: var(--bg-light);
  animation: slideUp 0.4s ease-out;
}

.clean-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.options-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

.options-title {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.option-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: 1px solid var(--border-light);
  background: var(--bg-white);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.option-btn:hover {
  border-color: var(--brand-primary);
  background: var(--bg-subtle);
  color: var(--brand-primary);
}

.option-btn.active {
  background: var(--brand-primary);
  border-color: var(--brand-primary);
  color: #fff;
}

.option-icon {
  font-size: 16px;
}

.work-area {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  width: 100%;
}

.input-section,
.output-section {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
  min-width: 0;
  max-width: 100%;
}

.section-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.label-icon {
  font-size: 16px;
}

.section-label .stats {
  margin-left: auto;
  font-weight: 500;
  font-size: 12px;
  background: var(--bg-subtle);
  color: var(--text-secondary);
  padding: 3px 8px;
  border-radius: 10px;
}

.clean-input,
.clean-output {
  width: 100%;
  height: 350px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 14px;
  font-size: 13px;
  line-height: 1.8;
  resize: vertical;
  font-family: var(--font-mono);
  box-sizing: border-box;
  background: var(--bg-white);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.clean-input:focus,
.clean-output:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1);
}

.clean-output {
  background: var(--bg-subtle);
}

@media (max-width: 767px) {
  .clean-page {
    padding: 80px 16px 16px;
  }
  
  .work-area {
    grid-template-columns: 1fr;
  }
}
</style>
