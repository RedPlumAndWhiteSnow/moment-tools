<template>
  <div class="case-page">
    <div class="case-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">🔤 文本转换</span>
        </div>
        <div class="toolbar-actions">
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
          <button class="btn btn-success" @click="copyResult" :disabled="!output">📋 复制结果</button>
        </div>
      </div>

      <div class="work-area">
        <div class="input-section">
          <label class="section-label">📄 原始文本</label>
          <textarea v-model="input" placeholder="输入文本..." class="case-input"></textarea>
        </div>

        <div class="output-section">
          <label class="section-label">✨ 转换结果</label>
          <textarea v-model="output" readonly placeholder="结果将显示在这里..." class="case-output"></textarea>
        </div>
      </div>

      <div class="convert-card">
        <label class="convert-title">🎯 选择转换类型</label>
        <div class="convert-grid">
          <button 
            v-for="opt in options" 
            :key="opt.value"
            :class="['convert-btn', { active: selectedType === opt.value }]"
            @click="convert(opt.value)"
          >
            <span class="convert-icon">{{ opt.icon }}</span>
            <span class="convert-label">{{ opt.label }}</span>
            <span class="convert-example">{{ opt.example }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const selectedType = ref('')

const options = [
  { value: 'upper', label: '大写', icon: 'AA', example: 'HELLO WORLD' },
  { value: 'lower', label: '小写', icon: 'aa', example: 'hello world' },
  { value: 'camel', label: '小驼峰', icon: 'aA', example: 'helloWorld' },
  { value: 'pascal', label: '大驼峰', icon: 'AA', example: 'HelloWorld' },
  { value: 'snake', label: '蛇形', icon: 'a_a', example: 'hello_world' },
  { value: 'kebab', label: '烤串', icon: 'a-a', example: 'hello-world' },
  { value: 'constant', label: '常量', icon: 'A_A', example: 'HELLO_WORLD' },
  { value: 'title', label: '标题', icon: 'Aa', example: 'Hello World' }
]

function toWords(str) {
  return str
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w.trim() !== '')
}

function convert(type) {
  selectedType.value = type
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  const words = toWords(input.value)
  
  switch (type) {
    case 'upper':
      output.value = input.value.toUpperCase()
      break
    case 'lower':
      output.value = input.value.toLowerCase()
      break
    case 'camel':
      output.value = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
      break
    case 'pascal':
      output.value = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('')
      break
    case 'snake':
      output.value = words.map(w => w.toLowerCase()).join('_')
      break
    case 'kebab':
      output.value = words.map(w => w.toLowerCase()).join('-')
      break
    case 'constant':
      output.value = words.map(w => w.toUpperCase()).join('_')
      break
    case 'title':
      output.value = input.value.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.substr(1).toLowerCase())
      break
  }
}

function clear() {
  if (confirm('确定要清空所有内容吗？')) {
    input.value = ''
    output.value = ''
    selectedType.value = ''
  }
}

function copyResult() {
  if (output.value.trim()) {
    navigator.clipboard.writeText(output.value)
  }
}
</script>

<style scoped>
.case-page { padding: 32px 32px 32px 40px; background: var(--bg-light); }
.case-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); margin-bottom: 16px; }
.toolbar-left { display: flex; align-items: center; gap: 12px; }
.toolbar-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.toolbar-actions { display: flex; gap: 12px; align-items: center; }
.work-area { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.input-section, .output-section { min-width: 0; background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px; }
.section-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; }
.case-input, .case-output { width: 100%; height: 350px; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; font-size: 13px; font-family: var(--font-mono); box-sizing: border-box; transition: all var(--transition-base); }
.case-input:focus, .case-output:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1); }
.case-output { background: var(--bg-light); color: var(--text-primary); }
.convert-card { background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow-sm); }
.convert-title { display: block; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; }
.convert-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
.convert-btn { display: flex; flex-direction: column; align-items: center; padding: 18px; background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-base); text-align: center; }
.convert-btn:hover { border-color: #667eea; background: rgba(102, 126, 234, 0.05); transform: translateY(-3px); }
.convert-btn.active { border-color: var(--brand-primary); background: var(--brand-primary); color: #fff; }
.convert-icon { font-size: 24px; font-weight: 700; font-family: var(--font-mono); margin-bottom: 10px; }
.convert-label { font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.convert-example { font-size: 11px; opacity: 0.7; font-family: var(--font-mono); }
@media (max-width: 767px) { .case-page { padding: 80px 16px 16px; } .work-area { grid-template-columns: 1fr; } .convert-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
