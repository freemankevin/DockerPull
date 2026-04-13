import { useEffect } from 'react'
import { Code, Sparkles } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function ApiReference() {
  useEffect(() => {
    document.title = 'API Reference - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Reference</span>
        </div>
        <h1 className="doc-page-title">API Reference</h1>
        <p className="doc-page-description">
          Programmatic access via REST API. Integrate DockerPull into your automation workflows and CI/CD pipelines.
        </p>
      </div>

      <div className="doc-content">
        <h2>Authentication</h2>
        <p>
          All API requests require authentication via session cookie. Log in through the web interface
          to obtain a valid session, then use the same cookie for API requests.
        </p>

        <div className="doc-callout doc-callout-info">
          <div className="doc-callout-icon">
            <Code size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">API Base URL</div>
            <p className="doc-callout-text">
              All API endpoints are prefixed with <code className="doc-inline-code">/api</code>.
              Example: <code className="doc-inline-code">GET /api/images</code>
            </p>
          </div>
        </div>

        <h2>Images Endpoints</h2>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-method doc-method-get">GET</span></td>
                <td><code className="doc-inline-code">/api/images</code></td>
                <td>List all images</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-post">POST</span></td>
                <td><code className="doc-inline-code">/api/images</code></td>
                <td>Create image task</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-post">POST</span></td>
                <td><code className="doc-inline-code">/api/images/:id/pull</code></td>
                <td>Trigger pull</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-post">POST</span></td>
                <td><code className="doc-inline-code">/api/images/:id/export</code></td>
                <td>Export image</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-delete">DELETE</span></td>
                <td><code className="doc-inline-code">/api/images/:id</code></td>
                <td>Delete image</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3>Create Image</h3>
        <CodeBlock
          title="Request"
          language="HTTP"
          code={`POST /api/images
Content-Type: application/json

{
  "name": "nginx",
  "tag": "latest",
  "platform": "linux/amd64",
  "is_auto_export": false
}`}
        />

        <CodeBlock
          title="Response"
          language="JSON"
          code={`{
  "id": 123,
  "name": "nginx",
  "tag": "latest",
  "full_name": "docker.io/library/nginx:latest",
  "platform": "linux/amd64",
  "status": "pending",
  "created_at": "2024-01-15T10:30:00Z"
}`}
        />

        <h2>Stats Endpoints</h2>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-method doc-method-get">GET</span></td>
                <td><code className="doc-inline-code">/api/stats</code></td>
                <td>Get statistics</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CodeBlock
          title="Response"
          language="JSON"
          code={`{
  "total_images": 42,
  "pending": 3,
  "pulling": 1,
  "success": 35,
  "failed": 3,
  "exported": 28
}`}
        />

        <h2>Settings Endpoints</h2>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Endpoint</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><span className="doc-method doc-method-get">GET</span></td>
                <td><code className="doc-inline-code">/api/settings</code></td>
                <td>Get settings</td>
              </tr>
              <tr>
                <td><span className="doc-method doc-method-put">PUT</span></td>
                <td><code className="doc-inline-code">/api/settings</code></td>
                <td>Update settings</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Platform Check</h2>
        <p>
          Check which platforms are available for an image before pulling:
        </p>

        <CodeBlock
          title="Request"
          language="HTTP"
          code={`GET /api/images/check-platforms?name=nginx&tag=latest`}
        />

        <CodeBlock
          title="Response"
          language="JSON"
          code={`{
  "platforms": ["linux/amd64", "linux/arm64"],
  "available": true
}`}
        />

        <h2>Error Responses</h2>
        <p>
          API errors follow a consistent format:
        </p>

        <CodeBlock
          title="Error Response"
          language="JSON"
          code={`{
  "error": "Invalid platform",
  "message": "Platform linux/arm64 is not available for this image",
  "code": "PLATFORM_NOT_AVAILABLE"
}`}
        />

        <h2>Status Codes</h2>
        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">200 OK</code></td>
                <td>Request successful</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">201 Created</code></td>
                <td>Resource created successfully</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">400 Bad Request</code></td>
                <td>Invalid request parameters</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">401 Unauthorized</code></td>
                <td>Authentication required</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">404 Not Found</code></td>
                <td>Resource not found</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">500 Internal Error</code></td>
                <td>Server error</td>
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
              Use the API to automate image management in your CI/CD pipeline.
              Combine with webhooks for fully automated workflows.
            </p>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/tokens" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Access Tokens</span>
        </a>
        <div></div>
      </div>
    </div>
  )
}
