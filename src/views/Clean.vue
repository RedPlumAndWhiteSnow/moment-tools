<template>
  <div class="tool-page">
    <header class="tool-header">
      <h1 class="tool-title">🧹 文本清洗</h1>
      <p class="tool-desc">清理多余空格和特殊字符</p>
    </header>

    <div class="tool-content">
      <div class="options-section">
        <div class="option-item">
          <label class="checkbox-label">
            <input type="checkbox" v-model="trimSpaces" @change="process" />
            <span>去除首尾空格</span>
          </label>
        </div>
        <div class="option-item">
          <label class="checkbox-label">
            <input type="checkbox" v-model="removeEmpty" @change="process" />
            <span>删除空行</span>
          </label>
        </div>
        <div class="option-item">
          <label class="checkbox-label">
            <input type="checkbox" v-model="normalizeSpaces" @change="process" />
            <span>规范空格</span>
          </label>
        </div>
        <div class="option-item">
          <label class="checkbox-label">
            <input type="checkbox" v-model="removeSpecial" @change="process" />
            <span>删除特殊字符</span>
          </label>
        </div>
      </div>

      <div class="input-section">
        <label class="section-label">
          <span>输入文本</span>
          <span class="count">{{ inputLength }} 字符</span>
        </label>
        <textarea
          v-model="input"
          class="text-input"
          placeholder="请输入需要清洗的文本..."
          @input="process"
        ></textarea>
      </div>

      <div class="input-section">
        <label class="section-label">
          <span>清洗结果</span>
          <span class="count">{{ outputLength }} 字符 · 减少 {{ reducedLength }} 字符</span>
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
const trimSpaces = ref(true)
const removeEmpty = ref(false)
const normalizeSpaces = ref(false)
const removeSpecial = ref(false)
const success = ref(false)

const inputLength = computed(() => input.value.length)
const outputLength = computed(() => output.value.length)
const reducedLength = computed(() => inputLength.value - outputLength.value)

function process() {
  let result = input.value
  
  if (trimSpaces.value) {
    result = result.split('\n').map(line => line.trim()).join('\n')
  }
  
  if (removeEmpty.value) {
    result = result.split('\n').filter(line => line.trim()).join('\n')
  }
  
  if (normalizeSpaces.value) {
    result = result.replace(/\s+/g, ' ')
  }
  
  if (removeSpecial.value) {
    result = result.replace(/[^\w\s\u4e00-\u9fa5.,!?;:'"()\-]/g, '')
  }
  
  output.value = result
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

.options-section {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 12px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.option-item {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  min-height: 32px;
  white-space: nowrap;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
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
  
  .options-section {
    grid-template-columns: 1fr 1fr;
    padding: 10px;
  }
  
  .text-input {
    min-height: 160px;
    font-size: 14px;
    padding: 10px;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}

@supports (padding: max(0px)) {
  .tool-page {
    padding-bottom: max(16px, env(safe-area-inset-bottom));
  }
}
</style>
