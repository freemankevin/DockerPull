import { useState } from 'react'
import { Sun, Moon, Package, Settings, BarChart3 } from 'lucide-react'
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom'
import Images from './pages/Images'
import SettingsPage from './pages/Settings'
import Stats from './pages/Stats'
import './App.css'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <Router>
      <div className={`app ${isDarkMode ? 'dark' : ''}`}>
        <nav className="sidebar">
          <div className="logo">
            <img src="/logo.png" alt="DockPull" className="logo-image" />
            <span>DockPull</span>
          </div>
          <ul className="nav-links">
            <li>
              <NavLink to="/" end>
                <Package size={18} />
                <span>Images</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/stats">
                <BarChart3 size={18} />
                <span>Stats</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/settings">
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <main className="content">
          <div className="content-header">
            <div className="content-header-spacer"></div>
            <button className="theme-toggle" onClick={toggleDarkMode} title="Toggle theme">
              {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
          <Routes>
            <Route path="/" element={<Images />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
