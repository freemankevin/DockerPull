import { useEffect } from 'react'
import { Settings as SettingsIcon, Sparkles } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function SettingsPage() {
  useEffect(() => {
    document.title = 'Settings - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Configuration</span>
        </div>
        <h1 className="doc-page-title">Settings</h1>
        <p className="doc-page-description">
          Configure DockerPull to match your workflow. Customize export paths, default platforms, and notification preferences.
        </p>
      </div>

      <div className="doc-content">
        <h2>General Settings</h2>
        <p>
          These settings control the default behavior of DockerPull:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Setting</th>
                <th>Description</th>
                <th>Default</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Export Path</td>
                <td>Directory for exported images</td>
                <td><code className="doc-inline-code">/app/exports</code></td>
              </tr>
              <tr>
                <td>Default Platform</td>
                <td>Pre-selected platforms for new images</td>
                <td>amd64, arm64</td>
              </tr>
              <tr>
                <td>Max Retries</td>
                <td>Retry attempts for failed pulls</td>
                <td>3</td>
              </tr>
              <tr>
                <td>Auto Export</td>
                <td>Auto-export on success by default</td>
                <td>Disabled</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Export Configuration</h2>
        <p>
          The export path is where all exported images are saved. Make sure:
        </p>

        <ul>
          <li>The directory exists and is writable by DockerPull</li>
          <li>There is sufficient disk space for your images</li>
          <li>Consider mounting this to a shared location for easy access</li>
        </ul>

        <CodeBlock
          title="Docker Volume Mount"
          language="YAML"
          code={`volumes:
  # Local directory
  - ./exports:/app/exports
  
  # Network share
  - /mnt/shared/images:/app/exports
  
  # Named volume
  - dockpull-exports:/app/exports`}
        />

        <h2>Platform Defaults</h2>
        <p>
          Set which platforms are pre-selected when adding new images:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Option</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>linux/amd64 only</td>
                <td>Select only x86_64 by default</td>
              </tr>
              <tr>
                <td>linux/arm64 only</td>
                <td>Select only ARM64 by default</td>
              </tr>
              <tr>
                <td>Both</td>
                <td>Select both platforms by default</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="doc-callout doc-callout-info">
          <div className="doc-callout-icon">
            <SettingsIcon size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Configuration Note</div>
            <p className="doc-callout-text">
              Settings are stored in the SQLite database and persist across restarts.
              Changes take effect immediately for new operations.
            </p>
          </div>
        </div>

        <h2>Retry Configuration</h2>
        <p>
          Configure how DockerPull handles failed pull attempts:
        </p>

        <ul>
          <li><strong>Max Retries</strong> - Number of retry attempts (0-10)</li>
          <li><strong>Retry Delay</strong> - Seconds between retry attempts</li>
          <li><strong>Exponential Backoff</strong> - Increase delay between retries</li>
        </ul>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              Enable auto-export for hands-off workflows. Combined with webhooks, this creates
              a fully automated pipeline from image pull to deployment trigger.
            </p>
          </div>
        </div>

        <h2>Environment Variables</h2>
        <p>
          Some settings can also be configured via environment variables:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Setting</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">EXPORT_PATH</code></td>
                <td>Default export directory</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">DEFAULT_PLATFORMS</code></td>
                <td>Comma-separated platform list</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">MAX_RETRIES</code></td>
                <td>Maximum retry attempts</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/webhooks" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Webhooks</span>
        </a>
        <a href="/docs/registries" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">Registries →</span>
        </a>
      </div>
    </div>
  )
}
