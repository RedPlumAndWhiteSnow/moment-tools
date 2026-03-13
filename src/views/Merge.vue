<template>
  <div class="merge-page">
    <div class="merge-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">🔗 文本合并</span>
        </div>
        <div class="toolbar-actions">
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
          <button class="btn btn-success" @click="copyResult" :disabled="!output">📋 复制</button>
        </div>
      </div>

      <div class="input-row">
        <div class="input-card">
          <label class="card-label">📄 文本 A</label>
          <textarea v-model="inputA" placeholder="粘贴第一列文本..." class="merge-input"></textarea>
        </div>
        <div class="input-card">
          <label class="card-label">📄 文本 B</label>
          <textarea v-model="inputB" placeholder="粘贴第二列文本..." class="merge-input"></textarea>
        </div>
      </div>

      <div class="settings-card">
        <label class="setting-label">🔧 分隔符</label>
        <div class="separator-options">
          <button 
            v-for="sep in separators" 
            :key="sep.value"
            :class="['sep-btn', { active: separator === sep.value }]"
            @click="separator = sep.value"
          >{{ sep.display }}</button>
          <input 
            v-model="customSeparator" 
            type="text" 
            placeholder="自定义..."
            class="custom-sep"
            @focus="separator = customSeparator"
          >
        </div>
      </div>

      <div class="output-card">
        <label class="card-label">
          ✨ 合并结果
          <span v-if="outputStats" class="stats">{{ outputStats }} 行</span>
        </label>
        <textarea v-model="output" readonly placeholder="合并结果将显示在这里..." class="merge-output"></textarea>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const inputA = ref('')
const inputB = ref('')
const output = ref('')
const separator = ref(' ')
const customSeparator = ref('')
const outputStats = ref(0)

const separators = [
  { value: ' ', display: '空格' },
  { value: ',', display: '逗号 ,' },
  { value: ';', display: '分号 ;' },
  { value: '|', display: '竖线 |' },
  { value: '\t', display: '制表符' },
  { value: '', display: '无' }
]

watch([inputA, inputB, separator], () => {
  process()
}, { immediate: true })

function process() {
  const linesA = inputA.value.split('\n').filter(l => l.trim())
  const linesB = inputB.value.split('\n').filter(l => l.trim())
  const maxLen = Math.max(linesA.length, linesB.length)
  
  const result = []
  for (let i = 0; i < maxLen; i++) {
    const a = linesA[i] || ''
    const b = linesB[i] || ''
    if (a && b) {
      result.push(a + separator.value + b)
    } else if (a) {
      result.push(a)
    } else if (b) {
      result.push(b)
    }
  }
  
  output.value = result.join('\n')
  outputStats.value = result.filter(l => l.trim()).length
  saveToStorage()
}

function saveToStorage() {
  localStorage.setItem('moment_merge_input_a', inputA.value)
  localStorage.setItem('moment_merge_input_b', inputB.value)
  localStorage.setItem('moment_merge_separator', separator.value)
}

function loadFromStorage() {
  const a = localStorage.getItem('moment_merge_input_a')
  if (a) inputA.value = a
  const b = localStorage.getItem('moment_merge_input_b')
  if (b) inputB.value = b
  const s = localStorage.getItem('moment_merge_separator')
  if (s) separator.value = s
}

function clear() {
  if (confirm('确定要清空所有内容吗？')) {
    inputA.value = ''
    inputB.value = ''
    output.value = ''
    localStorage.removeItem('moment_merge_input_a')
    localStorage.removeItem('moment_merge_input_b')
    localStorage.removeItem('moment_merge_separator')
  }
}

function copyResult() {
  if (output.value.trim()) {
    navigator.clipboard.writeText(output.value)
  }
}

onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped>
.merge-page { padding: 32px 32px 32px 40px; background: var(--bg-light); }
.merge-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); margin-bottom: 16px; }
.toolbar-left { display: flex; align-items: center; gap: 12px; }
.toolbar-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.toolbar-actions { display: flex; gap: 8px; }
.input-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.input-card { background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px; }
.card-label { display: flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; }
.merge-input { width: 100%; height: 200px; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; font-size: 13px; font-family: var(--font-mono); box-sizing: border-box; }
.merge-input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1); }
.settings-card { background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 16px 20px; margin-bottom: 16px; }
.setting-label { display: block; font-size: 14px; font-weight: 600; color: var(--text-primary); margin-bottom: 14px; }
.separator-options { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.sep-btn { padding: 8px 16px; border: 1px solid var(--border-light); background: var(--bg-white); border-radius: var(--radius-md); cursor: pointer; font-size: 13px; color: var(--text-secondary); transition: all 0.2s ease; }
.sep-btn:hover { border-color: var(--brand-primary); background: var(--bg-subtle); color: var(--brand-primary); }
.sep-btn.active { background: var(--brand-primary); border-color: var(--brand-primary); color: #fff; }
.custom-sep { padding: 8px 12px; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-size: 13px; background: var(--bg-white); color: var(--text-primary); flex: 1; min-width: 100px; }
.custom-sep:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1); }
.output-card { background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px; }
.output-card .stats { margin-left: auto; font-size: 12px; font-weight: 500; background: var(--bg-subtle); padding: 3px 8px; border-radius: 10px; }
.merge-output { width: 100%; height: 350px; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; font-size: 13px; font-family: var(--font-mono); box-sizing: border-box; background: var(--bg-subtle); }
@media (max-width: 767px) { .merge-page { padding: 80px 16px 16px; } .input-row { grid-template-columns: 1fr; } }
</style>
