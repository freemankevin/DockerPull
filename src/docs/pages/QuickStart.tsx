import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import '../components/DocPage.css'

export default function QuickStart() {
  useEffect(() => {
    document.title = 'Quick Start - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Getting Started</span>
        </div>
        <h1 className="doc-page-title">Quick Start</h1>
        <p className="doc-page-description">
          Get up and running with DockerPull in under 5 minutes. Follow these simple steps to start managing your container images.
        </p>
      </div>

      <div className="doc-content">
        {/* Step 1 */}
        <div className="doc-step-list">
          <div className="doc-step">
            <div className="doc-step-number">1</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Access the Dashboard</h3>
              <p className="doc-step-description">
                After logging in, you will see the <strong>Overview</strong> page displaying
                real-time statistics about your image operations. This gives you a quick
                snapshot of your current activities.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">2</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Add Your First Image</h3>
              <p className="doc-step-description">
                Navigate to the <strong>Images</strong> page and click the <strong>Add</strong> button.
              </p>
              <ul>
                <li>Enter the full image name (e.g., <code className="doc-inline-code">nginx:latest</code>)</li>
                <li>Select target platforms (amd64, arm64, or both)</li>
                <li>Enable auto-export if needed</li>
                <li>Click Add to start pulling</li>
              </ul>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">3</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Monitor Progress</h3>
              <p className="doc-step-description">
                Image status updates in real-time. You can track the progress of your pulls
                and see when they complete.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '16px' }}>
                <span className="doc-badge doc-badge-pending">Pending</span>
                <span className="doc-badge doc-badge-pulling">Pulling</span>
                <span className="doc-badge doc-badge-success">Success</span>
                <span className="doc-badge doc-badge-failed">Failed</span>
              </div>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">4</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Export Images</h3>
              <p className="doc-step-description">
                Once successfully pulled, click the <strong>Download</strong> button to export
                the image as a tar file. The file will be saved to your configured export path.
              </p>
            </div>
          </div>
        </div>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              Use the <code className="doc-inline-code">batch mode</code> to add multiple images at once
              — perfect for initial setup! Duplicates are automatically skipped with a summary
              of added vs. skipped items.
            </p>
          </div>
        </div>

        <h2>Common Image Formats</h2>
        <p>
          DockerPull supports various image naming formats from different registries:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Format</th>
                <th>Registry</th>
                <th>Example</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">image:tag</code></td>
                <td>Docker Hub</td>
                <td><code className="doc-inline-code">nginx:latest</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">docker.io/...</code></td>
                <td>Docker Hub (explicit)</td>
                <td><code className="doc-inline-code">docker.io/library/nginx:latest</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">ghcr.io/...</code></td>
                <td>GitHub Container Registry</td>
                <td><code className="doc-inline-code">ghcr.io/owner/repo:v1.0</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">quay.io/...</code></td>
                <td>Quay.io</td>
                <td><code className="doc-inline-code">quay.io/org/image:tag</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">registry.cn-*.aliyuncs.com/...</code></td>
                <td>Alibaba ACR</td>
                <td><code className="doc-inline-code">registry.cn-hangzhou.aliyuncs.com/myapp:v1</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">public.ecr.aws/...</code></td>
                <td>AWS ECR Public</td>
                <td><code className="doc-inline-code">public.ecr.aws/nginx/nginx:latest</code></td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.pkg.dev/...</code></td>
                <td>Google GAR</td>
                <td><code className="doc-inline-code">us-docker.pkg.dev/project/repo/image:tag</code></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Next Steps</h2>
        <p>
          Now that you have successfully pulled your first image, explore the following topics
          to get the most out of DockerPull:
        </p>

        <ul>
          <li>Configure <a href="/docs/auto-export">auto-export</a> for automated workflows</li>
          <li>Set up <a href="/docs/webhooks">webhook notifications</a> for real-time updates</li>
          <li>Learn about <a href="/docs/multi-platform">multi-platform</a> image support</li>
          <li>Review the <a href="/docs/api-reference">API reference</a> for programmatic access</li>
        </ul>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/introduction" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Introduction</span>
        </a>
        <a href="/docs/installation" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">Installation →</span>
        </a>
      </div>
    </div>
  )
}
