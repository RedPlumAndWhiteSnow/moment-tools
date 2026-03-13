/**
 * 片刻工具箱 - 核心工具函数库
 * 所有文本处理工具的统一实现
 */

/**
 * 文本去重
 * @param {string} text - 输入文本
 * @param {object} options - 选项
 */
export function deduplicate(text, options = {}) {
  const { caseSensitive = false, trimSpaces = false, keepEmpty = false } = options
  const lines = text.split('\n')
  const seen = new Set()
  
  return lines.filter(line => {
    let processed = trimSpaces ? line.trim() : line
    if (!caseSensitive) processed = processed.toLowerCase()
    if (!keepEmpty && !processed.trim()) return false
    if (seen.has(processed)) return false
    seen.add(processed)
    return true
  }).join('\n')
}

/**
 * 批量替换
 * @param {string} text - 输入文本
 * @param {array} rules - 替换规则 [{find, replace}]
 * @param {object} options - 选项
 */
export function replace(text, rules, options = {}) {
  const { caseSensitive = false, useRegex = false } = options
  let result = text
  
  rules.forEach(rule => {
    if (!rule.find) return
    try {
      const flags = caseSensitive ? 'g' : 'gi'
      const pattern = useRegex ? rule.find : escapeRegex(rule.find)
      result = result.replace(new RegExp(pattern, flags), rule.replace)
    } catch (e) {
      // 忽略无效正则
    }
  })
  
  return result
}

/**
 * 文本比对
 * @param {string} text1 - 文本 1
 * @param {string} text2 - 文本 2
 */
export function diff(text1, text2) {
  const lines1 = text1.split('\n')
  const lines2 = text2.split('\n')
  
  const onlyIn1 = lines1.filter(line => !lines2.includes(line))
  const onlyIn2 = lines2.filter(line => !lines1.includes(line))
  const inBoth = lines1.filter(line => lines2.includes(line))
  
  return { onlyIn1, onlyIn2, inBoth }
}

/**
 * 文本清洗
 * @param {string} text - 输入文本
 * @param {object} options - 选项
 */
export function clean(text, options = {}) {
  const { trimSpaces = true, removeEmpty = false, normalizeSpaces = false, removeSpecial = false } = options
  let result = text
  
  if (trimSpaces) {
    result = result.split('\n').map(line => line.trim()).join('\n')
  }
  
  if (removeEmpty) {
    result = result.split('\n').filter(line => line.trim()).join('\n')
  }
  
  if (normalizeSpaces) {
    result = result.replace(/\s+/g, ' ')
  }
  
  if (removeSpecial) {
    result = result.replace(/[^\w\s\u4e00-\u9fa5.,!?;:'"()\-]/g, '')
  }
  
  return result
}

/**
 * 文本合并
 * @param {array} texts - 文本数组
 * @param {string} separator - 分隔符
 */
export function merge(texts, separator = '\n') {
  return texts.filter(t => t.trim()).join(separator)
}

/**
 * 首尾添加字符
 * @param {string} text - 输入文本
 * @param {string} prefix - 前缀
 * @param {string} suffix - 后缀
 */
export function addChar(text, prefix = '', suffix = '') {
  return text.split('\n')
    .map(line => line.trim() ? `${prefix}${line}${suffix}` : line)
    .join('\n')
}

/**
 * 大小写转换
 * @param {string} text - 输入文本
 * @param {string} type - 转换类型
 */
export function changeCase(text, type) {
  switch (type) {
    case 'upper': return text.toUpperCase()
    case 'lower': return text.toLowerCase()
    case 'title': return text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
    case 'sentence': return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    default: return text
  }
}

/**
 * URL 编解码
 * @param {string} text - 输入文本
 * @param {string} action - encode | decode
 */
export function urlEncode(text, action) {
  try {
    return action === 'encode' ? encodeURIComponent(text) : decodeURIComponent(text)
  } catch (e) {
    return text
  }
}

/**
 * Base64 编解码
 * @param {string} text - 输入文本
 * @param {string} action - encode | decode
 */
export function base64Encode(text, action) {
  try {
    if (action === 'encode') {
      return btoa(unescape(encodeURIComponent(text)))
    } else {
      return decodeURIComponent(escape(atob(text)))
    }
  } catch (e) {
    return text
  }
}

/**
 * JSON 格式化
 * @param {string} text - 输入文本
 * @param {number} spaces - 缩进空格数
 */
export function jsonFormat(text, spaces = 2) {
  try {
    return JSON.stringify(JSON.parse(text), null, spaces)
  } catch (e) {
    throw new Error('无效的 JSON 格式')
  }
}

/**
 * JSON 压缩
 * @param {string} text - 输入文本
 */
export function jsonMinify(text) {
  try {
    return JSON.stringify(JSON.parse(text))
  } catch (e) {
    throw new Error('无效的 JSON 格式')
  }
}

/**
 * 正则表达式转义
 * @param {string} str - 原始字符串
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * 统计文本信息
 * @param {string} text - 输入文本
 */
export function countText(text) {
  const chars = text.length
  const lines = text.split('\n').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  
  return { chars, lines, words }
}
