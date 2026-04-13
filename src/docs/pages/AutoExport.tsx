import { useEffect } from 'react'
import { Check, Sparkles } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function AutoExport() {
  useEffect(() => {
    document.title = 'Auto Export - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Core Features</span>
        </div>
        <h1 className="doc-page-title">Auto Export</h1>
        <p className="doc-page-description">
          Automatically export pulled images to a specified directory. Streamline your CI/CD pipeline with hands-free exports.
        </p>
      </div>

      <div className="doc-content">
        <h2>How It Works</h2>
        <p>
          Auto Export automatically saves successfully pulled images to your configured export directory,
          eliminating the need for manual downloads.
        </p>

        <div className="doc-step-list">
          <div className="doc-step">
            <div className="doc-step-number">1</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Enable Auto Export</h3>
              <p className="doc-step-description">
                Toggle Auto Export when adding an image. This can also be set as the default in Settings.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">2</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Configure Export Path</h3>
              <p className="doc-step-description">
                Set your default export path in <a href="/docs/settings">Settings</a>.
                Make sure DockerPull has write permissions to this directory.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">3</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Automatic Export</h3>
              <p className="doc-step-description">
                Images export automatically after successful pull. Check the Export Status column for confirmation.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">4</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Webhook Notification</h3>
              <p className="doc-step-description">
                Optionally configure webhooks to be notified when exports complete.
              </p>
            </div>
          </div>
        </div>

        <h2>File Naming Convention</h2>
        <p>
          Exported files follow a consistent naming pattern:
        </p>

        <CodeBlock
          title="File Naming Pattern"
          language="Text"
          code={`{name}_{tag}_{platform}.tar

Examples:
├── nginx_latest_linux-amd64.tar
├── nginx_latest_linux-arm64.tar
├── ghcr.io_myorg_myapp_v1.0.0_linux-amd64.tar`}
        />

        <div className="doc-callout doc-callout-info">
          <div className="doc-callout-icon">
            <Check size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Note</div>
            <p className="doc-callout-text">
              Registry prefixes (like <code className="doc-inline-code">ghcr.io</code> or{' '}
              <code className="doc-inline-code">quay.io</code>) are sanitized in the filename
              for filesystem compatibility.
            </p>
          </div>
        </div>

        <h2>Export Status</h2>
        <p>
          Track the export status of your images in the Images table:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-badge doc-badge-pending">—</span></td>
                <td>No export configured</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-pulling">Pending</span></td>
                <td>Waiting for pull to complete</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-success">Exported</span></td>
                <td>Successfully exported to path</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-failed">Failed</span></td>
                <td>Export failed (check permissions)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              Set up a webhook to trigger your CI/CD pipeline when images are exported.
              This enables fully automated workflows from image pull to deployment.
            </p>
          </div>
        </div>

        <h2>Volume Mounting</h2>
        <p>
          When using Docker, mount your export directory as a volume for persistence:
        </p>

        <CodeBlock
          title="Docker Compose"
          language="YAML"
          code={`services:
  dockpull:
    volumes:
      - ./exports:/app/exports
      - /shared/images:/app/exports/shared  # Mount to shared location`}
        />
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/multi-platform" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Multi-Platform</span>
        </a>
        <a href="/docs/webhooks" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">Webhooks →</span>
        </a>
      </div>
    </div>
  )
}
