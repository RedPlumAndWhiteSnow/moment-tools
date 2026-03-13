<template>
  <div class="calc-page">
    <div class="calc-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">🧮 文本计算</span>
        </div>
        <div class="toolbar-actions">
          <span class="hint">💡 每行一个表达式，自动计算</span>
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
          <button class="btn btn-success" @click="copyResult" :disabled="!output">📋 复制结果</button>
        </div>
      </div>

      <div class="work-area">
        <div class="input-section">
          <label class="section-label">📝 输入表达式</label>
          <textarea 
            v-model="input" 
            placeholder="1 + 1&#10;2 * 3&#10;100 / 4&#10;(5 + 3) * 2"
            class="calc-input"
          ></textarea>
        </div>

        <div class="output-section">
          <label class="section-label">
            ✨ 计算结果
            <span v-if="outputStats" class="stats">{{ outputStats }} 个有效结果</span>
          </label>
          <textarea 
            v-model="output" 
            readonly
            placeholder="结果将显示在这里..."
            class="calc-output"
          ></textarea>
        </div>
      </div>

      <div class="examples-card">
        <label class="examples-title">📚 示例表达式</label>
        <div class="examples-list">
          <button class="example-chip" @click="addExample('1 + 2 + 3')">1 + 2 + 3</button>
          <button class="example-chip" @click="addExample('10 * 5 - 3')">10 * 5 - 3</button>
          <button class="example-chip" @click="addExample('100 / 4')">100 / 4</button>
          <button class="example-chip" @click="addExample('(5 + 3) * 2')">(5 + 3) * 2</button>
          <button class="example-chip" @click="addExample('2 ** 10')">2 ** 10</button>
          <button class="example-chip" @click="addExample('Math.sqrt(144)')">Math.sqrt(144)</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const input = ref('')
const output = ref('')
const outputStats = ref(0)

function calculate(expr) {
  try {
    if (!/^[\d\s\+\-\*\/\.\(\)]+$/.test(expr) && !expr.includes('Math')) {
      return null
    }
    const result = new Function('return ' + expr)()
    if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
      return Number.isInteger(result) ? result : parseFloat(result.toFixed(4))
    }
    return null
  } catch {
    return null
  }
}

watch(input, () => {
  if (!input.value.trim()) {
    output.value = ''
    outputStats.value = 0
    return
  }

  const lines = input.value.split('\n')
  const results = []
  
  for (const line of lines) {
    const expr = line.trim()
    if (!expr) {
      results.push('')
      continue
    }
    
    const result = calculate(expr)
    results.push(result !== null ? result.toString() : '')
  }
  
  output.value = results.join('\n')
  outputStats.value = results.filter(r => r !== '').length
  saveToStorage()
}, { immediate: true })

function saveToStorage() {
  localStorage.setItem('moment_calc_input', input.value)
}

function loadFromStorage() {
  const saved = localStorage.getItem('moment_calc_input')
  if (saved) input.value = saved
}

function addExample(expr) {
  input.value = input.value ? input.value + '\n' + expr : expr
}

function clear() {
  if (confirm('确定要清空所有内容吗？')) {
    input.value = ''
    output.value = ''
    localStorage.removeItem('moment_calc_input')
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
.calc-page { padding: 32px 32px 32px 40px; background: var(--bg-light); }
.calc-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); margin-bottom: 16px; }
.toolbar-left { display: flex; align-items: center; gap: 12px; }
.toolbar-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.toolbar-actions { display: flex; gap: 12px; align-items: center; }
.hint { font-size: 13px; color: var(--text-secondary); margin-right: 12px; }
.work-area { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.input-section, .output-section { min-width: 0; background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px; }
.section-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; }
.section-label .stats { margin-left: auto; font-weight: 500; font-size: 12px; background: var(--bg-subtle); color: var(--text-secondary); padding: 3px 8px; border-radius: 10px; }
.calc-input, .calc-output { width: 100%; height: 350px; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; font-size: 13px; font-family: var(--font-mono); box-sizing: border-box; }
.calc-input:focus, .calc-output:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1); }
.calc-output { background: var(--bg-subtle); }
.examples-card { background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 16px 20px; margin-top: 16px; }
.examples-title { display: block; font-size: 13px; font-weight: 600; color: var(--text-secondary); margin-bottom: 12px; }
.examples-list { display: flex; flex-wrap: wrap; gap: 8px; }
.example-chip { padding: 6px 12px; background: var(--bg-light); border: none; border-radius: 20px; cursor: pointer; font-size: 13px; font-family: var(--font-mono); color: var(--text-secondary); transition: all var(--transition-base); font-weight: 500; }
.example-chip:hover { border-color: var(--brand-primary); background: var(--bg-subtle); color: var(--brand-primary); transform: translateY(-1px); }
@media (max-width: 767px) { .calc-page { padding: 80px 16px 16px; } .work-area { grid-template-columns: 1fr; } }
</style>
