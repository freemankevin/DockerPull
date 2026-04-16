import { Package, Settings, BarChart3, FileText, BookOpen, ExternalLink } from 'lucide-react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Images from './pages/Images'
import SettingsPage from './pages/Settings'
import Stats from './pages/Stats'
import Logs from './pages/Logs'
import Login from './pages/Login'
import { AuthProvider, useAuth } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import { NotificationBell } from './context/NotificationBell'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { UserMenu } from './context/UserMenu'
import { DocLayout } from './docs'
import {
  Introduction,
  QuickStart,
  Installation,
  ImageManagement,
  MultiPlatform,
  AutoExport,
  Webhooks,
  Settings as DocSettings,
  Registries,
  Tokens,
  ApiReference
} from './docs/pages'
import './App.css'

function MainApp() {
  const { t, language } = useLanguage()
  
  return (
    <div className="app-layout">
      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <div className="logo">
          <img src="/logo.png" alt="DockerPull" className="logo-image" />
        </div>

        <ul className="nav-links">
          <li className="nav-top-divider">
            <NavLink to="/stats">
              <BarChart3 size={18} strokeWidth={1.75} />
              <span>{t('nav.overview')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/" end>
              <Package size={18} strokeWidth={1.75} />
              <span>{t('nav.images')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/logs">
              <FileText size={18} strokeWidth={1.75} />
              <span>{t('nav.logs')}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings">
              <Settings size={18} strokeWidth={1.75} />
              <span>{t('nav.settings')}</span>
            </NavLink>
          </li>
          <li className="nav-divider">
            <a
              href="/docs/introduction"
              className="docs-link"
              onClick={(e) => {
                e.preventDefault()
                window.location.href = '/docs/introduction'
              }}
            >
              <BookOpen size={18} strokeWidth={1.75} />
              <span>{t('nav.docs')}</span>
              <ExternalLink size={12} className="docs-link-icon" />
            </a>
          </li>
        </ul>

        <div className="sidebar-footer">
          <UserMenu />
        </div>
      </aside>

      {/* ── Main Wrapper (右侧容器，带 margin) ── */}
      <main className="main-wrapper">
        {/* 独立的顶部通知区域 */}
        <div className="top-bar">
          <NotificationBell />
          <div className="top-bar-divider"></div>
          <div className="top-bar-date">
            {new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US', {
              year: 'numeric',
              month: language === 'zh' ? 'long' : 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>

        {/* ── Content Card (白色卡片容器) ── */}
        <div className="content-card">
          {/* Card Body */}
          <div className="card-body">
            <Routes>
              <Route path="/"         element={<Images />} />
              <Route path="/logs"     element={<Logs />} />
              <Route path="/stats"    element={<Stats />} />
              <Route path="/settings" element={<SettingsPage />} />
              {/* Docs routes - independent layout */}
              <Route path="/docs" element={<DocLayout />}>
                <Route index element={<Introduction />} />
                <Route path="introduction"    element={<Introduction />} />
                <Route path="quick-start"     element={<QuickStart />} />
                <Route path="installation"    element={<Installation />} />
                <Route path="image-management" element={<ImageManagement />} />
                <Route path="multi-platform"  element={<MultiPlatform />} />
                <Route path="auto-export"     element={<AutoExport />} />
                <Route path="webhooks"        element={<Webhooks />} />
                <Route path="settings"        element={<DocSettings />} />
                <Route path="registries"      element={<Registries />} />
                <Route path="tokens"          element={<Tokens />} />
                <Route path="api-reference"   element={<ApiReference />} />
              </Route>
            </Routes>
          </div>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
            <AppContent />
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

function AppContent() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <NotificationProvider>
              <Login />
            </NotificationProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    )
  }

  return (
    <ToastProvider>
      <NotificationProvider>
        <MainApp />
      </NotificationProvider>
    </ToastProvider>
  )
}

export default App
