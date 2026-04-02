import { useState, useRef, useEffect } from 'react'
import { Plus, Trash2, Download, RefreshCw, Clock, AlertCircle, CheckCircle, Loader2, Package, Bell, X, Check } from 'lucide-react'
import { useImages } from '../hooks/useImages'
import type { Image } from '../types'

const platformOptions = [
  { value: 'linux/amd64', label: 'linux/amd64' },
  { value: 'linux/arm64', label: 'linux/arm64' },
  { value: 'linux/arm/v7', label: 'linux/arm/v7' },
  { value: 'linux/386', label: 'linux/386' },
]

interface Notification {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
  time: Date
}

function getStatusBadge(status: Image['status']) {
  switch (status) {
    case 'pending':
      return <span className="badge badge-pending"><Clock size={12} /> Pending</span>
    case 'pulling':
      return <span className="badge badge-pulling"><Loader2 size={12} className="spin" /> Pulling</span>
    case 'success':
      return <span className="badge badge-success"><CheckCircle size={12} /> Success</span>
    case 'failed':
      return <span className="badge badge-failed"><AlertCircle size={12} /> Failed</span>
    default:
      return <span className="badge">{status}</span>
  }
}

export default function Images() {
  const { images, createImage, deleteImage, pullImage, exportImage } = useImages()
  const [showModal, setShowModal] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    tag: 'latest',
    platforms: ['linux/amd64'],
    is_auto_export: false,
  })
  const [batchText, setBatchText] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const notificationRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const addNotification = (type: Notification['type'], message: string) => {
    const notification: Notification = {
      id: Date.now(),
      type,
      message,
      time: new Date()
    }
    setNotifications(prev => [notification, ...prev])
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (batchMode) {
      const lines = batchText.split('\n').filter(line => line.trim())
      for (const line of lines) {
        const [name, tag = 'latest'] = line.split(':')
        for (const platform of formData.platforms) {
          await createImage({ ...formData, name: name.trim(), tag: tag.trim(), platform })
        }
      }
      addNotification('success', `Added ${lines.length * formData.platforms.length} images`)
    } else {
      for (const platform of formData.platforms) {
        await createImage({ ...formData, platform })
      }
      addNotification('success', `Added ${formData.platforms.length} image(s)`)
    }
    setShowModal(false)
    setFormData({ name: '', tag: 'latest', platforms: ['linux/amd64'], is_auto_export: false })
    setBatchText('')
  }

  return (
    <div>
      <div className="page-header">
        <h1>Images</h1>
        <div className="page-header-actions">
          <div className="notification-wrapper" ref={notificationRef}>
            <button 
              className="btn btn-ghost notification-btn" 
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={16} />
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <span>Notifications</span>
                  {notifications.length > 0 && (
                    <button 
                      className="btn btn-ghost btn-sm"
                      onClick={() => setNotifications([])}
                    >
                      Clear all
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="notification-empty">No notifications</div>
                  ) : (
                    notifications.map(notification => (
                      <div key={notification.id} className={`notification-item notification-${notification.type}`}>
                        <div className="notification-content">
                          {notification.type === 'success' && <Check size={14} />}
                          {notification.type === 'error' && <AlertCircle size={14} />}
                          <span>{notification.message}</span>
                        </div>
                        <button 
                          className="notification-close"
                          onClick={() => removeNotification(notification.id)}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> NEW
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image Name</th>
              <th>Tag</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Retries</th>
              <th>Export Path</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {images.map((img) => (
              <tr key={img.id}>
                <td><code>{img.name}</code></td>
                <td>{img.tag}</td>
                <td>{img.platform}</td>
                <td>{getStatusBadge(img.status)}</td>
                <td>{img.retry_count}</td>
                <td>
                  {img.export_path ? (
                    <span className="text-sm text-gray-600" title={img.export_path}>
                      {img.export_path.split('/').pop()}
                    </span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td>{new Date(img.created_at).toLocaleString()}</td>
                <td>
                  <div className="flex gap-2">
                    {img.status === 'failed' && (
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => pullImage(img.id)}
                        title="Retry pull"
                      >
                        <RefreshCw size={14} />
                      </button>
                    )}
                    {img.status === 'success' && !img.export_path && (
                      <button
                        className="btn btn-sm btn-success"
                        onClick={() => exportImage(img.id)}
                        title="Export"
                      >
                        <Download size={14} />
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteImage(img.id)}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {images.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-8">
                  <div className="empty-state">
                    <Package size={48} className="empty-state-icon" />
                    <p>No images yet. Click "Add Image" to get started.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Image</h2>
              <button className="btn-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={batchMode}
                      onChange={(e) => setBatchMode(e.target.checked)}
                    />
                    Batch mode (one per line: name:tag)
                  </label>
                </div>

                {batchMode ? (
                  <div className="form-group">
                    <label>Image List</label>
                    <textarea
                      className="form-control"
                      rows={6}
                      value={batchText}
                      onChange={(e) => setBatchText(e.target.value)}
                      placeholder="nginx:latest&#10;redis:7-alpine&#10;postgres:15"
                      required
                    />
                  </div>
                ) : (
                  <div className="form-group">
                    <label>Image Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. nginx"
                      required
                    />
                  </div>
                )}

                {!batchMode && (
                  <div className="form-group">
                    <label>Tag</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tag}
                      onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                      placeholder="latest"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label>Platforms</label>
                  <div className="platform-options">
                    {platformOptions.map(opt => (
                      <label 
                        key={opt.value} 
                        className={`platform-option ${formData.platforms.includes(opt.value) ? 'selected' : ''}`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.platforms.includes(opt.value)}
                          onChange={() => handlePlatformToggle(opt.value)}
                        />
                        <span className="platform-option-label">{opt.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.is_auto_export}
                      onChange={(e) => setFormData({ ...formData, is_auto_export: e.target.checked })}
                    />
                    Auto-export after pull
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {batchMode ? 'Add Batch' : 'Add Image'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
