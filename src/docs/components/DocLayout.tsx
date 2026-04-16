import React, { useState, useEffect, useRef, useMemo } from 'react'
import { NavLink, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { Menu, X, Search, FileText, Sun, Moon, Globe } from 'lucide-react'
import { docSections } from '../data'
import { searchDocs, getExcerpt } from '../searchData'
import { useLanguage } from '../../context/LanguageContext'
import './DocLayout.css'

export default function DocLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [showLangMenu, setShowLangMenu] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('dockpull-theme')
    if (saved === 'dark' || saved === 'light') {
      return saved === 'dark'
    }
    return document.documentElement.getAttribute('data-theme') === 'dark'
  })
  const { language, setLanguage, t } = useLanguage()
  const location = useLocation()
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const langMenuRef = useRef<HTMLDivElement>(null)

  // Filter search results using fuzzy search
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchDocs(searchQuery)
  }, [searchQuery])

  // Toggle dark mode
  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    const theme = newMode ? 'dark' : 'light'
    localStorage.setItem('dockpull-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }

  // Initialize theme on mount
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', theme)
  }, [])

  // Close mobile menu and search on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
    setShowSearchResults(false)
    setSearchQuery('')
  }, [location.pathname])

  // Handle keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchInputRef.current?.focus()
        setShowSearchResults(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Handle click outside search to close results
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchResults(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setShowLangMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showLangMenu])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchResults.length > 0) {
      navigate(searchResults[0].path)
      setShowSearchResults(false)
    }
  }

  const handleResultClick = (path: string) => {
    navigate(path)
    setShowSearchResults(false)
    setSearchQuery('')
  }

  const handleLanguageChange = (lang: 'en' | 'zh') => {
    setLanguage(lang)
    setShowLangMenu(false)
  }

  // Highlight matching text in search results
  const highlightMatch = (text: string, query: string): React.ReactNode => {
    if (!query.trim()) return text
    const terms = query.trim().split(/\s+/).filter(Boolean)
    if (terms.length === 0) return text
    
    const escapedTerms = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi')
    const parts = text.split(regex)
    
    return (
      <>
        {parts.map((part, i) => {
          const isMatch = terms.some(t => part.toLowerCase() === t.toLowerCase())
          return isMatch ? (
            <mark key={i} className="doc-search-highlight">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        })}
      </>
    )
  }

  return (
    <div className="doc-root">
      {/* Header */}
      <header className="doc-header">
        <div className="doc-header-container">
          {/* Left - empty */}
          <div className="doc-header-left" />

          {/* Center - empty */}
          <div className="doc-header-center" />

          {/* Right - Search, Language Toggle, Theme Toggle & GitHub */}
          <div className="doc-header-right">
            {/* Search */}
            <div ref={searchContainerRef} className={`doc-search-container ${isSearchFocused ? 'doc-search-focused' : ''}`}>
              <form className="doc-search-form" onSubmit={handleSearch}>
                <Search size={14} className="doc-search-icon" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="doc-search-input"
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSearchResults(true)
                  }}
                  onFocus={() => {
                    setIsSearchFocused(true)
                    setShowSearchResults(true)
                  }}
                  onBlur={() => setIsSearchFocused(false)}
                />
                <kbd className="doc-search-kbd">⌘ K</kbd>
              </form>

              {/* Search Results Dropdown */}
              {showSearchResults && (
                <div className="doc-search-results">
                  {searchQuery.trim() ? (
                    searchResults.length > 0 ? (
                      <ul className="doc-search-results-list">
                        {searchResults.map((item) => (
                          <li key={item.path}>
                            <button
                              className="doc-search-result-item"
                              onClick={() => handleResultClick(item.path)}
                            >
                              <div className="doc-search-result-header">
                                <FileText size={14} className="doc-search-result-icon" />
                                <span className="doc-search-result-title">
                                  {highlightMatch(item.title, searchQuery)}
                                </span>
                              </div>
                              <span className="doc-search-result-excerpt">
                                {highlightMatch(getExcerpt(item, searchQuery), searchQuery)}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="doc-search-no-results">{t('search.noResults')} "{searchQuery}"</div>
                    )
                  ) : (
                    <div className="doc-search-hint">{t('search.hint')}</div>
                  )}
                </div>
              )}
            </div>
            
            {/* Language Toggle */}
            <div ref={langMenuRef} className="doc-lang-container">
              <button
                type="button"
                className="doc-header-link doc-lang-toggle"
                onClick={() => setShowLangMenu(!showLangMenu)}
                aria-label={t('lang.switch')}
                title={t('lang.switch')}
              >
                <Globe size={18} />
                <span className="doc-lang-label">{language === 'zh' ? '中' : 'EN'}</span>
              </button>
              {showLangMenu && (
                <div className="doc-lang-menu">
                  <button
                    className={`doc-lang-item ${language === 'en' ? 'doc-lang-item-active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    {t('lang.en')}
                  </button>
                  <button
                    className={`doc-lang-item ${language === 'zh' ? 'doc-lang-item-active' : ''}`}
                    onClick={() => handleLanguageChange('zh')}
                  >
                    {t('lang.zh')}
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              className="doc-header-link"
              onClick={toggleTheme}
              aria-label={isDarkMode ? t('theme.light') : t('theme.dark')}
              title={isDarkMode ? t('theme.light') : t('theme.dark')}
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* GitHub */}
            <a
              href="https://github.com/freemankevin/DockerPull"
              target="_blank"
              rel="noopener noreferrer"
              className="doc-header-link"
              aria-label="GitHub"
              title="GitHub"
            >
              <svg viewBox="0 0 496 512" width="20" height="20" fill="currentColor">
                <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 363 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2.3z"/>
              </svg>
            </a>

            {/* Mobile Menu Button */}
            <button
              className="doc-mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="doc-mobile-overlay"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <div className="doc-container">
        {/* Sidebar */}
        <aside className={`doc-sidebar ${isMobileMenuOpen ? 'doc-sidebar-open' : ''}`}>
          {/* Logo */}
          <div className="doc-sidebar-logo">
            <a href="/" className="doc-logo">
              <img src="/logo.png" alt="DockerPull" className="doc-logo-img" />
              <span className="doc-logo-text">DockerPull</span>
            </a>
          </div>

          <nav className="doc-nav">
            {docSections.map((section) => (
              <div key={section.titleKey} className="doc-nav-section">
                <h3 className="doc-nav-section-title">{t(section.titleKey)}</h3>
                <ul className="doc-nav-list">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `doc-nav-link ${isActive ? 'doc-nav-link-active' : ''}`
                        }
                      >
                        <item.icon size={16} className="doc-nav-link-icon" />
                        <span className="doc-nav-link-text">{t(item.titleKey)}</span>
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          </aside>

        {/* Main Content */}
        <main className="doc-main">
          <div className="doc-content-wrapper">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
