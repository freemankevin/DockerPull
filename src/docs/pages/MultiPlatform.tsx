import { useEffect } from 'react'
import { Container, Sparkles } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function MultiPlatform() {
  useEffect(() => {
    document.title = 'Multi-Platform - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Core Features</span>
        </div>
        <h1 className="doc-page-title">Multi-Platform Support</h1>
        <p className="doc-page-description">
          Handle multi-architecture container images automatically. DockerPull makes it easy to work with images for different CPU architectures.
        </p>
      </div>

      <div className="doc-content">
        <h2>Supported Platforms</h2>
        <p>
          DockerPull automatically handles multiple architectures, making cross-platform deployment seamless.
        </p>

        <div className="doc-feature-grid">
          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Container size={22} />
            </div>
            <h3 className="doc-feature-title">linux/amd64</h3>
            <p className="doc-feature-description">
              x86_64 architecture for standard servers, VMs, and cloud instances.
              The most common platform for production deployments.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Container size={22} />
            </div>
            <h3 className="doc-feature-title">linux/arm64</h3>
            <p className="doc-feature-description">
              ARM64 for Apple Silicon (M1/M2), AWS Graviton, Raspberry Pi, and ARM servers.
              Growing in popularity for cost-efficient cloud deployments.
            </p>
          </div>
        </div>

        <h2>How It Works</h2>
        <p>
          When you add an image with platform selection, DockerPull handles the complexity automatically:
        </p>

        <div className="doc-step-list">
          <div className="doc-step">
            <div className="doc-step-number">1</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Select Platforms</h3>
              <p className="doc-step-description">
                Choose target platforms when adding an image. You can select one or both architectures.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">2</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Registry Query</h3>
              <p className="doc-step-description">
                DockerPull queries the registry for available platforms. If a platform is not available,
                you will be notified before the pull begins.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">3</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Parallel Pulls</h3>
              <p className="doc-step-description">
                Each platform creates a separate pull task. These can run in parallel for faster downloads.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">4</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Individual Export</h3>
              <p className="doc-step-description">
                Each platform is exported as a separate tar file with the platform in the filename.
              </p>
            </div>
          </div>
        </div>

        <h2>Platform Detection</h2>
        <p>
          DockerPull can check which platforms are available for an image before pulling:
        </p>

        <CodeBlock
          title="API Check Example"
          language="HTTP"
          code={`GET /api/images/check-platforms?name=nginx&tag=latest

Response:
{
  "platforms": ["linux/amd64", "linux/arm64"],
  "available": true
}`}
        />

        <h2>File Naming Convention</h2>
        <p>
          When exporting multi-platform images, each platform gets its own file:
        </p>

        <CodeBlock
          title="Export File Names"
          language="Text"
          code={`nginx_latest_linux-amd64.tar
nginx_latest_linux-arm64.tar

# Format: {name}_{tag}_{platform}.tar`}
        />

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              Always check the Logs page for detailed progress on multi-platform pulls.
              Each platform is tracked separately, so you can see which architectures
              completed successfully and which may have failed.
            </p>
          </div>
        </div>

        <h2>Use Cases</h2>
        <p>
          Multi-platform support is essential for:
        </p>

        <ul>
          <li><strong>Development Teams</strong> - Support both Intel and Apple Silicon Macs</li>
          <li><strong>Hybrid Infrastructure</strong> - Mix of x86_64 and ARM servers</li>
          <li><strong>Cost Optimization</strong> - Use cheaper ARM instances where possible</li>
          <li><strong>Edge Deployments</strong> - Raspberry Pi and other ARM edge devices</li>
        </ul>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/image-management" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Image Management</span>
        </a>
        <a href="/docs/auto-export" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">Auto Export →</span>
        </a>
      </div>
    </div>
  )
}
