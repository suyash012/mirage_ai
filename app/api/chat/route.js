import { NextResponse } from 'next/server'
import Cerebras from '@cerebras/cerebras_cloud_sdk'

// API configurations
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

// Cerebras configuration
const CEREBRAS_API_KEY = process.env.CEREBRAS_API_KEY
const cerebras = new Cerebras({
  apiKey: CEREBRAS_API_KEY
})

// Simple rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds between requests

// Web search function
async function performWebSearch(query, streamController = null, encoder = null) {
  try {
    if (streamController && encoder) {
      // Stream the search process
      streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ 
        chunk: `🔍 Searching the web for: "${query}"\n\n`, 
        done: false 
      })}\n\n`))
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/websearch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, stream: true }),
    })

    if (!response.ok) {
      throw new Error('Web search failed')
    }

    if (streamController && encoder && response.body) {
      // Handle streaming response
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let searchResults = null
      let resultsCount = 0

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                
                if (data.type === 'search_start') {
                  streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    chunk: `📡 ${data.status}\n`, 
                    done: false 
                  })}\n\n`))
                } else if (data.type === 'search_progress') {
                  streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    chunk: `⏳ ${data.status}\n`, 
                    done: false 
                  })}\n\n`))
                } else if (data.type === 'search_result') {
                  resultsCount++
                  streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    chunk: `📄 **Result ${data.index}:** ${data.result.title}\n   ${data.result.snippet}\n   🔗 ${data.result.link}\n\n`, 
                    done: false 
                  })}\n\n`))
                } else if (data.type === 'search_complete') {
                  streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ 
                    chunk: `✅ Found ${resultsCount} results in ${data.searchInfo?.searchTime || 0.1}s\n\n---\n\n`, 
                    done: false 
                  })}\n\n`))
                  
                  // Prepare search results for AI response
                  searchResults = {
                    results: [], // Will be populated from the streamed results
                    searchInfo: data.searchInfo
                  }
                }
              } catch (e) {
                // Ignore invalid JSON
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

      return searchResults
    } else {
      // Non-streaming fallback
      const data = await response.json()
      return data.success ? data : null
    }
  } catch (error) {
    console.error('Web search error:', error)
    if (streamController && encoder) {
      streamController.enqueue(encoder.encode(`data: ${JSON.stringify({ 
        chunk: `❌ Web search failed: ${error.message}\n\n`, 
        done: false 
      })}\n\n`))
    }
    return null
  }
}

// Check if query needs web search
function needsWebSearch(message) {
  const webSearchKeywords = [
    'latest', 'recent', 'current', 'today', 'news', 'update', 'what happened',
    'price of', 'stock price', 'weather', 'when did', 'who is', 'what is the current',
    'search for', 'find information', 'look up', 'google', 'bing'
  ]
  
  const lowerMessage = message.toLowerCase()
  return webSearchKeywords.some(keyword => lowerMessage.includes(keyword))
}

// Different prompt styles for AI models with web search integration
const getPromptForModel = (model, message, mode = 'detailed', searchResults = null) => {
  const modeInstructions = {
    'detailed': 'Provide comprehensive, detailed explanations with examples, context, and thorough analysis.',
    'concise': 'Give brief, direct answers that focus on key points without unnecessary elaboration.',
    'creative': 'Respond with creativity, imagination, and original thinking. Use vivid language and explore unique perspectives.'
  }

  const modelPersonalities = {
    'gpt-5': `You are GPT-5, the most advanced AI model from OpenAI. ${modeInstructions[mode]} Use your vast knowledge to give well-reasoned responses and consider multiple perspectives.`,

    'claude-4': `You are Claude 4 from Anthropic. ${modeInstructions[mode]} Respond with thoughtful, ethical considerations and careful reasoning. Be helpful, harmless, and honest.`,

    'gemini-2.5': `You are Gemini 2.5 from Google. ${modeInstructions[mode]} Integrate real-time information and multimodal understanding. Be factual, up-to-date, and consider practical applications.`,
  }

  const basePrompt = modelPersonalities[model] || `You are an AI assistant. ${modeInstructions[mode]}`
  
  let prompt = `${basePrompt}\n\nQuestion: ${message}`
  
  if (searchResults && searchResults.results && searchResults.results.length > 0) {
    prompt += `\n\nWeb Search Results:\n`
    searchResults.results.forEach((result, index) => {
      prompt += `${index + 1}. ${result.title}\n   ${result.snippet}\n   Source: ${result.link}\n\n`
    })
    prompt += `Please use this current information from the web search to provide an accurate and up-to-date response. Cite the sources when relevant.`
  }
  
  return prompt
}

async function callCerebrasAPI(prompt, modelId, stream = false) {
  console.log(`Calling Cerebras API for model: ${modelId}, stream: ${stream}`)
  
  if (!CEREBRAS_API_KEY) {
    console.log('No Cerebras API key found')
    // Fallback simulation if no API key is provided
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    const simulatedResponse = `${modelId} Response: Thank you for your question. I'm currently running in simulation mode as the API key is not configured. 

