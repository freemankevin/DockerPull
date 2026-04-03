import { useState } from 'react'
import { Plus, Trash2, Download, RefreshCw, Clock, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { useImages } from '../hooks/useImages'
import { useNotification } from '../context/NotificationContext'
import { imagesApi } from '../api'
import type { Image } from '../types'

const platformOptions = [
  { value: 'linux/amd64', label: 'linux/amd64' },
  { value: 'linux/arm64', label: 'linux/arm64' },
]

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
  const { addNotification } = useNotification()
  const [showModal, setShowModal] = useState(false)
  const [batchMode, setBatchMode] = useState(false)
  const [formData, setFormData] = useState({
    fullName: '',
    platforms: ['linux/amd64', 'linux/arm64'],
    is_auto_export: false,
  })
  const [batchText, setBatchText] = useState('')

  const handlePlatformToggle = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }))
  }

  const parseImageName = (fullName: string) => {
    const parts = fullName.split(':')
    const name = parts[0].trim()
    const tag = parts[1]?.trim() || 'latest'
    return { name, tag }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    let platformsToPull = formData.platforms
    
    const firstImage = batchMode ? batchText.split('\n')[0].trim() : formData.fullName
    if (firstImage && platformsToPull.includes('linux/arm64')) {
      const { name, tag } = parseImageName(firstImage)
      try {
        const checkRes = await imagesApi.checkPlatforms(name, tag)
        const supportedPlatforms = checkRes.data.platforms || []
        
        if (!supportedPlatforms.includes('linux/arm64')) {
          addNotification('error', `镜像不支持 linux/arm64 架构，将只拉取 linux/amd64`)
          platformsToPull = platformsToPull.filter(p => p !== 'linux/arm64')
        }
      } catch (err) {
        addNotification('info', '无法校验镜像架构，将继续拉取所选平台')
      }
    }
    
    if (batchMode) {
      const lines = batchText.split('\n').filter(line => line.trim())
      for (const line of lines) {
        const { name, tag } = parseImageName(line)
        for (const platform of platformsToPull) {
          await createImage({ name, tag, platform, is_auto_export: formData.is_auto_export })
        }
      }
      addNotification('success', `Added ${lines.length * platformsToPull.length} images`)
    } else {
      const { name, tag } = parseImageName(formData.fullName)
      for (const platform of platformsToPull) {
        await createImage({ name, tag, platform, is_auto_export: formData.is_auto_export })
      }
      addNotification('success', `Added ${platformsToPull.length} image(s)`)
    }
    setShowModal(false)
    setFormData({ fullName: '', platforms: ['linux/amd64', 'linux/arm64'], is_auto_export: false })
    setBatchText('')
  }

  return (
    <div>
      <div className="page-header">
        <h1>Images</h1>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> NEW
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Image</th>
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
                <td><code>{img.name}:{img.tag}</code></td>
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
          </tbody>
        </table>
        {images.length === 0 && (
          <div className="empty-state clickable" onClick={() => setShowModal(true)}>
            <div className="empty-state-icon">
              <Plus size={48} strokeWidth={1.5} />
            </div>
            <div className="empty-state-title">Add a New Image</div>
            <div className="empty-state-description">
              Pull and manage Docker images. Add your first image to get started with container deployment.
            </div>
          </div>
        )}
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
                    Batch mode (one per line)
                  </label>
                </div>

                {batchMode ? (
                  <div className="form-group">
                    <label>Images</label>
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
                    <label>Image</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="nginx:latest"
                      required
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
