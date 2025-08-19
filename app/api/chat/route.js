import { NextResponse } from 'next/server'

// API configurations
const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions'
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY

// Simple rate limiting
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds between requests

// Web search function
async function performWebSearch(query) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/websearch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error('Web search failed')
    }

    const data = await response.json()
    return data.success ? data : null
  } catch (error) {
    console.error('Web search error:', error)
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

async function callOpenRouterAPI(prompt, modelId, stream = false) {
  if (!OPENROUTER_API_KEY) {
    // Fallback simulation if no API key is provided
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))
    return `${modelId} Response: ${prompt}\n\n(This is a simulated response. Add your OPENROUTER_API_KEY to environment variables for real API calls.)`
  }

  // Simple rate limiting
  const now = Date.now()
  const timeSinceLastRequest = now - lastRequestTime
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest
    await new Promise(resolve => setTimeout(resolve, waitTime))
  }
  lastRequestTime = Date.now()

  // Model mapping
  const modelMap = {
    'gpt-5': 'deepseek/deepseek-r1:free',
    'claude-4': 'z-ai/glm-4.5-air:free'
  }

  const openRouterModel = modelMap[modelId] || 'openai/gpt-oss-20b:free'

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'Mirage AI',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: openRouterModel,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
        stream: stream,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`)
    }

    if (stream) {
      return response // Return the response for streaming
    } else {
      const data = await response.json()
      return data.choices[0].message.content
    }

  } catch (error) {
    console.error(`OpenRouter API call failed for ${modelId}:`, error)
    console.error('Model used:', openRouterModel)
    console.error('Error details:', error.message)

    // Fallback to simulation
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Handle rate limiting specifically
    if (error.message.includes('429')) {
      return `${modelId} Response: I'm currently experiencing high demand. Please try again in a moment.\n\n(Rate limit reached - this is a temporary limitation from the API provider.)`
    }

    // Handle model not found errors
    if (error.message.includes('404') || error.message.includes('not found')) {
      return `${modelId} Response: The requested model is currently unavailable. Please try again later.\n\n(Model not found error - the API provider may be updating their models.)`
    }

    return `${modelId} Response: ${prompt}\n\n(API call failed: ${error.message}. Showing simulated response.)`
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

    // Check if web search is needed and perform it
    let searchResults = null
    if (useWebSearch && needsWebSearch(message)) {
      console.log('Performing web search for:', message)
      searchResults = await performWebSearch(message)
    }

    // Get the appropriate prompt for the selected model variant and mode
    const prompt = getPromptForModel(model, message, mode, searchResults)

    if (stream) {
      // Return streaming response
      const encoder = new TextEncoder()

      if (model === 'gpt-5' || model === 'claude-4') {
        // Use OpenRouter for GPT-5 and Claude with real streaming
        try {
          const response = await callOpenRouterAPI(prompt, model, true)

          if (typeof response === 'string') {
            // Fallback case - simulate streaming
            const streamResponse = new ReadableStream({
              async start(controller) {
                const words = response.split(' ')
                for (let i = 0; i < words.length; i++) {
                  const chunk = i === 0 ? words[i] : ' ' + words[i]
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk, done: false })}\n\n`))
                  await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100))
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
          } else {
            // Real streaming from OpenRouter
            const reader = response.body.getReader()
            const decoder = new TextDecoder()

            const streamResponse = new ReadableStream({
              async start(controller) {
                try {
                  while (true) {
                    const { done, value } = await reader.read()
                    if (done) break

                    const chunk = decoder.decode(value)
                    const lines = chunk.split('\n')

                    for (const line of lines) {
                      if (line.startsWith('data: ')) {
                        const data = line.slice(6)
                        if (data === '[DONE]') {
                          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: '', done: true })}\n\n`))
                          controller.close()
                          return
                        }

                        try {
                          const parsed = JSON.parse(data)
                          const content = parsed.choices?.[0]?.delta?.content
                          if (content) {
                            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: content, done: false })}\n\n`))
                          }
                        } catch (e) {
                          // Skip invalid JSON
                        }
                      }
                    }
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
          }
        } catch (error) {
          console.error('OpenRouter streaming error:', error)

          // Handle rate limiting with proper fallback
          const fallbackMessage = error.message?.includes('429')
            ? `${modelName} is currently experiencing high demand. Please try again in a moment.`
            : `${modelName} encountered an error. Showing fallback response.`

          // Fallback to simulated streaming
          const streamResponse = new ReadableStream({
            async start(controller) {
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
      let response

      if (model === 'gpt-5' || model === 'claude-4') {
        response = await callOpenRouterAPI(prompt, model, false)
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
