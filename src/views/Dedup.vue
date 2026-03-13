<template>
  <div class="dedup-page">
    <div class="dedup-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">📝 文本去重</span>
        </div>
        <div class="toolbar-actions">
          <label class="checkbox-label">
            <input type="checkbox" v-model="ignoreSpaces">
            <span>忽略首尾空格</span>
          </label>
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
          <button class="btn btn-success" @click="copyResult" :disabled="!output">📋 复制</button>
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
            placeholder="粘贴需要去重的文本，每行一条... (Ctrl+Enter 处理)"
            class="dedup-input"
          ></textarea>
        </div>

        <div class="output-section">
          <label class="section-label">
            <span class="label-icon">✨</span>
            <span>去重结果</span>
            <span v-if="outputStats" class="stats">
              {{ outputStats }} 行 
              <span class="removed">(移除 {{ inputStats - outputStats }} 行)</span>
            </span>
          </label>
          <textarea 
            v-model="output" 
            readonly
            placeholder="结果将显示在这里..."
            class="dedup-output"
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
const ignoreSpaces = ref(false)

const inputStats = computed(() => {
  if (!input.value.trim()) return 0
  return input.value.split('\n').filter(line => line.trim()).length
})

const outputStats = computed(() => {
  if (!output.value.trim()) return 0
  return output.value.split('\n').filter(line => line.trim()).length
})

function process() {
  if (!input.value.trim()) {
    output.value = ''
    saveToStorage()
    return
  }

  let lines = input.value.split('\n')
  
  if (ignoreSpaces.value) {
    lines = lines.map(line => line.trim())
  }

  const seen = new Set()
  const result = []
  
  for (const line of lines) {
    const key = ignoreSpaces.value ? line.trim() : line
    if (key && !seen.has(key)) {
      seen.add(key)
      result.push(line)
    }
  }

  output.value = result.join('\n')
  saveToStorage()
}

function saveToStorage() {
  localStorage.setItem('moment_dedup_input', input.value)
}

function loadFromStorage() {
  const saved = localStorage.getItem('moment_dedup_input')
  if (saved) {
    input.value = saved
    process()
  }
}

function clear() {
  if (confirm('确定要清空所有内容吗？此操作无法撤销。')) {
    input.value = ''
    output.value = ''
    localStorage.removeItem('moment_dedup_input')
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
.dedup-page {
  padding: 32px 32px 32px 40px;
  background: var(--bg-light);
  animation: slideUp 0.4s ease-out;
}

@keyframes slideUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.dedup-container {
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

.section-label .stats .removed {
  color: var(--text-tertiary);
  margin-left: 4px;
}

.dedup-input,
.dedup-output {
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

.dedup-input:focus,
.dedup-output:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1);
}

.dedup-output {
  background: var(--bg-subtle);
}

@media (max-width: 767px) {
  .dedup-page {
    padding: 80px 16px 16px;
  }
  
  .work-area {
    grid-template-columns: 1fr;
  }
}
</style>
