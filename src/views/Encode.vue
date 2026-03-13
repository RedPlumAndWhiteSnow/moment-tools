<template>
  <div class="encode-page">
    <div class="encode-container">
      <div class="toolbar">
        <div class="toolbar-left">
          <span class="toolbar-title">🔐 编解码</span>
        </div>
        <div class="toolbar-actions">
          <button class="btn btn-secondary" @click="swap" title="交换输入输出">🔄 交换</button>
          <button class="btn btn-secondary" @click="clear">🗑️ 清空</button>
          <button class="btn btn-success" @click="copyResult" :disabled="!output || output.startsWith('❌')">📋 复制</button>
        </div>
      </div>

      <div class="tabs-card">
        <button 
          v-for="tab in tabs" 
          :key="tab.value"
          :class="['tab-btn', { active: selectedType === tab.value }]"
          @click="selectedType = tab.value"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          <span class="tab-label">{{ tab.label }}</span>
        </button>
      </div>

      <div class="work-area">
        <div class="input-section">
          <label class="section-label">{{ inputLabel }}</label>
          <textarea v-model="input" :placeholder="placeholder" class="encode-input"></textarea>
        </div>

        <div class="output-section">
          <label class="section-label">
            {{ outputLabel }}
            <span v-if="status" :class="['status', statusType]">{{ status }}</span>
          </label>
          <textarea v-model="output" readonly placeholder="结果将显示在这里..." class="encode-output"></textarea>
        </div>
      </div>

      <div class="actions-card">
        <button class="btn btn-primary action-btn" @click="encode">{{ encodeLabel }}</button>
        <button class="btn btn-secondary action-btn" @click="decode">{{ decodeLabel }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const input = ref('')
const output = ref('')
const selectedType = ref('base64')
const error = ref(null)

const tabs = [
  { value: 'base64', icon: '📦', label: 'Base64' },
  { value: 'url', icon: '🔗', label: 'URL' },
  { value: 'hex', icon: '🔢', label: 'Hex' },
  { value: 'unicode', icon: '∑', label: 'Unicode' },
  { value: 'hash', icon: '🔒', label: 'Hash' }
]

const inputLabel = computed(() => selectedType.value === 'hash' ? '输入内容' : '输入')
const outputLabel = computed(() => selectedType.value === 'hash' ? '哈希值' : '输出')
const placeholder = computed(() => {
  const map = {
    base64: '输入要 Base64 编码或解码的内容',
    url: '输入要 URL 编码或解码的内容',
    hex: '输入要转 Hex 的文本，或输入 Hex',
    unicode: '输入中文或 \\u4e2d\\u6587 格式的 Unicode',
    hash: '输入要计算哈希的内容'
  }
  return map[selectedType.value] || ''
})
const encodeLabel = computed(() => selectedType.value === 'hash' ? '🔐 MD5' : '✨ 编码')
const decodeLabel = computed(() => selectedType.value === 'hash' ? '🔐 SHA256' : '✨ 解码')
const status = computed(() => {
  if (error.value) return '✗ ' + error.value
  if (output.value && !output.value.startsWith('❌')) return '✓ 成功'
  return ''
})
const statusType = computed(() => error.value ? 'error' : 'success')

function toHex(str) {
  return Array.from(str).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
}

function fromHex(hex) {
  hex = hex.replace(/\s/g, '')
  if (!/^[0-9a-fA-F]*$/.test(hex) || hex.length % 2 !== 0) {
    throw new Error('无效的 Hex')
  }
  return hex.match(/.{2}/g).map(b => String.fromCharCode(parseInt(b, 16))).join('')
}

function toUnicode(str) {
  return Array.from(str).map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')).join('')
}

function fromUnicode(str) {
  return str.replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

async function hash(text, algorithm) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)
  const hashBuffer = await crypto.subtle.digest(algorithm, data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

async function encode() {
  error.value = null
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  try {
    switch (selectedType.value) {
      case 'base64':
        output.value = btoa(unescape(encodeURIComponent(input.value)))
        break
      case 'url':
        output.value = encodeURIComponent(input.value)
        break
      case 'hex':
        output.value = toHex(input.value)
        break
      case 'unicode':
        output.value = toUnicode(input.value)
        break
      case 'hash':
        output.value = await hash(input.value, 'MD5')
        break
    }
  } catch (e) {
    error.value = e.message
    output.value = '❌ ' + e.message
  }
}

async function decode() {
  error.value = null
  if (!input.value.trim()) {
    output.value = ''
    return
  }

  try {
    switch (selectedType.value) {
      case 'base64':
        output.value = decodeURIComponent(escape(atob(input.value)))
        break
      case 'url':
        output.value = decodeURIComponent(input.value)
        break
      case 'hex':
        output.value = fromHex(input.value)
        break
      case 'unicode':
        output.value = fromUnicode(input.value)
        break
      case 'hash':
        output.value = await hash(input.value, 'SHA-256')
        break
    }
  } catch (e) {
    error.value = e.message
    output.value = '❌ ' + e.message
  }
}

function swap() {
  const temp = input.value
  input.value = output.value
  output.value = temp
  error.value = null
}

function clear() {
  if (confirm('确定要清空所有内容吗？')) {
    input.value = ''
    output.value = ''
    error.value = null
  }
}

function copyResult() {
  if (output.value.trim() && !output.value.startsWith('❌')) {
    navigator.clipboard.writeText(output.value)
  }
}
</script>

<style scoped>
.encode-page { padding: 32px 32px 32px 40px; background: var(--bg-light); }
.encode-container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
.toolbar { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; background: var(--bg-white); border-radius: var(--radius-lg); margin-bottom: 16px; border: 1px solid var(--border-light); }
.toolbar-left { display: flex; align-items: center; gap: 12px; }
.toolbar-title { font-size: 18px; font-weight: 700; color: var(--text-primary); }
.toolbar-actions { display: flex; gap: 8px; align-items: center; }
.tabs-card { display: flex; gap: 8px; padding: 12px; background: var(--bg-white); border-radius: var(--radius-lg); margin-bottom: 16px; border: 1px solid var(--border-light); flex-wrap: wrap; }
.tab-btn { display: flex; align-items: center; gap: 6px; padding: 8px 14px; border: 1px solid var(--border-light); background: var(--bg-white); border-radius: var(--radius-md); cursor: pointer; transition: all 0.2s ease; color: var(--text-secondary); font-size: 13px; font-weight: 500; }
.tab-btn:hover { border-color: var(--brand-primary); background: var(--bg-subtle); color: var(--brand-primary); }
.tab-btn.active { border-color: var(--brand-primary); background: var(--brand-primary); color: #fff; }
.tab-icon { font-size: 16px; }
.work-area { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
.input-section, .output-section { min-width: 0; background: var(--bg-white); border-radius: var(--radius-lg); padding: 20px; border: 1px solid var(--border-light); }
.section-label { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: var(--text-primary); margin-bottom: 12px; justify-content: space-between; }
.status { font-size: 12px; padding: 3px 8px; border-radius: 10px; font-weight: 500; }
.status.success { background: rgba(72, 187, 120, 0.1); color: var(--success); }
.status.error { background: rgba(252, 129, 129, 0.1); color: var(--error); }
.encode-input, .encode-output { width: 100%; height: 350px; border: 1px solid var(--border-light); border-radius: var(--radius-md); padding: 14px; font-size: 13px; font-family: var(--font-mono); box-sizing: border-box; background: var(--bg-white); color: var(--text-primary); transition: all 0.2s ease; }
.encode-input:focus, .encode-output:focus { outline: none; border-color: var(--brand-primary); box-shadow: 0 0 0 3px rgba(91, 139, 175, 0.1); }
.actions-card { display: flex; gap: 12px; }
.action-btn { flex: 1; padding: 12px 20px; font-size: 13px; font-weight: 600; }
@media (max-width: 767px) { .encode-page { padding: 80px 16px 16px; } .work-area { grid-template-columns: 1fr; } .tabs-card { justify-content: center; } }
</style>
