import { useState } from 'react'
import { Button, SafeAreaView, ScrollView, Text, TextInput } from 'react-native'
import { Ollama } from 'ollama/browser'

// Use your computer's LAN IP (not localhost) when running on a device.
const HOST = 'http://localhost:11434'
const MODEL = 'llama3.2'
const ollama = new Ollama({ host: HOST })

export default function App() {
  const [prompt, setPrompt] = useState('')
  const [reply, setReply] = useState('')

  const send = async () => {
    setReply('')
    try {
      const res = await ollama.chat({ model: MODEL, messages: [{ role: 'user', content: prompt }] })
      setReply(res.message.content)
    } catch (e) {
      setReply(`Error: ${e.message}`)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, padding: 24 }}>
      <TextInput value={prompt} onChangeText={setPrompt} placeholder="Ask something" />
      <Button title="Send" onPress={send} />
      <ScrollView>
        <Text>{reply}</Text>
      </ScrollView>
    </SafeAreaView>
  )
}
