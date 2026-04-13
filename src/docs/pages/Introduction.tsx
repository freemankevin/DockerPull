import { useEffect } from 'react'

import { Sparkles, Globe, Layers, Download, Bell, ArrowRight } from 'lucide-react'
import '../components/DocPage.css'
import CodeBlock from '../components/CodeBlock'

export default function Introduction() {
  useEffect(() => {
    document.title = 'Introduction - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      {/* Hero Section */}
      <div className="doc-hero">
        <h1 className="doc-hero-title">Welcome to DockerPull</h1>
        <p className="doc-hero-description">
          A modern container image management platform for pulling, storing, and distributing
          Docker images across multiple platforms with ease.
        </p>
      </div>

      <div className="doc-content">
        <h2>Why DockerPull?</h2>
        <p>
          DockerPull simplifies the process of managing container images from multiple registries.
          Whether you are working with Docker Hub, GitHub Container Registry, Quay, or Google
          Container Registry, DockerPull provides a unified interface to handle all your image
          operations.
        </p>

        {/* Feature Grid */}
        <div className="doc-feature-grid">
          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Globe size={22} />
            </div>
            <h3 className="doc-feature-title">Multi-Registry Support</h3>
            <p className="doc-feature-description">
              Pull from Docker Hub, GHCR, Quay, GCR, and more with unified management.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Layers size={22} />
            </div>
            <h3 className="doc-feature-title">Multi-Platform Images</h3>
            <p className="doc-feature-description">
              Handle amd64 and arm64 architectures automatically for seamless deployment.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Download size={22} />
            </div>
            <h3 className="doc-feature-title">Auto Export</h3>
            <p className="doc-feature-description">
              Configure automatic export paths to streamline your CI/CD pipeline.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Bell size={22} />
            </div>
            <h3 className="doc-feature-title">Webhook Notifications</h3>
            <p className="doc-feature-description">
              Get real-time notifications when images are pulled or failures occur.
            </p>
          </div>
        </div>

        <h2>Architecture Overview</h2>
        <p>
          DockerPull uses a pull-based architecture that ensures images are always verified
          before export. The system works by connecting to your configured registries,
          pulling the requested images, and optionally exporting them to your specified
          directory.
        </p>

        <CodeBlock
          title="System Architecture"
          language="Diagram"
          code={`┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Registry      │────▶│   DockerPull      │────▶│   Export Path   │
│  (Docker Hub)   │     │   (Backend)     │     │   (Tar Files)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │
                                ▼
                        ┌───────────┐
                        │  Webhook  │
                        │  Notify   │
                        └───────────┘`}
        />

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              DockerPull uses a pull-based architecture, ensuring images are always verified
              before export. This provides an additional layer of security and validation.
            </p>
          </div>
        </div>

        <h2>Next Steps</h2>
        <p>
          Ready to get started? Follow our Quick Start guide to get up and running in under
          5 minutes, or dive into the Installation guide to deploy DockerPull in your environment.
        </p>

        <div className="doc-quick-links">
          <a href="/docs/quick-start" className="doc-quick-link">
            <ArrowRight size={20} className="doc-quick-link-icon" />
            <span className="doc-quick-link-title">Quick Start</span>
            <p className="doc-quick-link-description">
              Get up and running with DockerPull in under 5 minutes.
            </p>
          </a>

          <a href="/docs/installation" className="doc-quick-link">
            <Download size={20} className="doc-quick-link-icon" />
            <span className="doc-quick-link-title">Installation</span>
            <p className="doc-quick-link-description">
              Deploy DockerPull using Docker for easy setup and management.
            </p>
          </a>

          <a href="/docs/image-management" className="doc-quick-link">
            <Layers size={20} className="doc-quick-link-icon" />
            <span className="doc-quick-link-title">Image Management</span>
            <p className="doc-quick-link-description">
              Learn how to add, monitor, and manage container images.
            </p>
          </a>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <div></div>
        <a href="/docs/quick-start" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">Quick Start →</span>
        </a>
      </div>
    </div>
  )
}
