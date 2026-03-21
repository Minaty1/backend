const axios = require('axios')

const GROQ_API_BASE = process.env.GROQ_API_BASE || 'https://api.groq.com/openai/v1'
const GROQ_CHAT_API_KEY = process.env.GROQ_CHAT_API_KEY
const GROQ_CHAT_MODEL = process.env.GROQ_CHAT_MODEL || 'llama-3.1-8b-instant'

class AIService {
  async chat(message, userId = 'default') {
    try {
      if (!GROQ_CHAT_API_KEY) {
        const mock = [
          "I'm Jarvis, your virtual assistant. How can I help?",
          "Sure, I can help with that. What else?",
          "Processing your request. One moment..."
        ]
        return {
          response: mock[Math.floor(Math.random() * mock.length)],
          userId,
          timestamp: new Date().toISOString(),
          source: 'mock'
        }
      }

      const resp = await axios.post(
        `${GROQ_API_BASE}/chat/completions`,
        {
          model: GROQ_CHAT_MODEL,
          messages: [
            { role: 'system', content: 'You are JARVIS, a helpful AI assistant.' },
            { role: 'user', content: message }
          ],
          max_tokens: 1024,
          temperature: 0.7
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_CHAT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      )

      return {
        response: resp.data.choices?.[0]?.message?.content || '',
        userId,
        timestamp: new Date().toISOString(),
        source: 'groq'
      }
    } catch (err) {
      console.error('AI Chat Error:', err.message)
      throw new Error('Failed to get AI response')
    }
  }

  async generateImage(prompt) {
    return {
      imageUrl: null,
      message: 'Image generation is currently disabled',
      prompt,
      source: 'mock'
    }
  }

  async textToSpeech(text) {
    return {
      audioUrl: null,
      message: 'TTS is currently disabled',
      text,
      source: 'mock'
    }
  }
}

module.exports = new AIService()
