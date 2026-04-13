import { useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import CodeBlock from '../components/CodeBlock'
import '../components/DocPage.css'

export default function Webhooks() {
  useEffect(() => {
    document.title = 'Webhooks - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Core Features</span>
        </div>
        <h1 className="doc-page-title">Webhook Notifications</h1>
        <p className="doc-page-description">
          Receive real-time notifications for image events. Integrate DockerPull with your CI/CD pipeline or notification systems.
        </p>
      </div>

      <div className="doc-content">
        <h2>Configuration</h2>
        <p>
          Set up webhooks to receive HTTP POST requests when specific events occur.
        </p>

        <div className="doc-step-list">
          <div className="doc-step">
            <div className="doc-step-number">1</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Navigate to Settings</h3>
              <p className="doc-step-description">
                Go to Settings → Webhook in the application sidebar.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">2</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Enter Webhook URL</h3>
              <p className="doc-step-description">
                Provide the HTTPS endpoint where you want to receive notifications.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">3</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Test Connection</h3>
              <p className="doc-step-description">
                Click Test to verify connectivity. A test event will be sent to your endpoint.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">4</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Save Configuration</h3>
              <p className="doc-step-description">
                Save to activate webhook notifications for all future events.
              </p>
            </div>
          </div>
        </div>

        <h2>Payload Format</h2>
        <p>
          All webhook events follow a consistent JSON structure:
        </p>

        <CodeBlock
          title="Webhook Payload"
          language="JSON"
          code={`{
  "event": "image.pulled",
  "timestamp": "2024-01-15T10:30:00Z",
  "data": {
    "id": 123,
    "name": "nginx",
    "tag": "latest",
    "full_name": "docker.io/library/nginx:latest",
    "platform": "linux/amd64",
    "status": "success",
    "export_path": "/app/exports/nginx_latest_linux-amd64.tar",
    "duration_seconds": 45
  }
}`}
        />

        <h2>Event Types</h2>
        <p>
          DockerPull sends notifications for the following events:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Description</th>
                <th>When Triggered</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">image.pulled</code></td>
                <td>Successfully pulled image</td>
                <td>After pull completes successfully</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">image.failed</code></td>
                <td>Pull attempt failed</td>
                <td>When pull fails after all retries</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">image.exported</code></td>
                <td>Image exported to file</td>
                <td>After auto-export completes</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">image.retry</code></td>
                <td>Retry initiated</td>
                <td>When user clicks retry button</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Example: Slack Integration</h2>
        <p>
          Integrate with Slack for team notifications:
        </p>

        <CodeBlock
          title="Slack Webhook Handler"
          language="Node.js"
          code={`app.post('/webhook/dockpull', (req, res) => {
  const { event, data } = req.body;
  
  const message = {
    text: event === 'image.pulled' 
      ? \`✅ Successfully pulled \${data.full_name}\`
      : \`❌ Failed to pull \${data.full_name}\`
  };
  
  await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message)
  });
  
  res.status(200).send('OK');
});`}
        />

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              Integrate with Slack, Discord, PagerDuty, or your CI/CD system for automated workflows.
              Webhooks enable DockerPull to become a seamless part of your DevOps pipeline.
            </p>
          </div>
        </div>

        <h2>Security Considerations</h2>
        <ul>
          <li>Use HTTPS endpoints only</li>
          <li>Validate the payload in your webhook handler</li>
          <li>Implement retry logic for failed webhook deliveries</li>
          <li>Consider using webhook signatures if available</li>
        </ul>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/auto-export" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Auto Export</span>
        </a>
        <a href="/docs/settings" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">Settings →</span>
        </a>
      </div>
    </div>
  )
}
