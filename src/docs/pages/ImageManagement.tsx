import { useEffect } from 'react'
import { Check, Sparkles } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function ImageManagement() {
  useEffect(() => {
    document.title = 'Image Management - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Core Features</span>
        </div>
        <h1 className="doc-page-title">Image Management</h1>
        <p className="doc-page-description">
          Learn how to add, monitor, and manage container images across multiple registries and platforms.
        </p>
      </div>

      <div className="doc-content">
        <h2>Adding Images</h2>
        <p>
          DockerPull supports multiple image formats from various container registries.
          You can add images individually or in batch mode.
        </p>

        <h3>Supported Formats</h3>
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Format</th>
                <th>Registry</th>
                <th>Auth Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">nginx:latest</code></td>
                <td>Docker Hub</td>
                <td>Optional</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">docker.io/library/nginx:latest</code></td>
                <td>Docker Hub (explicit)</td>
                <td>Optional</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">ghcr.io/owner/repo:v1.0</code></td>
                <td>GitHub Container Registry</td>
                <td>Recommended</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">quay.io/org/image:tag</code></td>
                <td>Quay.io</td>
                <td>For private</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">registry.cn-hangzhou.aliyuncs.com/...</code></td>
                <td>Alibaba ACR</td>
                <td>For private</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">public.ecr.aws/...</code></td>
                <td>AWS ECR Public</td>
                <td>No</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.amazonaws.com/...</code></td>
                <td>AWS ECR Private</td>
                <td>Required</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.pkg.dev/...</code></td>
                <td>Google Artifact Registry</td>
                <td>For private</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Batch Mode</h3>
        <p>
          Add multiple images at once by toggling batch mode. Enter one image per line:
        </p>

        <CodeBlock
          title="Example Batch Input"
          language="Text"
          code={`nginx:latest
redis:7-alpine
ghcr.io/myorg/myapp:v2.1.0
quay.io/prometheus/prometheus:v2.45.0`}
        />

        <div className="doc-callout doc-callout-info">
          <div className="doc-callout-icon">
            <Check size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Note</div>
            <p className="doc-callout-text">
              Duplicates are automatically skipped with a summary of added vs. skipped items.
              Each image in batch mode uses the same platform selection.
            </p>
          </div>
        </div>

        <h2>Status Types</h2>
        <p>
          Images progress through different states during their lifecycle:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-badge doc-badge-pending">Pending</span></td>
                <td>Queued for processing</td>
                <td>Wait for processing to start</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-pulling">Pulling</span></td>
                <td>Currently downloading</td>
                <td>Monitor progress in logs</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-success">Success</span></td>
                <td>Successfully pulled</td>
                <td>Ready for export or use</td>
              </tr>
              <tr>
                <td><span className="doc-badge doc-badge-failed">Failed</span></td>
                <td>Pull failed</td>
                <td>Check logs and retry</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Platform Selection</h2>
        <p>
          When adding an image, you can select which platforms to pull:
        </p>

        <ul>
          <li><strong>linux/amd64</strong> - Standard x86_64 architecture</li>
          <li><strong>linux/arm64</strong> - ARM64 architecture for Apple Silicon, AWS Graviton, etc.</li>
        </ul>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              Click the <strong>Retry</strong> button on failed images to attempt another pull
              with the same configuration. This preserves your original settings.
            </p>
          </div>
        </div>

        <h2>Managing Images</h2>
        <p>
          The Images page provides a comprehensive view of all your images with the following actions:
        </p>

        <ul>
          <li><strong>Pull</strong> - Manually trigger a pull for pending or failed images</li>
          <li><strong>Export</strong> - Download the image as a tar file</li>
          <li><strong>Delete</strong> - Remove the image from DockerPull</li>
          <li><strong>View Logs</strong> - Check detailed pull logs</li>
        </ul>

        <h2>Auto-Export</h2>
        <p>
          Enable auto-export when adding an image to automatically export it after a successful pull.
          Configure the default export path in <a href="/docs/settings">Settings</a>.
        </p>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/installation" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Installation</span>
        </a>
        <a href="/docs/multi-platform" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">Multi-Platform →</span>
        </a>
      </div>
    </div>
  )
}
