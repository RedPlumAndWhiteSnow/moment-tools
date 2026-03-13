<template>
  <div class="tool-page">
    <header class="tool-header">
      <h1 class="tool-title">🔄 批量替换</h1>
      <p class="tool-desc">多规则批量替换文本</p>
    </header>

    <div class="tool-content">
      <div class="rules-section">
        <div class="section-header">
          <label class="section-label">替换规则</label>
          <button class="btn btn-small btn-primary" @click="addRule">
            ➕ 添加规则
          </button>
        </div>
        
        <div class="rules-list">
          <div v-for="(rule, index) in rules" :key="index" class="rule-item">
            <input
              v-model="rule.find"
              class="rule-input"
              placeholder="查找..."
            />
            <span class="arrow">→</span>
            <input
              v-model="rule.replace"
              class="rule-input"
              placeholder="替换为..."
            />
            <button class="btn-remove" @click="removeRule(index)">✕</button>
          </div>
        </div>
      </div>

      <div class="options-row">
        <label class="checkbox-label">
          <input type="checkbox" v-model="caseSensitive" @change="process" />
          <span>区分大小写</span>
        </label>
        <label class="checkbox-label">
          <input type="checkbox" v-model="useRegex" @change="process" />
          <span>正则表达式</span>
        </label>
      </div>

      <div class="input-section">
        <label class="section-label">
          <span>输入文本</span>
          <span class="count">{{ inputLength }} 字符</span>
        </label>
        <textarea
          v-model="input"
          class="text-input"
          placeholder="请输入要处理的文本..."
          @input="process"
        ></textarea>
      </div>

      <div class="input-section">
        <label class="section-label">
          <span>替换结果</span>
          <span class="count">{{ outputLength }} 字符</span>
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
const rules = ref([{ find: '', replace: '' }])
const caseSensitive = ref(false)
const useRegex = ref(false)
const success = ref(false)

const inputLength = computed(() => input.value.length)
const outputLength = computed(() => output.value.length)

function addRule() {
  rules.value.push({ find: '', replace: '' })
}

function removeRule(index) {
  if (rules.value.length > 1) {
    rules.value.splice(index, 1)
  }
  process()
}

function process() {
  let result = input.value
  
  rules.value.forEach(rule => {
    if (!rule.find) return
    
    try {
      const flags = caseSensitive.value ? 'g' : 'gi'
      const pattern = useRegex.value ? new RegExp(rule.find, flags) : escapeRegex(rule.find)
      result = result.replace(new RegExp(pattern, flags), rule.replace)
    } catch (e) {
      // 忽略无效正则
    }
  })
  
  output.value = result
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function copyResult() {
  navigator.clipboard.writeText(output.value)
  success.value = true
  setTimeout(() => success.value = false, 2000)
}

function clearAll() {
  input.value = ''
  output.value = ''
  rules.value = [{ find: '', replace: '' }]
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

.rules-section {
  background: var(--bg-white);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  padding: 12px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.section-label {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

.btn-small {
  padding: 6px 12px;
  font-size: 13px;
  min-height: 36px;
}

.rules-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rule-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--bg-subtle);
  border-radius: var(--radius-sm);
}

.rule-input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--border-light);
  border-radius: var(--radius-sm);
  font-size: 14px;
  min-height: 36px;
}

.arrow {
  color: var(--text-tertiary);
  font-size: 16px;
}

.btn-remove {
  width: 32px;
  height: 32px;
  border: none;
  background: var(--error);
  color: #fff;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.options-row {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
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
  
  .rules-section {
    padding: 10px;
  }
  
  .rule-item {
    flex-wrap: wrap;
  }
  
  .rule-input {
    min-width: calc(50% - 20px);
    flex: none;
  }
  
  .arrow {
    width: 100%;
    text-align: center;
    margin: 4px 0;
  }
  
  .btn-remove {
    position: absolute;
    right: 8px;
    top: 8px;
  }
  
  .options-row {
    gap: 12px;
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
