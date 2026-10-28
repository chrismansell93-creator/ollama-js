import { Ollama, type Message } from 'ollama'
import * as readline from 'node:readline/promises'

// Simple interactive chat REPL. Commands: /clear, /model <name>, /exit
const ollama = new Ollama()
let model = process.argv[2] ?? 'llama3.2'
let history: Message[] = []

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
console.log(`Chatting with ${model}. Commands: /clear, /model <name>, /exit`)

while (true) {
  let line: string
  try {
    line = (await rl.question('>>> ')).trim()
  } catch {
    break // input closed
  }
  if (!line) continue
  if (line === '/exit') break
  if (line === '/clear') {
    history = []
    console.log('History cleared.')
    continue
  }
  if (line.startsWith('/model ')) {
    model = line.slice(7).trim()
    console.log(`Model set to ${model}`)
    continue
  }

  history.push({ role: 'user', content: line })
  let reply = ''
  try {
    const stream = await ollama.chat({ model, messages: history, stream: true })
    for await (const chunk of stream) {
      reply += chunk.message.content
      process.stdout.write(chunk.message.content)
    }
    process.stdout.write('\n')
    history.push({ role: 'assistant', content: reply })
  } catch (e) {
    history.pop()
    console.error(`\nError: ${(e as Error).message}`)
  }
}
rl.close()
