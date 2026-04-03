import { useState } from 'react'
import { Save, TestTube, Folder } from 'lucide-react'
import { useConfig } from '../hooks/useConfig'
import { webhookApi } from '../api'

export default function Settings() {
  const { config, loading, updateConfig } = useConfig()
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState<any>({})

  if (loading || !config) {
    return (
      <div className="content-box">
        <div className="empty-state">
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await updateConfig({ ...config, ...formData })
    setSaving(false)
    setFormData({})
    alert('Settings saved successfully')
  }

  const handleTestWebhook = async () => {
    try {
      await webhookApi.test()
      alert('Test webhook sent successfully')
    } catch (err: any) {
      alert('Failed to send: ' + err.message)
    }
  }

  const handleBrowseFolder = async () => {
    try {
      // @ts-ignore - showDirectoryPicker is a modern API
      const dirHandle = await window.showDirectoryPicker?.()
      if (dirHandle) {
        const path = dirHandle.name
        setFormData({ ...formData, export_path: path })
      }
    } catch (err) {
      // User cancelled or API not supported
    }
  }

  const getValue = (key: string) => formData[key] ?? config[key as keyof typeof config]

  return (
    <div>
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="content-box">
        <form onSubmit={handleSubmit}>
          <div className="settings-section">
            <h3 className="section-title">General</h3>

            <div className="form-group">
              <label>Export Directory</label>
              <div className="input-with-button">
                <input
                  type="text"
                  className="form-control"
                  value={getValue('export_path')}
                  onChange={(e) => setFormData({ ...formData, export_path: e.target.value })}
                  placeholder="/path/to/exports"
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleBrowseFolder}
                  title="Browse folder"
                >
                  <Folder size={16} />
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Default Platform</label>
              <select
                className="form-control"
                value={getValue('default_platform')}
                onChange={(e) => setFormData({ ...formData, default_platform: e.target.value })}
              >
                <option value="linux/amd64">linux/amd64</option>
                <option value="linux/arm64">linux/arm64</option>
                <option value="linux/arm/v7">linux/arm/v7</option>
                <option value="linux/386">linux/386</option>
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Concurrent Pulls</label>
                <input
                  type="number"
                  className="form-control"
                  value={getValue('concurrent_pulls')}
                  onChange={(e) => setFormData({ ...formData, concurrent_pulls: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                />
              </div>
              <div className="form-group">
                <label>Gzip Compression (1-9)</label>
                <input
                  type="number"
                  className="form-control"
                  value={getValue('gzip_compression')}
                  onChange={(e) => setFormData({ ...formData, gzip_compression: parseInt(e.target.value) })}
                  min={1}
                  max={9}
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">Retry Settings</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Max Retries (0 = unlimited)</label>
                <input
                  type="number"
                  className="form-control"
                  value={getValue('retry_max_attempts')}
                  onChange={(e) => setFormData({ ...formData, retry_max_attempts: parseInt(e.target.value) })}
                  min={0}
                />
              </div>
              <div className="form-group">
                <label>Retry Interval (seconds)</label>
                <input
                  type="number"
                  className="form-control"
                  value={getValue('retry_interval_sec')}
                  onChange={(e) => setFormData({ ...formData, retry_interval_sec: parseInt(e.target.value) })}
                  min={1}
                />
              </div>
            </div>
          </div>

          <div className="settings-section">
            <h3 className="section-title">Webhook Notifications</h3>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={getValue('enable_webhook')}
                  onChange={(e) => setFormData({ ...formData, enable_webhook: e.target.checked })}
                />
                Enable webhook notifications
              </label>
            </div>

            <div className="form-group">
              <label>Webhook Type</label>
              <select
                className="form-control"
                value={getValue('webhook_type')}
                onChange={(e) => setFormData({ ...formData, webhook_type: e.target.value })}
                disabled={!getValue('enable_webhook')}
              >
                <option value="dingtalk">DingTalk</option>
                <option value="feishu">Lark (Feishu)</option>
                <option value="wechat">WeChat Work</option>
              </select>
            </div>

            <div className="form-group">
              <label>Webhook URL</label>
              <input
                type="text"
                className="form-control"
                value={getValue('webhook_url')}
                onChange={(e) => setFormData({ ...formData, webhook_url: e.target.value })}
                placeholder="https://..."
                disabled={!getValue('enable_webhook')}
              />
            </div>
          </div>

          <div className="button-group">
            <button type="submit" className="btn btn-primary" disabled={saving}>
              <Save size={16} /> {saving ? 'Saving...' : 'Save Settings'}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleTestWebhook}
              disabled={!getValue('enable_webhook')}
            >
              <TestTube size={16} /> Test Webhook
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