To get real responses from ${modelId}, please add your CEREBRAS_API_KEY to the environment variables. 

In the meantime, I can tell you that your question about "${prompt.substring(0, 100)}..." is interesting and I would be happy to help once the API is properly configured.

Would you like me to provide some general guidance on this topic instead?`
    return simulatedResponse
  }

  // Simple rate limiting
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
  lastRequestTime = Date.now()

  // Model mapping for Cerebras
  const modelMap = {
    'gpt-5': 'gpt-oss-120b',
    'claude-4': 'qwen-3-32b'
  }

  const cerebrasModel = modelMap[modelId] || 'gpt-oss-120b'
  console.log(`Using Cerebras model: ${cerebrasModel}`)

  try {
    if (stream) {
      console.log('Creating streaming request...')
      // Streaming response
      const stream = await cerebras.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: cerebrasModel,
        stream: true,
        max_completion_tokens: cerebrasModel === 'qwen-3-32b' ? 16382 : 65536,
        temperature: cerebrasModel === 'qwen-3-32b' ? 0.6 : 1,
        top_p: cerebrasModel === 'qwen-3-32b' ? 0.95 : 1,
        ...(cerebrasModel === 'gpt-oss-120b' && { reasoning_effort: "medium" })
      })

      console.log('Stream created successfully')
      return stream // Return the stream for processing
    } else {
      console.log('Creating non-streaming request...')
      // Non-streaming response
      const completion = await cerebras.chat.completions.create({
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        model: cerebrasModel,
        max_completion_tokens: cerebrasModel === 'qwen-3-32b' ? 16382 : 1000,
        temperature: cerebrasModel === 'qwen-3-32b' ? 0.6 : 0.7,
        top_p: cerebrasModel === 'qwen-3-32b' ? 0.95 : 1,
        ...(cerebrasModel === 'gpt-oss-120b' && { reasoning_effort: "medium" })
      })

      console.log('Non-streaming response received')
      return completion.choices[0].message.content
    }

  } catch (error) {
    console.error(`Cerebras API call failed for ${modelId}:`, error)
    console.error('Model used:', cerebrasModel)
    console.error('Error details:', error.message)

    // Fallback to simulation with more detailed response
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Handle rate limiting specifically
    if (error.message.includes('429')) {
      return `I'm currently experiencing high demand. The ${modelId} service is temporarily rate-limited.

Please try again in a moment. Rate limiting helps ensure fair access for all users.

Your question about "${prompt.substring(0, 100)}..." is important and I'll be ready to answer it once the rate limit resets.`
    }

    // Handle model not found errors
    if (error.message.includes('404') || error.message.includes('not found')) {
      return `The ${modelId} model is currently unavailable. This might be due to:

1. Temporary maintenance on the API provider's end
2. Model updates being deployed
3. Service interruption

Please try again later, or you can switch to a different model in the meantime.`
    }

    // General error fallback
    return `I encountered a technical issue while trying to access ${modelId}. Here's what I can tell you:

Error: ${error.message}

Despite this technical hiccup, I understand you're asking about "${prompt.substring(0, 100)}..." and I'd be happy to help once the connection is restored.

You might want to try refreshing the page or selecting a different AI model for now.`
  }
}

async function callMistralAPI(prompt) {
  if (!MISTRAL_API_KEY) {
    // Fallback simulation if no API key is provided
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    return `Mistral AI Response: ${prompt}\n\n(This is a simulated response. Add your MISTRAL_API_KEY to environment variables for real API calls.)`
  }

  try {
    const response = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0].message.content

  } catch (error) {
    console.error('Mistral API call failed:', error)
    // Fallback to simulation
    await new Promise(resolve => setTimeout(resolve, 1000))
    return `Mistral AI Response: ${prompt}\n\n(API call failed, showing simulated response. Check your MISTRAL_API_KEY and network connection.)`
  }
}

