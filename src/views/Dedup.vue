<template>
  <div class="tool-page">
    <header class="tool-header">
      <h1 class="tool-title">📝 文本去重</h1>
      <p class="tool-desc">去除重复行，保留唯一值</p>
    </header>

    <div class="tool-content">
      <div class="input-section">
        <label class="section-label">
          <span>输入文本</span>
          <span class="count">{{ inputLines }} 行</span>
        </label>
        <textarea
          v-model="input"
          class="text-input"
          placeholder="请输入文本，每行一条..."
          @input="process"
        ></textarea>
      </div>

      <div class="options-section">
        <div class="option-item">
          <label class="checkbox-label">
            <input type="checkbox" v-model="caseSensitive" @change="process" />
            <span>区分大小写</span>
          </label>
        </div>
        <div class="option-item">
          <label class="checkbox-label">
            <input type="checkbox" v-model="trimSpaces" @change="process" />
            <span>忽略首尾空格</span>
          </label>
        </div>
        <div class="option-item">
          <label class="checkbox-label">
            <input type="checkbox" v-model="keepEmpty" @change="process" />
            <span>保留空行</span>
          </label>
        </div>
      </div>

      <div class="input-section">
        <label class="section-label">
          <span>去重结果</span>
          <span class="count">{{ outputLines }} 行 · 已去除 {{ removedLines }} 行</span>
        </label>
        <textarea
          v-model="output"
          class="text-input result"
          placeholder="结果将显示在这里..."
          readonly
        ></textarea>
      </div>

      <div class="action-buttons">
        <button class="btn btn-primary" @click="copyResult" :disabled="!output">
          📋 复制结果
        </button>
        <button class="btn btn-secondary" @click="clearAll">
          🗑️ 清空
        </button>
      </div>

      <div v-if="success" class="toast success">✅ 已复制到剪贴板</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const input = ref('')
const output = ref('')
const caseSensitive = ref(false)
const trimSpaces = ref(false)
const keepEmpty = ref(false)
const success = ref(false)

const inputLines = computed(() => input.value.split('\n').filter(l => l.trim()).length)
const outputLines = computed(() => output.value.split('\n').filter(l => l.trim()).length)
const removedLines = computed(() => inputLines.value - outputLines.value)

function process() {
  const lines = input.value.split('\n')
  const seen = new Set()
  
  const result = lines.filter(line => {
    const processed = trimSpaces.value ? line.trim() : line
    const key = caseSensitive.value ? processed : processed.toLowerCase()
    
    if (!keepEmpty.value && !line.trim()) return false
    if (seen.has(key)) return false
    
    seen.add(key)
    return true
  })
  
  output.value = result.join('\n')
}

function copyResult() {
  navigator.clipboard.writeText(output.value)
  success.value = true
  setTimeout(() => success.value = false, 2000)
}

function clearAll() {
  input.value = ''
  output.value = ''
}
</script>

<style scoped>
.tool-page {
  padding: 16px;
  max-width: 900px;
  margin: 0 auto;
}

.tool-header {
  text-align: center;
  margin-bottom: 24px;
  padding: 20px 16px;
  background: var(--brand-gradient);
  border-radius: var(--radius-lg);
  color: #fff;
}

.tool-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.tool-desc {
  font-size: 13px;
  opacity: 0.9;
}

.tool-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.section-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.section-label .count {
  font-size: 12px;
  color: var(--text-tertiary);
  background: var(--bg-subtle);
  padding: 4px 8px;
  border-radius: 4px;
}

.text-input {
  width: 100%;
  min-height: 200px;
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-size: 14px;
  font-family: var(--font-mono);
  line-height: 1.6;
  resize: vertical;
  transition: all 0.2s ease;
  background: var(--bg-white);
  color: var(--text-primary);
}

.text-input:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1);
}

.text-input.result {
  background: var(--bg-subtle);
  color: var(--text-secondary);
}

.options-section {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.option-item {
  flex: 0 0 auto;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  min-height: 32px;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 14px 20px;
  border: none;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 48px;
}

.btn-primary {
  background: var(--brand-primary);
  color: #fff;
}

.btn-primary:hover {
  background: var(--brand-primary-dark);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: var(--bg-white);
  color: var(--text-secondary);
  border: 1px solid var(--border-light);
}

.btn-secondary:hover {
  background: var(--bg-subtle);
}

.toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  background: var(--bg-dark);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: 14px;
  box-shadow: var(--shadow-lg);
  animation: slideUp 0.3s ease;
}

.toast.success {
  background: var(--success);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 移动端优化 */
@media (max-width: 767px) {
  .tool-page {
    padding: 12px;
  }
  
  .tool-header {
    padding: 16px;
    margin-bottom: 16px;
  }
  
  .tool-title {
    font-size: 18px;
  }
  
  .tool-desc {
    font-size: 12px;
  }
  
  .text-input {
    min-height: 160px;
    font-size: 14px;
    padding: 10px;
  }
  
  .options-section {
    padding: 10px;
    gap: 10px;
  }
  
  .checkbox-label {
    font-size: 13px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .section-label .count {
    font-size: 11px;
    padding: 3px 6px;
  }
}

/* 安全区域适配 */
@supports (padding: max(0px)) {
  .tool-page {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
}
</style>
