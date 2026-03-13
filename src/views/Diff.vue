<template>
  <div class="diff-page">
    <div class="diff-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">🔍 文本比对</span>
        </div>
        <div class="toolbar-actions">
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
          <button class="btn btn-success" @click="copyResult" :disabled="!hasContent">📋 复制</button>
        </div>
      </div>

      <div class="input-row">
        <div class="input-card">
          <label class="card-label">📄 文本 A</label>
          <textarea 
            v-model="inputA" 
            placeholder="粘贴第一段文本... (Ctrl+Enter 比对)"
            class="diff-input"
          ></textarea>
        </div>
        <div class="input-card">
          <label class="card-label">📄 文本 B</label>
          <textarea 
            v-model="inputB" 
            placeholder="粘贴第二段文本..."
            class="diff-input"
          ></textarea>
        </div>
      </div>

      <div v-if="hasContent" class="diff-result-card">
        <label class="card-label">
          ✨ 比对结果
          <span v-if="stats.total" class="stats">
            共 {{ stats.total }} 行 · 
            <span class="common">✓ 相同 {{ stats.common }}</span> · 
            <span class="missing">✗ 仅 A {{ stats.onlyA }}</span> · 
            <span class="added">+ 仅 B {{ stats.onlyB }}</span>
          </span>
        </label>
        <div class="diff-result" v-html="diffResult"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const inputA = ref('')
const inputB = ref('')

const hasContent = computed(() => inputA.value.trim() || inputB.value.trim())

const stats = ref({ common: 0, onlyA: 0, onlyB: 0, total: 0 })

const diffResult = computed(() => {
  if (!inputA.value.trim() && !inputB.value.trim()) {
    return '<div class="diff-empty"><div class="empty-icon">🔍</div><div class="empty-text">请输入文本进行比对</div></div>'
  }
  
  if (!inputA.value.trim() || !inputB.value.trim()) {
    return '<div class="diff-empty"><div class="empty-icon">⏳</div><div class="empty-text">等待输入</div></div>'
  }

  const linesA = inputA.value.split('\n').filter(l => l.trim())
  const linesB = inputB.value.split('\n').filter(l => l.trim())
  
  const setA = new Set(linesA)
  const setB = new Set(linesB)
  
  const common = []
  const onlyA = []
  const onlyB = []
  
  for (const line of linesA) {
    if (setB.has(line)) {
      common.push(line)
    } else {
      onlyA.push(line)
    }
  }
  
  for (const line of linesB) {
    if (!setA.has(line)) {
      onlyB.push(line)
    }
  }
  
  stats.value = {
    common: common.length,
    onlyA: onlyA.length,
    onlyB: onlyB.length,
    total: common.length + onlyA.length + onlyB.length
  }
  
  let html = ''
  for (const line of common) {
    html += `<span class="diff-line common">✓ ${escapeHtml(line)}</span>`
  }
  for (const line of onlyA) {
    html += `<span class="diff-line missing">✗ ${escapeHtml(line)}</span>`
  }
  for (const line of onlyB) {
    html += `<span class="diff-line added">+ ${escapeHtml(line)}</span>`
  }
  
  return html || '<span class="no-content">请输入文本进行比对</span>'
})

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

function clear() {
  if (confirm('确定要清空所有内容吗？')) {
    inputA.value = ''
    inputB.value = ''
    stats.value = { common: 0, onlyA: 0, onlyB: 0, total: 0 }
  }
}

function copyResult() {
  const text = document.querySelector('.diff-result')?.innerText || ''
  if (text.trim() && !text.includes('请输入')) {
    navigator.clipboard.writeText(text)
  }
}

function handleKeydown(e) {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault()
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
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.diff-page {
  padding: 32px 32px 32px 40px;
  background: var(--bg-light);
  animation: slideUp 0.4s ease-out;
}

.diff-container {
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

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.input-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.card-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}

.diff-input {
  width: 100%;
  height: 200px;
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

.diff-input:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1);
}

.diff-result-card {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.diff-result {
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 2;
}

.diff-line {
  display: block;
  padding: 4px 8px;
  border-left: 3px solid transparent;
}

.diff-line.common {
  background: rgba(72, 187, 120, 0.1);
  border-left-color: var(--success);
  color: var(--text-primary);
}

.diff-line.missing {
  background: rgba(252, 129, 129, 0.1);
  border-left-color: var(--error);
  color: var(--text-primary);
}

.diff-line.added {
  background: rgba(99, 179, 237, 0.1);
  border-left-color: var(--info);
  color: var(--text-primary);
}

.stats {
  margin-left: auto;
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary);
}

.common {
  color: var(--success);
}

.missing {
  color: var(--error);
}

.added {
  color: var(--info);
}

.diff-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

@media (max-width: 767px) {
  .diff-page {
    padding: 80px 16px 16px;
  }
  
  .input-row {
    grid-template-columns: 1fr;
  }
}
</style>
