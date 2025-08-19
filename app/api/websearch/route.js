import { NextResponse } from 'next/server'

// Web search API configurations
const SERPER_API_URL = 'https://google.serper.dev/search'
const SERPER_API_KEY = process.env.SERPER_API_KEY

const BING_SEARCH_URL = 'https://api.bing.microsoft.com/v7.0/search'
const BING_API_KEY = process.env.BING_API_KEY

// Fallback search using DuckDuckGo (no API key required)
async function fallbackSearch(query) {
  try {
    // This is a simplified fallback - in production you might want to use a proper search API
    return {
      results: [
        {
          title: `Search results for: ${query}`,
          snippet: 'Web search functionality is available but requires API keys for full functionality. Please add SERPER_API_KEY or BING_API_KEY to your environment variables.',
          link: 'https://example.com',
          source: 'Fallback Search'
        }
      ],
      searchInfo: {
        totalResults: 1,
        searchTime: 0.1
      }
    }
  } catch (error) {
    throw new Error('Fallback search failed')
  }
}

// Search using Serper API (Google Search)
async function searchWithSerper(query) {
  if (!SERPER_API_KEY) {
    return await fallbackSearch(query)
  }

  try {
    const response = await fetch(SERPER_API_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: 5, // Number of results
        gl: 'us', // Country
        hl: 'en', // Language
      }),
    })

    if (!response.ok) {
      throw new Error(`Serper API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      results: data.organic?.map(result => ({
        title: result.title,
        snippet: result.snippet,
        link: result.link,
        source: 'Google Search'
      })) || [],
      searchInfo: {
        totalResults: data.searchInformation?.totalResults || 0,
        searchTime: data.searchInformation?.searchTime || 0
      }
    }
  } catch (error) {
    console.error('Serper search failed:', error)
    return await fallbackSearch(query)
  }
}

// Search using Bing Search API
async function searchWithBing(query) {
  if (!BING_API_KEY) {
    return await fallbackSearch(query)
  }

  try {
    const response = await fetch(`${BING_SEARCH_URL}?q=${encodeURIComponent(query)}&count=5`, {
      headers: {
        'Ocp-Apim-Subscription-Key': BING_API_KEY,
      },
    })

    if (!response.ok) {
      throw new Error(`Bing API error: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      results: data.webPages?.value?.map(result => ({
        title: result.name,
        snippet: result.snippet,
        link: result.url,
        source: 'Bing Search'
      })) || [],
      searchInfo: {
        totalResults: data.webPages?.totalEstimatedMatches || 0,
        searchTime: 0.1
      }
    }
  } catch (error) {
    console.error('Bing search failed:', error)
    return await fallbackSearch(query)
  }
}

export async function POST(request) {
  try {
    const { query } = await request.json()

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      )
    }

    // Try Serper first, then Bing, then fallback
    let searchResults
    
    if (SERPER_API_KEY) {
      searchResults = await searchWithSerper(query)
    } else if (BING_API_KEY) {
      searchResults = await searchWithBing(query)
    } else {
      searchResults = await fallbackSearch(query)
    }

    return NextResponse.json({
      success: true,
      query,
      ...searchResults
    })

  } catch (error) {
    console.error('Web search error:', error)
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    )
  }
}