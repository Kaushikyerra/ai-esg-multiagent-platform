import * as pdfjsLib from 'pdfjs-dist'

// Use CDN worker to avoid Vite bundling issues with pdfjs-dist v5
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`

export async function extractTextFromPDF(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

  const allItems: { text: string; x: number; y: number; page: number }[] = []

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p)
    const content = await page.getTextContent()
    const viewport = page.getViewport({ scale: 1 })

    for (const item of content.items as any[]) {
      if (!item.str?.trim()) continue
      const yFromTop = viewport.height - item.transform[5]
      allItems.push({
        text: item.str,
        x: Math.round(item.transform[4]),
        y: Math.round(yFromTop),
        page: p,
      })
    }
  }

  allItems.sort((a, b) =>
    a.page !== b.page ? a.page - b.page :
    a.y !== b.y ? a.y - b.y :
    a.x - b.x
  )

  const Y_THRESHOLD = 5
  const lineGroups: { y: number; page: number; minX: number; items: typeof allItems }[] = []
  for (const item of allItems) {
    const last = lineGroups[lineGroups.length - 1]
    if (last && last.page === item.page && Math.abs(item.y - last.y) <= Y_THRESHOLD) {
      last.items.push(item)
      last.minX = Math.min(last.minX, item.x)
    } else {
      lineGroups.push({ y: item.y, page: item.page, minX: item.x, items: [item] })
    }
  }

  const xValues = lineGroups.map(g => g.minX)
  const xMin = Math.min(...xValues)
  const xMax = Math.max(...xValues)
  const hasIndentation = (xMax - xMin) > 20 && lineGroups.length > 5

  if (hasIndentation) {
    // Good positional data — use coordinate-based indentation
    const yamlLines = lineGroups.map(group => {
      group.items.sort((a, b) => a.x - b.x)
      const xOffset = group.minX - xMin
      const indent = Math.round(xOffset / 6)
      const lineText = group.items.map(i => i.text).join(' ').trim()
      return ' '.repeat(Math.max(0, indent)) + lineText
    })
    return yamlLines.join('\n')
  }

  // Flat text fallback — reconstruct YAML structure from keywords
  const flat = lineGroups.map(g => {
    g.items.sort((a, b) => a.x - b.x)
    return g.items.map(i => i.text).join(' ')
  }).join(' ')

  return reconstructYaml(flat)
}

const ALL_KEYS = [
  'continue-on-error', 'timeout-minutes', 'node-version', 'python-version',
  'java-version', 'dotnet-version', 'pull_request', 'workflow_dispatch',
  'runs-on', 'branches', 'schedule', 'strategy', 'environment', 'outputs',
  'matrix', 'steps', 'needs', 'push', 'tags', 'with', 'uses', 'run', 'env',
  'id', 'on', 'if', 'name', 'jobs', 'trigger', 'stages', 'variables',
]
const ALL_KEYS_SET = new Set(ALL_KEYS)

const KEY_PATTERN = new RegExp(
  ` (${ALL_KEYS.map(k => k.replace(/-/g, '\\-')).join('|')}):`,
  'g'
)

function reconstructYaml(flat: string): string {
  let text = flat.replace(/\s+/g, ' ').trim()

  // Step 1: protect step list items with a sentinel so key-splitting doesn't break them
  const SENTINEL = '\x00'
  text = text.replace(/(\S)\s+-\s+(?=[a-zA-Z])/g, (_m, prev) => `${prev}\n${SENTINEL}`)
  text = text.replace(/\s+-\s+(?=[a-zA-Z])/g, `\n${SENTINEL}`)

  // Step 2: split on known YAML keys (space-separated only, not across newlines)
  text = text.replace(KEY_PATTERN, (_m, key) => `\n${key}:`)

  // Step 3: split on hyphenated job/stage names (not in known keys)
  text = text.replace(/ ([a-z][a-z0-9]*(?:-[a-z0-9]+)+):/g, (_m, key) => {
    if (ALL_KEYS_SET.has(key)) return ` ${key}:`
    return `\n${key}:`
  })

  // Step 4: run known-key split again (catches keys after job names)
  text = text.replace(KEY_PATTERN, (_m, key) => `\n${key}:`)

  // Step 5: restore sentinels to "- "
  text = text.replace(new RegExp(SENTINEL, 'g'), '- ')

  const rawLines = text.split('\n').map(l => l.trim()).filter(Boolean)

  const TOP      = new Set(['name', 'on', 'jobs', 'trigger', 'stages', 'variables', 'resources'])
  const ON_SUB   = new Set(['push', 'pull_request', 'workflow_dispatch', 'schedule'])
  const JOB      = new Set(['runs-on', 'needs', 'steps', 'strategy', 'environment', 'outputs', 'timeout-minutes'])
  const STEP_SUB = new Set(['uses', 'run', 'with', 'env', 'id', 'continue-on-error', 'if'])
  const WITH_SUB = new Set(['node-version', 'python-version', 'java-version', 'dotnet-version'])
  const KNOWN_ALL = new Set([...TOP, ...ON_SUB, ...JOB, ...STEP_SUB, ...WITH_SUB, 'matrix', 'branches', 'tags'])

  // Collect job names (lines after "jobs:" that aren't known keys)
  const jobNames = new Set<string>()
  let afterJobs = false
  for (const line of rawLines) {
    const key = line.split(':')[0].trim()
    if (key === 'jobs') { afterJobs = true; continue }
    if (afterJobs) {
      if (TOP.has(key)) { afterJobs = false; continue }
      if (!KNOWN_ALL.has(key) && !line.startsWith('-') && /^[a-zA-Z]/.test(key)) {
        jobNames.add(key)
      }
    }
  }

  // Context-aware indentation assignment
  const result: string[] = []
  let ctx: 'top' | 'on' | 'jobs' | 'job' | 'steps' | 'step' | 'with' | 'strategy' = 'top'

  for (const line of rawLines) {
    if (!line) continue
    const key = line.split(':')[0].trim()
    const rest = line.slice(key.length + 1).trim()

    if (TOP.has(key)) {
      if (key === 'on') ctx = 'on'
      else if (key === 'jobs') ctx = 'jobs'
      else ctx = 'top'
      result.push(line)
    }
    else if (ctx === 'on' && ON_SUB.has(key)) {
      result.push('  ' + line)
    }
    else if (ctx === 'on' && (key === 'branches' || key === 'tags')) {
      result.push('    ' + line)
    }
    else if (jobNames.has(key)) {
      ctx = 'job'
      result.push('  ' + line)
    }
    else if ((ctx === 'job' || ctx === 'steps' || ctx === 'step' || ctx === 'strategy' || ctx === 'with') && JOB.has(key)) {
      if (key === 'steps') ctx = 'steps'
      else if (key === 'strategy') ctx = 'strategy'
      result.push('  ' + line)
    }
    else if (ctx === 'strategy' && key === 'matrix') {
      result.push('    ' + line)
    }
    else if ((ctx === 'steps' || ctx === 'step') && line.startsWith('- ')) {
      ctx = 'step'
      result.push('      ' + line)
    }
    else if (ctx === 'step' && key === 'with') {
      ctx = 'with'
      result.push('        with:')
      if (rest) {
        rest.split(/\s+(?=[a-zA-Z-]+:)/).forEach(p => {
          if (p.trim()) result.push('          ' + p.trim())
        })
      }
    }
    else if (ctx === 'with' && WITH_SUB.has(key)) {
      result.push('          ' + line)
    }
    else if ((ctx === 'step' || ctx === 'with') && STEP_SUB.has(key)) {
      if (ctx === 'with') ctx = 'step'
      result.push('        ' + line)
    }
    else {
      // Unknown — append to previous line
      if (result.length > 0) result[result.length - 1] += ' ' + line
      else result.push(line)
    }
  }

  return result.join('\n')
}