export async function POST(request) {
  try {
    const { message, model, mode = 'detailed', stream = false, useWebSearch = true } = await request.json()

    if (!message || !model) {
      return NextResponse.json(
        { success: false, error: 'Message and model are required' },
        { status: 400 }
      )
    }

    if (stream) {
      // Return streaming response
      const encoder = new TextEncoder()

      if (model === 'gpt-5' || model === 'claude-4') {
        // Use Cerebras for GPT-5 and Claude with real streaming
        try {
          const streamResponse = new ReadableStream({
            async start(controller) {
              try {
                // Perform web search if needed (with streaming)
                let searchResults = null
                if (useWebSearch && needsWebSearch(message)) {
                  console.log('Performing streaming web search for:', message)
                  searchResults = await performWebSearch(message, controller, encoder)
                }

                // Get the appropriate prompt with search results
                const prompt = getPromptForModel(model, message, mode, searchResults)

                // Now proceed with AI response
                const response = await callCerebrasAPI(prompt, model, true)

                if (typeof response === 'string') {
                  // Fallback case - simulate streaming
                  const words = response.split(' ')
                  for (let i = 0; i < words.length; i++) {
                    const chunk = i === 0 ? words[i] : ' ' + words[i]
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk, done: false })}\n\n`))
                    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
                  }
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: '', done: true })}\n\n`))
                  controller.close()
                } else {
                  // Real streaming from Cerebras
                  console.log('Starting Cerebras streaming...')
                  let hasContent = false
                  let accumulatedContent = ''
                  
                  try {
                    for await (const chunk of response) {
                      console.log('Received chunk:', chunk)
                      const content = chunk.choices?.[0]?.delta?.content || ''
                      if (content) {
                        hasContent = true
                        accumulatedContent += content
                        console.log('Streaming content:', content)
                        
                        // Stream word by word for better UX
                        const words = content.split(' ')
                        for (let i = 0; i < words.length; i++) {
                          const word = i === 0 ? words[i] : ' ' + words[i]
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: word, done: false })}\n\n`))
                          // Add small delay for streaming effect
                          await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 50))
                        }
                      }
                    }
                  } catch (streamError) {
                    console.error('Cerebras streaming error:', streamError)
                    // If streaming fails, fall back to simulated streaming
                    hasContent = false
                  }
                  
                  if (!hasContent) {
                    console.log('No content received or streaming failed, using fallback')
                    // Create a simulated response and stream it word by word
                    const fallbackMsg = `I apologize, but I'm experiencing some technical difficulties with the streaming response. Let me provide you with a response based on your query: ${message.substring(0, 100)}...

I understand you're asking about this topic, and while I'm having some connectivity issues with my primary response system, I can still help you. Please try asking your question again, or let me know if you'd like me to approach this differently.`
                    
                    const words = fallbackMsg.split(' ')
                    for (let i = 0; i < words.length; i++) {
                      const word = i === 0 ? words[i] : ' ' + words[i]
                      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: word, done: false })}\n\n`))
                      await new Promise(resolve => setTimeout(resolve, 80 + Math.random() * 60))
                    }
                  }
                  
                  console.log('Streaming complete')
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: '', done: true })}\n\n`))
                  controller.close()
                }
              } catch (error) {
                console.error('Streaming error:', error)
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`))
                controller.close()
              }
            }
          })

          return new Response(streamResponse, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          })
        } catch (error) {
          console.error('Cerebras streaming error:', error)

          // Handle rate limiting with proper fallback
          const fallbackMessage = error.message?.includes('429')
            ? `${model} is currently experiencing high demand. Please try again in a moment.`
            : `${model} encountered an error. Showing fallback response.`

          // Fallback to simulated streaming
          const streamResponse = new ReadableStream({
            async start(controller) {
              // Perform web search if needed (with streaming)
              if (useWebSearch && needsWebSearch(message)) {
                console.log('Performing streaming web search for:', message)
                await performWebSearch(message, controller, encoder)
              }

              const words = fallbackMessage.split(' ')
              for (let i = 0; i < words.length; i++) {
                const chunk = i === 0 ? words[i] : ' ' + words[i]
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk, done: false })}\n\n`))
                await new Promise(resolve => setTimeout(resolve, 100))
              }
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: '', done: true })}\n\n`))
              controller.close()
            }
          })

          return new Response(streamResponse, {
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              'Connection': 'keep-alive',
            },
          })
        }
      }

      // Use Mistral for Gemini or fallback
      const streamResponse = new ReadableStream({
        async start(controller) {
          try {
            // Perform web search if needed (with streaming)
            let searchResults = null
            if (useWebSearch && needsWebSearch(message)) {
              console.log('Performing streaming web search for:', message)
              searchResults = await performWebSearch(message, controller, encoder)
            }

            // Get the appropriate prompt with search results
            const prompt = getPromptForModel(model, message, mode, searchResults)
            const response = await callMistralAPI(prompt)

            // Simulate streaming by sending response word by word
            const words = response.split(' ')
            for (let i = 0; i < words.length; i++) {
              const chunk = i === 0 ? words[i] : ' ' + words[i]
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk, done: false })}\n\n`))

              // Add delay between words to simulate streaming
              await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
            }

            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: '', done: true })}\n\n`))
            controller.close()
          } catch (error) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: error.message, done: true })}\n\n`))
            controller.close()
          }
        }
      })

      return new Response(streamResponse, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      })
    } else {
      // Non-streaming responses
      let searchResults = null
      if (useWebSearch && needsWebSearch(message)) {
        console.log('Performing web search for:', message)
        searchResults = await performWebSearch(message)
      }

      // Get the appropriate prompt with search results  
      const prompt = getPromptForModel(model, message, mode, searchResults)
      let response

      if (model === 'gpt-5' || model === 'claude-4') {
        response = await callCerebrasAPI(prompt, model, false)
      } else {
        response = await callMistralAPI(prompt)
      }

      return NextResponse.json({
        success: true,
        response,
        model,
        mode
      })
    }

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Example of how to integrate with real APIs:
/*
async function callOpenAI(message) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }],
      max_tokens: 1000,
    }),
  })
  
  const data = await response.json()
  return data.choices[0].message.content
}

async function callClaude(message) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'Content-Type': 'application/json',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [{ role: 'user', content: message }]
    }),
  })
  
  const data = await response.json()
  return data.content[0].text
}
*/
