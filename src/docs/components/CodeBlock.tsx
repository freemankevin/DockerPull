import { useState, useCallback, useEffect, useRef } from 'react'
import { Check, Copy } from 'lucide-react'
import Prism from 'prismjs'

// Import Prism languages
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-markdown'

interface CodeBlockProps {
  code: string
  title?: string
  language?: string
}

const languageMap: Record<string, string> = {
  'yaml': 'yaml',
  'yml': 'yaml',
  'bash': 'bash',
  'sh': 'bash',
  'shell': 'bash',
  'json': 'json',
  'js': 'javascript',
  'javascript': 'javascript',
  'ts': 'typescript',
  'typescript': 'typescript',
  'go': 'go',
  'docker': 'docker',
  'dockerfile': 'docker',
  'md': 'markdown',
  'markdown': 'markdown',
}

export default function CodeBlock({ code, title, language }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)
  const codeRef = useRef<HTMLElement>(null)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }, [code])

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current)
    }
  }, [code, language])

  const prismLanguage = language ? (languageMap[language.toLowerCase()] || 'plaintext') : 'plaintext'

  return (
    <div className="doc-code-block">
      <div className="doc-code-header">
        <div className="doc-code-header-left">
          {title && <span className="doc-code-title">{title}</span>}
          {language && !title && <span className="doc-code-title">{language}</span>}
        </div>
        <div className="doc-code-header-right">
          {language && title && <span className="doc-code-lang">{language}</span>}
          <button
            className="doc-code-copy-btn"
            onClick={handleCopy}
            aria-label={copied ? 'Copied!' : 'Copy code'}
            title={copied ? 'Copied!' : 'Copy code'}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>
      <pre className="doc-code-pre">
        <code ref={codeRef} className={`language-${prismLanguage}`}>
          {code}
        </code>
      </pre>
    </div>
  )
}
