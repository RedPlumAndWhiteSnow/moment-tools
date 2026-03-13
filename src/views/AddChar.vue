<template>
  <div class="addchar-page">
    <div class="addchar-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">📎 首尾字符</span>
        </div>
        <div class="toolbar-actions">
          <span class="hint">💡 给每行文本添加前缀和后缀</span>
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
          <button class="btn btn-success" @click="copyResult" :disabled="!output">📋 复制结果</button>
        </div>
      </div>

      <div class="settings-row">
        <div class="setting-card">
          <label class="setting-label">📍 前缀</label>
          <input 
            v-model="prefix" 
            type="text" 
            placeholder='例如：[ 或 "'
            class="setting-input"
          >
        </div>
        <div class="setting-card">
          <label class="setting-label">📍 后缀</label>
          <input 
            v-model="suffix" 
            type="text" 
            placeholder='例如：] 或 "'
            class="setting-input"
          >
        </div>
      </div>

      <div class="work-area">
        <div class="input-section">
          <label class="section-label">📄 原始文本</label>
          <textarea 
            v-model="input" 
            placeholder="每行文本..."
            class="addchar-input"
          ></textarea>
        </div>

        <div class="output-section">
          <label class="section-label">
            ✨ 处理结果
            <span v-if="outputStats" class="stats">{{ outputStats }} 行</span>
          </label>
          <textarea 
            v-model="output" 
            readonly
            placeholder="结果将显示在这里..."
            class="addchar-output"
          ></textarea>
        </div>
      </div>

      <div class="presets-card">
        <label class="presets-title">⚡ 快速预设</label>
        <div class="presets-list">
          <button class="preset-btn" @click="setPreset('[', ']')">[ 文本 ]</button>
          <button class="preset-btn" @click="setPreset('&quot;', '&quot;')">" 文本 "</button>
          <button class="preset-btn" @click="setPreset(&quot;'&quot;, &quot;'&quot;)">' 文本 '</button>
          <button class="preset-btn" @click="setPreset('`', '`')">` 文本 `</button>
          <button class="preset-btn" @click="setPreset('SELECT * FROM ', '')">SQL 前缀</button>
          <button class="preset-btn" @click="setPreset('', ';')">SQL 后缀</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const input = ref('')
const output = ref('')
const prefix = ref('')
const suffix = ref('')
const outputStats = ref(0)

watch([input, prefix, suffix], () => {
  process()
}, { immediate: true })

function process() {
  if (!input.value.trim()) {
    output.value = ''
    outputStats.value = 0
    saveToStorage()
    return
  }

  const lines = input.value.split('\n')
  output.value = lines.map(line => prefix.value + line + suffix.value).join('\n')
  outputStats.value = output.value.split('\n').filter(l => l.trim()).length
  saveToStorage()
}

function setPreset(p, s) {
  prefix.value = p
  suffix.value = s
}

function saveToStorage() {
  localStorage.setItem('moment_addchar_input', input.value)
  localStorage.setItem('moment_addchar_prefix', prefix.value)
  localStorage.setItem('moment_addchar_suffix', suffix.value)
}

function loadFromStorage() {
  const saved = localStorage.getItem('moment_addchar_input')
  if (saved) input.value = saved
  const p = localStorage.getItem('moment_addchar_prefix')
  if (p) prefix.value = p
  const s = localStorage.getItem('moment_addchar_suffix')
  if (s) suffix.value = s
}

function clear() {
  if (confirm('确定要清空所有内容吗？')) {
    input.value = ''
    output.value = ''
    prefix.value = ''
    suffix.value = ''
    localStorage.removeItem('moment_addchar_input')
    localStorage.removeItem('moment_addchar_prefix')
    localStorage.removeItem('moment_addchar_suffix')
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
.addchar-page { padding: 32px 32px 32px 40px; background: var(--bg-light); }
.addchar-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); margin-bottom: 16px; }
.toolbar-left { display: flex; align-items: center; gap: 12px; }
.toolbar-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.toolbar-actions { display: flex; gap: 12px; align-items: center; }
.hint { font-size: 13px; color: var(--text-secondary); margin-right: 12px; }
.settings-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.setting-card { background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px; }
.setting-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; }
.setting-input { width: 100%; padding: 14px 18px; border: 1px solid var(--border-light); border-radius: var(--radius-md); font-size: 13px; box-sizing: border-box; transition: all var(--transition-base); }
.setting-input:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1); }
.work-area { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.input-section, .output-section { min-width: 0; max-width: 100%; background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px; }
.section-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 16px; }
.section-label .stats { margin-left: auto; font-weight: 500; font-size: 13px; background: var(--bg-subtle); color: #667eea; padding: 4px 12px; border-radius: 12px; }
.addchar-input, .addchar-output { width: 100%; height: 350px; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; font-size: 13px; font-family: var(--font-mono); box-sizing: border-box; transition: all var(--transition-base); }
.addchar-input:focus, .addchar-output:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1); }
.addchar-output { background: var(--bg-light); color: var(--text-primary); }
.presets-card { background: var(--bg-white); border: 1px solid var(--border-light); border-radius: var(--radius-lg); padding: 20px; box-shadow: var(--shadow-sm); margin-top: 16px; }
.presets-title { display: block; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 14px; }
.presets-list { display: flex; flex-wrap: wrap; gap: 10px; }
.preset-btn { padding: 10px 18px; background: var(--bg-light); border: none; border-radius: var(--radius-md); cursor: pointer; font-size: 13px; font-family: var(--font-mono); color: var(--text-secondary); transition: all var(--transition-base); font-weight: 500; }
.preset-btn:hover { background: var(--brand-primary); color: #fff; transform: translateY(-2px); }
@media (max-width: 767px) { .addchar-page { padding: 80px 16px 16px; } .settings-row, .work-area { grid-template-columns: 1fr; } }
</style>
