<template>
  <div class="replace-page">
    <div class="replace-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">🔄 文本替换</span>
        </div>
        <div class="toolbar-actions">
          <label class="checkbox-label">
            <input type="checkbox" v-model="useRegex">
            <span>正则表达式</span>
          </label>
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
          <button class="btn btn-success" @click="copyResult" :disabled="!output || output.startsWith('❌')">📋 复制</button>
        </div>
      </div>

      <div class="options-card">
        <div class="option-group">
          <label class="option-label">查找</label>
          <input 
            v-model="searchText" 
            placeholder="输入要查找的内容"
            class="option-input"
          >
        </div>
        <div class="option-group">
          <label class="option-label">替换为</label>
          <input 
            v-model="replaceText" 
            placeholder="输入替换的内容"
            class="option-input"
          >
        </div>
        <button class="btn btn-primary" @click="process">✨ 开始替换</button>
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
            placeholder="粘贴需要处理的文本... (Ctrl+Enter 替换)"
            class="replace-input"
          ></textarea>
        </div>

        <div class="output-section">
          <label class="section-label">
            <span class="label-icon">✨</span>
            <span>替换结果</span>
            <span v-if="outputStats" class="stats">{{ outputStats }} 行</span>
          </label>
          <textarea 
            v-model="output" 
            readonly
            placeholder="结果将显示在这里..."
            class="replace-output"
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
const searchText = ref('')
const replaceText = ref('')
const useRegex = ref(false)

const inputStats = computed(() => {
  if (!input.value.trim()) return 0
  return input.value.split('\n').filter(line => line.trim()).length
})

const outputStats = computed(() => {
  if (!output.value.trim()) return 0
  return output.value.split('\n').filter(line => line.trim()).length
})

function process() {
  if (!input.value.trim() || !searchText.value) {
    output.value = ''
    saveToStorage()
    return
  }

  try {
    if (useRegex.value) {
      const regex = new RegExp(searchText.value, 'g')
      output.value = input.value.replace(regex, replaceText.value)
    } else {
      output.value = input.value.split(searchText.value).join(replaceText.value)
    }
    saveToStorage()
  } catch (error) {
    output.value = '❌ 错误：' + error.message
  }
}

function saveToStorage() {
  localStorage.setItem('moment_replace_input', input.value)
  localStorage.setItem('moment_replace_options', JSON.stringify({
    searchText: searchText.value,
    replaceText: replaceText.value,
    useRegex: useRegex.value
  }))
}

function loadFromStorage() {
  const savedInput = localStorage.getItem('moment_replace_input')
  if (savedInput) input.value = savedInput
  
  const savedOptions = localStorage.getItem('moment_replace_options')
  if (savedOptions) {
    const opts = JSON.parse(savedOptions)
    searchText.value = opts.searchText
    replaceText.value = opts.replaceText
    useRegex.value = opts.useRegex
  }
}

function clear() {
  if (confirm('确定要清空所有内容吗？')) {
    input.value = ''
    output.value = ''
    searchText.value = ''
    replaceText.value = ''
    localStorage.removeItem('moment_replace_input')
    localStorage.removeItem('moment_replace_options')
  }
}

function copyResult() {
  if (output.value.trim() && !output.value.startsWith('❌')) {
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
.replace-page {
  padding: 32px 32px 32px 40px;
  background: var(--bg-light);
  animation: slideUp 0.4s ease-out;
}

.replace-container {
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  transition: background var(--transition-fast);
}

.checkbox-label:hover {
  background: var(--bg-subtle);
}

.checkbox-label input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: var(--brand-primary);
}

.options-card {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  padding: 16px 20px;
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  margin-bottom: 16px;
  box-shadow: var(--shadow-sm);
}

.option-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.option-label {
  font-size: 13px;
  font-weight: 600;
  color: var(--text-secondary);
}

.option-input {
  padding: 10px 14px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: 14px;
  background: var(--bg-white);
  color: var(--text-primary);
  transition: all 0.2s ease;
}

.option-input:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1);
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

.replace-input,
.replace-output {
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

.replace-input:focus,
.replace-output:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1);
}

.replace-output {
  background: var(--bg-subtle);
}

@media (max-width: 767px) {
  .replace-page {
    padding: 80px 16px 16px;
  }
  
  .options-card {
    flex-direction: column;
  }
  
  .work-area {
    grid-template-columns: 1fr;
  }
}
</style>
