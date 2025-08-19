'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'

export default function MessageFormatter({ content, isStreaming = false }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  // Format the content with proper line breaks and structure
  const formatContent = (text) => {
    if (!text) return ''
    
    // Handle inline formatting with proper bold/italic rendering
    const formatInlineText = (text) => {
      // Process text with proper formatting
      const processFormatting = (str) => {
        const parts = []
        let currentIndex = 0
        
        // Regex to match bold, italic, and inline code
        const formatRegex = /(\*\*([^*]+)\*\*|\*([^*]+)\*|`([^`]+)`)/g
        let match
        
        while ((match = formatRegex.exec(str)) !== null) {
          // Add text before the match
          if (match.index > currentIndex) {
            parts.push(str.slice(currentIndex, match.index))
          }
          
          // Add formatted content
          if (match[2]) {
            // Bold text
            parts.push(<strong key={match.index} className="font-semibold text-white">{match[2]}</strong>)
          } else if (match[3]) {
            // Italic text
            parts.push(<em key={match.index} className="italic text-gray-200">{match[3]}</em>)
          } else if (match[4]) {
            // Inline code
            parts.push(
              <code key={match.index} className="bg-gray-800 text-pink-400 px-2 py-1 rounded text-sm font-mono">
                {match[4]}
              </code>
            )
          }
          
          currentIndex = match.index + match[0].length
        }
        
        // Add remaining text
        if (currentIndex < str.length) {
          parts.push(str.slice(currentIndex))
        }
        
        return parts.length > 0 ? parts : [str]
      }
      
      return processFormatting(text)
    }
    
    // Split by double line breaks for paragraphs
    const paragraphs = text.split('\n\n')
    
    return paragraphs.map((paragraph, index) => {
      // Handle tables (markdown format)
      const lines = paragraph.split('\n')
      const tableLines = lines.filter(line => line.includes('|') && line.trim().length > 0)
      
      // Check if this looks like a table (has at least 2 lines with pipes)
      const isTable = tableLines.length >= 2 && 
                     tableLines.some(line => line.split('|').length >= 3) // At least 2 columns
      
      if (isTable) {
        // Find header and separator
        let headerIndex = -1
        let separatorIndex = -1
        
        for (let i = 0; i < tableLines.length; i++) {
          const line = tableLines[i].trim()
          if (line.includes('|') && !line.match(/^[\|\s\-:]+$/)) {
            if (headerIndex === -1) {
              headerIndex = i
            }
          } else if (line.match(/^[\|\s\-:]+$/) && headerIndex !== -1) {
            separatorIndex = i
            break
          }
        }
        
        if (headerIndex !== -1 && separatorIndex !== -1) {
          const headerLine = tableLines[headerIndex]
          const dataLines = tableLines.slice(separatorIndex + 1)
          
          // Parse header - handle both |header| and header| formats
          const headers = headerLine.split('|')
            .map(cell => cell.trim())
            .filter(cell => cell !== '')
          
          // Parse data rows
          const rows = dataLines.map(line => {
            const cells = line.split('|')
              .map(cell => cell.trim())
              .filter(cell => cell !== '')
            
            // Ensure row has same number of columns as header
            while (cells.length < headers.length) {
              cells.push('')
            }
            return cells.slice(0, headers.length)
          }).filter(row => row.some(cell => cell !== '')) // Remove empty rows
          
          if (headers.length > 0 && rows.length > 0) {
            return (
              <div key={index} className="mb-6 w-full -mx-4">
                <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                  <table className="min-w-full border-collapse border border-gray-600 rounded-lg overflow-hidden table-fixed">
                    <thead>
                      <tr className="bg-gray-800">
                        {headers.map((header, headerIndex) => (
                          <th 
                            key={headerIndex} 
                            className="border border-gray-600 px-2 py-2 text-left font-semibold text-blue-400 text-xs"
                            style={{ width: `${100 / headers.length}%` }}
                          >
                            <div className="break-words overflow-hidden">
                              {formatInlineText(header)}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-900/50' : 'bg-gray-800/30'}>
                          {row.map((cell, cellIndex) => (
                            <td 
                              key={cellIndex} 
                              className="border border-gray-600 px-2 py-2 text-gray-200 align-top text-xs"
                              style={{ width: `${100 / headers.length}%` }}
                            >
                              <div className="break-words overflow-hidden leading-tight">
                                {formatInlineText(cell)}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          }
        }
      }
      // Handle horizontal rules
      if (/^[-*_]{3,}$/.test(paragraph.trim())) {
        return (
          <hr key={index} className="my-6 border-gray-600" />
        )
      }

      // Handle blockquotes
      if (paragraph.trim().startsWith('>')) {
        const quoteContent = paragraph
          .split('\n')
          .map(line => line.replace(/^>\s?/, ''))
          .join('\n')
          .trim()
        
        return (
          <blockquote key={index} className="border-l-4 border-pink-500 pl-6 py-2 italic text-gray-300 my-6 bg-gray-800/30 rounded-r-lg">
            {formatInlineText(quoteContent)}
          </blockquote>
        )
      }

      // Handle headers (markdown format)
      if (/^#{1,6}\s+/.test(paragraph.trim())) {
        const headerMatch = paragraph.trim().match(/^(#{1,6})\s+(.+)/)
        if (headerMatch) {
          const level = headerMatch[1].length
          const text = headerMatch[2]
          const HeaderTag = `h${Math.min(level, 6)}`
          const sizeClasses = {
            1: 'text-2xl font-bold text-blue-400 mb-4',
            2: 'text-xl font-bold text-blue-300 mb-3',
            3: 'text-lg font-semibold text-blue-200 mb-3',
            4: 'text-base font-semibold text-gray-200 mb-2',
            5: 'text-sm font-semibold text-gray-300 mb-2',
            6: 'text-sm font-medium text-gray-400 mb-2'
          }
          
          return (
            <div key={index} className={`${sizeClasses[level]} border-b border-gray-700 pb-2`}>
              {formatInlineText(text)}
            </div>
          )
        }
      }

      // Handle lists (both numbered and bulleted) - improved detection
      const hasListItems = paragraph.includes('•') || 
                          paragraph.includes('-') || 
                          /^\s*[\*\-\+]\s+/m.test(paragraph) ||
                          /^\s*\d+\.\s+/m.test(paragraph)
      
      if (hasListItems) {
        const lines = paragraph.split('\n')
        return (
          <div key={index} className="mb-6">
            {lines.map((line, lineIndex) => {
              const trimmedLine = line.trim()
              if (!trimmedLine) return null
              
              // Check if it's a list item (more comprehensive)
              const isListItem = trimmedLine.startsWith('•') || 
                               trimmedLine.startsWith('-') || 
                               trimmedLine.startsWith('*') ||
                               /^\d+\./.test(trimmedLine) ||
                               /^[\*\-\+]\s+/.test(trimmedLine)
              
              if (isListItem) {
                const cleanedListItem = trimmedLine
                  .replace(/^[•\-\*\+\d+\.]\s*/, '')
                  .trim()
                
                return (
                  <div key={lineIndex} className="flex items-start gap-3 mb-3">
                    <span className="text-blue-400 mt-1 flex-shrink-0 font-bold">•</span>
                    <span className="flex-1 leading-relaxed">{formatInlineText(cleanedListItem)}</span>
                  </div>
                )
              } else {
                return (
                  <div key={lineIndex} className="mb-3 leading-relaxed">
                    {formatInlineText(trimmedLine)}
                  </div>
                )
              }
            })}
          </div>
        )
      }
      
      // Handle code blocks
      if (paragraph.includes('```')) {
        const parts = paragraph.split('```')
        return (
          <div key={index} className="mb-4">
            {parts.map((part, partIndex) => {
              if (partIndex % 2 === 1) {
                // This is a code block
                return (
                  <pre key={partIndex} className="bg-gray-800 border border-gray-700 rounded-lg p-4 my-3 overflow-x-auto">
                    <code className="text-green-400 text-sm font-mono whitespace-pre">
                      {part.trim()}
                    </code>
                  </pre>
                )
              } else {
                // Regular text
                return part.trim() ? (
                  <div key={partIndex} className="whitespace-pre-wrap">
                    {part.trim()}
                  </div>
                ) : null
              }
            })}
          </div>
        )
      }

      
      return (
        <div key={index} className="mb-6 leading-relaxed">
          <div className="whitespace-pre-wrap">
            {formatInlineText(paragraph)}
          </div>
        </div>
      )
    })
  }

  return (
    <div className="message-content group">
      <div className="typography-enhanced formatted-text">
        {formatContent(content)}
        {isStreaming && (
          <span className="inline-block w-0.5 h-4 bg-primary-500 ml-1 animate-pulse"></span>
        )}
      </div>
      
      {content && !isStreaming && (
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <button
            onClick={copyToClipboard}
            className="p-2 rounded-lg glass-light hover:bg-gray-700/50 transition-all duration-200 flex items-center justify-center"
            title="Copy message"
          >
            {copied ? (
              <Check size={16} className="text-green-400" />
            ) : (
              <Copy size={16} className="text-gray-400 hover:text-gray-200" />
            )}
          </button>
        </div>
      )}
    </div>
  )
}