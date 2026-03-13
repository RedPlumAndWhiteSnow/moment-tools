<template>
  <div class="json-page">
    <div class="json-container">
      <div class="toolbar">
        <span class="toolbar-title">{ } JSON 工具</span>
        <div class="toolbar-actions">
          <button class="btn btn-secondary" @click="swap" title="交换输入输出">🔄 交换</button>
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
        </div>
      </div>

      <div class="work-area">
        <div class="input-section">
          <label class="section-label">输入 JSON</label>
          <textarea 
            v-model="input" 
            placeholder='{"name": "test", "value": 123}'
            class="json-input"
          ></textarea>
        </div>

        <div class="output-section">
          <label class="section-label">
            输出
            <span :class="['status', validStatus]">{{ statusText }}</span>
          </label>
          <textarea 
            v-model="output" 
            readonly
            placeholder="结果将显示在这里... (Ctrl+Enter 处理)"
            class="json-output"
          ></textarea>
        </div>
      </div>

      <div class="actions-card">
        <div class="action-group">
          <span class="group-label">格式化</span>
          <button class="action-btn primary" @click="format">📄 格式化</button>
          <button class="action-btn" @click="compact">🗜️ 压缩</button>
        </div>
        <div class="action-group">
          <span class="group-label">转义</span>
          <button class="action-btn" @click="escape">🔒 转义 JSON</button>
          <button class="action-btn" @click="unescape">🔓 取消转义</button>
        </div>
        <div class="action-group">
          <span class="group-label">转换</span>
          <button class="action-btn" @click="objToJson">📝 对象转 JSON</button>
          <button class="action-btn" @click="jsonToObj">📋 JSON 转对象</button>
        </div>
        <div class="action-group">
          <span class="group-label">操作</span>
          <button class="action-btn success" @click="copyResult">📋 复制结果</button>
          <button class="action-btn" @click="copyInput">📋 复制输入</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const input = ref('')
const output = ref('')
const isValid = ref(null)

const validStatus = computed(() => {
  if (isValid.value === null) return ''
  return isValid.value ? 'valid' : 'invalid'
})

const statusText = computed(() => {
  if (isValid.value === null) return ''
  return isValid.value ? '✓ 有效 JSON' : '✗ 无效 JSON'
})

function validate() {
  if (!input.value.trim()) {
    isValid.value = null
    return false
  }
  try {
    JSON.parse(input.value)
    isValid.value = true
    return true
  } catch {
    isValid.value = false
    return false
  }
}

function format() {
  if (!validate()) {
    output.value = '❌ JSON 格式错误'
    return
  }
  try {
    output.value = JSON.stringify(JSON.parse(input.value), null, 2)
  } catch (e) {
    output.value = '❌ 错误：' + e.message
  }
}

function compact() {
  if (!validate()) {
    output.value = '❌ JSON 格式错误'
    return
  }
  try {
    output.value = JSON.stringify(JSON.parse(input.value))
  } catch (e) {
    output.value = '❌ 错误：' + e.message
  }
}

function escape() {
  if (!input.value.trim()) {
    output.value = ''
    return
  }
  try {
    output.value = JSON.stringify(input.value)
  } catch (e) {
    output.value = '❌ 错误：' + e.message
  }
}

function unescape() {
  if (!input.value.trim()) {
    output.value = ''
    return
  }
  try {
    output.value = JSON.parse(input.value)
  } catch (e) {
    output.value = '❌ 错误：' + e.message
  }
}

function objToJson() {
  if (!input.value.trim()) {
    output.value = ''
    return
  }
  try {
    const obj = Function('"use strict";return (' + input.value + ')')()
    output.value = JSON.stringify(obj, null, 2)
    isValid.value = true
  } catch (e) {
    output.value = '❌ 错误：' + e.message
    isValid.value = false
  }
}

function jsonToObj() {
  if (!validate()) {
    output.value = '❌ JSON 格式错误'
    return
  }
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj).replace(/,/g, ',\n  ').replace(/{/g, '{\n  ').replace(/}/g, '\n}').replace(/\[/g, '[\n  ').replace(/]/g, '\n]')
  } catch (e) {
    output.value = '❌ 错误：' + e.message
  }
}

function swap() {
  const temp = input.value
  input.value = output.value
  output.value = temp
  validate()
}

function clear() {
  if (confirm('确定要清空所有内容吗？')) {
    input.value = ''
    output.value = ''
    isValid.value = null
  }
}

function copyResult() {
  if (output.value.trim() && !output.value.startsWith('❌')) {
    navigator.clipboard.writeText(output.value)
  }
}

function copyInput() {
  if (input.value.trim()) {
    navigator.clipboard.writeText(input.value)
  }
}
</script>

<style scoped>
.json-page { padding: 32px 32px 32px 40px; background: var(--bg-light); }
.json-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--bg-white); border-radius: var(--radius-lg); margin-bottom: 16px; border: 1px solid var(--border-light); }
.toolbar-title { font-size: 18px; font-weight: 700; color: var(--text-primary); font-family: Monaco, Consolas, monospace; }
.toolbar-actions { display: flex; gap: 8px; }
.work-area { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.input-section, .output-section { min-width: 0; background: var(--bg-white); border-radius: var(--radius-lg); padding: 20px; border: 1px solid var(--border-light); }
.section-label { display: block; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center; }
.status { font-size: 12px; padding: 3px 8px; border-radius: 10px; font-weight: 500; }
.status.valid { background: rgba(72, 187, 120, 0.1); color: var(--success); }
.status.invalid { background: rgba(252, 129, 129, 0.1); color: var(--error); }
.json-input, .json-output { width: 100%; height: 350px; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; font-size: 13px; font-family: var(--font-mono); box-sizing: border-box; background: var(--bg-white); color: var(--text-primary); transition: all 0.2s ease; }
.json-input:focus, .json-output:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1); }
.actions-card { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; padding: 14px; background: var(--bg-white); border-radius: var(--radius-lg); border: 1px solid var(--border-light); }
.action-group { display: flex; flex-direction: column; gap: 8px; padding: 12px; background: var(--bg-subtle); border-radius: var(--radius-md); }
.group-label { font-size: 12px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; letter-spacing: 0.5px; }
.action-btn { padding: 10px 14px; border: 1px solid var(--border-light); background: var(--bg-white); border-radius: var(--radius-md); cursor: pointer; font-size: 13px; font-weight: 500; color: var(--text-secondary); transition: all 0.2s ease; text-align: left; }
.action-btn:hover { border-color: var(--brand-primary); background: var(--bg-subtle); color: var(--brand-primary); transform: translateY(-1px); }
.action-btn.primary { background: var(--brand-primary); border-color: var(--brand-primary); color: #fff; }
.action-btn.primary:hover { background: var(--brand-primary-dark); border-color: var(--brand-primary-dark); color: #fff; }
.action-btn.success { background: var(--success); border-color: var(--success); color: #fff; }
.action-btn.success:hover { background: var(--success-dark); border-color: var(--success-dark); color: #fff; }
@media (max-width: 767px) { .json-page { padding: 80px 16px 16px; } .work-area { grid-template-columns: 1fr; } .actions-card { grid-template-columns: 1fr; } }
</style>
