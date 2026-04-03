import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Lock, User } from 'lucide-react'
import '../Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const success = await login(username, password)
      if (!success) {
        setError('Invalid username or password')
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-background">
        <img src="/background.jpg" alt="Background" className="login-bg-image" />
        <div className="login-overlay">
          <div className="login-brand">
            <h1 className="login-title">DockPull</h1>
            <p className="login-subtitle">A lightweight Docker image management system for pulling and organizing container images with ease</p>
          </div>
        </div>
      </div>
      <div className="login-form-container">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <h2>Sign In</h2>
            <p>Enter your credentials to access the system</p>
          </div>
          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="login-error">{error}</div>}
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <div className="login-input-wrapper">
                <User size={18} className="login-input-icon" />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                  autoComplete="username"
                />
              </div>
            </div>
            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrapper">
                <Lock size={18} className="login-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}