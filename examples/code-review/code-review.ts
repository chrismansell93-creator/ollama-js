import { Ollama } from 'ollama'
import { readFile } from 'node:fs/promises'

// Usage: npx tsx code-review/code-review.ts <file> [model]
const [file, model = 'llama3.2'] = process.argv.slice(2)
if (!file) {
  console.error('Usage: code-review.ts <file> [model]')
  process.exit(1)
}

const code = await readFile(file, 'utf8')
const ollama = new Ollama()

const stream = await ollama.chat({
  model,
  stream: true,
  messages: [
    { role: 'system', content: 'You are a code reviewer. Point out bugs, risks and improvements concisely.' },
    { role: 'user', content: `Review this file (${file}):\n\n${code}` },
  ],
})

for await (const chunk of stream) {
  process.stdout.write(chunk.message.content)
}
process.stdout.write('\n')
