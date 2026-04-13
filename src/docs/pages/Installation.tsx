import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import '../components/DocPage.css'
import CodeBlock from '../components/CodeBlock'

export default function Installation() {
  useEffect(() => {
    document.title = 'Installation - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Getting Started</span>
        </div>
        <h1 className="doc-page-title">Installation</h1>
        <p className="doc-page-description">
          Deploy DockerPull using Docker for easy setup and management. Choose the method that works best for your environment.
        </p>
      </div>

      <div className="doc-content">
        <h2>Docker Compose (Recommended)</h2>
        <p>
          The easiest way to get started with DockerPull is using Docker Compose. This method
          handles all the configuration and dependencies automatically.
        </p>

        <CodeBlock
          title="docker-compose.yml"
          language="YAML"
          code={`version: '3.8'

services:
  dockpull:
    image: dockpull:latest
    container_name: dockpull
    ports:
      - "8080:8080"
    volumes:
      - ./data:/app/data
      - ./exports:/app/exports
    environment:
      - SECRET_KEY=your-secret-key-here
      - ADMIN_PASSWORD=your-admin-password
      - EXPORT_PATH=/app/exports
    restart: unless-stopped`}
        />

        <p>Save the file and run:</p>

        <CodeBlock
          title="Terminal"
          language="Bash"
          code={`docker-compose up -d`}
        />

        <h2>Environment Variables</h2>
        <p>
          Configure DockerPull using the following environment variables:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Description</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">SECRET_KEY</code></td>
                <td>Secret key for session encryption</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">ADMIN_PASSWORD</code></td>
                <td>Initial admin password</td>
                <td>Yes</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">EXPORT_PATH</code></td>
                <td>Default export directory</td>
                <td>No (default: /app/exports)</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">PORT</code></td>
                <td>Server port</td>
                <td>No (default: 8080)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Directory Structure</h2>
        <p>
          DockerPull uses the following directory structure:
        </p>

        <div className="doc-file-tree">
          <div className="doc-file-tree-line">
            <span className="doc-file-tree-dir">/app</span>
          </div>
          <div className="doc-file-tree-line">
            <span>├── </span>
            <span className="doc-file-tree-dir">data/</span>
            <span className="doc-file-tree-comment"># Database and configuration</span>
          </div>
          <div className="doc-file-tree-line">
            <span>│   └── </span>
            <span className="doc-file-tree-file">dockpull.db</span>
            <span className="doc-file-tree-comment"># SQLite database</span>
          </div>
          <div className="doc-file-tree-line">
            <span>├── </span>
            <span className="doc-file-tree-dir">exports/</span>
            <span className="doc-file-tree-comment"># Exported image tar files</span>
          </div>
          <div className="doc-file-tree-line">
            <span>│   └── </span>
            <span className="doc-file-tree-file">nginx_latest_linux-amd64.tar</span>
          </div>
          <div className="doc-file-tree-line">
            <span>└── </span>
            <span className="doc-file-tree-dir">logs/</span>
            <span className="doc-file-tree-comment"># Application logs</span>
          </div>
        </div>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              Mount the <code className="doc-inline-code">exports</code> volume to a shared
              location for easy access from other services. This makes it simple to integrate
              DockerPull into your existing CI/CD pipeline.
            </p>
          </div>
        </div>

        <h2>Docker Run (Alternative)</h2>
        <p>
          If you prefer not to use Docker Compose, you can run DockerPull directly:
        </p>

        <CodeBlock
          title="Terminal"
          language="Bash"
          code={`docker run -d \\
  --name dockpull \\
  -p 8080:8080 \\
  -v $(pwd)/data:/app/data \\
  -v $(pwd)/exports:/app/exports \\
  -e SECRET_KEY=your-secret-key \\
  -e ADMIN_PASSWORD=your-password \\
  dockpull:latest`}
        />

        <h2>Accessing the Application</h2>
        <p>
          Once running, access the DockerPull web interface at:
        </p>

        <CodeBlock
          title="URL"
          language="Text"
          code={`http://localhost:8080`}
        />

        <p>
          Log in with the admin credentials you configured in the environment variables.
        </p>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/quick-start" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Quick Start</span>
        </a>
        <a href="/docs/image-management" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">Image Management →</span>
        </a>
      </div>
    </div>
  )
}
