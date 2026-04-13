import { useEffect } from 'react'
import { Sparkles, Shield, Lock } from 'lucide-react'
import '../components/DocPage.css'

export default function Tokens() {
  useEffect(() => {
    document.title = 'Access Tokens - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Configuration</span>
        </div>
        <h1 className="doc-page-title">Access Tokens</h1>
        <p className="doc-page-description">
          Configure authentication for multiple container registries. Securely store credentials for Docker Hub, GHCR, Quay, Alibaba ACR, AWS ECR, and Google GAR.
        </p>
      </div>

      <div className="doc-content">
        <h2>Supported Registries</h2>
        <p>
          DockerPull supports authentication with all major container registries. Add tokens to pull private images or to increase rate limits for public images.
        </p>

        <div className="doc-feature-grid">
          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">Docker Hub</h3>
            <p className="doc-feature-description">
              Username + access token. Create tokens at Account Settings → Security.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">GitHub Container Registry</h3>
            <p className="doc-feature-description">
              Personal access token with read:packages scope.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">Quay.io</h3>
            <p className="doc-feature-description">
              Robot account token or OAuth token.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">Alibaba ACR</h3>
            <p className="doc-feature-description">
              Username + password for cr.aliyun.com.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">AWS ECR</h3>
            <p className="doc-feature-description">
              Access Key ID + Secret Access Key + Region.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={20} />
            </div>
            <h3 className="doc-feature-title">Google GAR</h3>
            <p className="doc-feature-description">
              Service account JSON key or OAuth token.
            </p>
          </div>
        </div>

        <h2>Adding Tokens</h2>

        <div className="doc-step-list">
          <div className="doc-step">
            <div className="doc-step-number">1</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Navigate to Settings</h3>
              <p className="doc-step-description">
                Go to Settings → Tokens in the application sidebar.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">2</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Select Registry</h3>
              <p className="doc-step-description">
                Click "Add Registry Token" and choose the registry you want to configure.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">3</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Enter Credentials</h3>
              <p className="doc-step-description">
                Enter the required credentials for the selected registry. See below for registry-specific instructions.
              </p>
            </div>
          </div>

          <div className="doc-step">
            <div className="doc-step-number">4</div>
            <div className="doc-step-content">
              <h3 className="doc-step-title">Save Configuration</h3>
              <p className="doc-step-description">
                Click Save to store the token. Credentials are encrypted at rest and never exposed via the API.
              </p>
            </div>
          </div>
        </div>

        <h2>Registry-Specific Configuration</h2>

        <h3>Docker Hub</h3>
        <ul>
          <li>Create access token at <a href="https://hub.docker.com/settings/security" target="_blank" rel="noopener">hub.docker.com/settings/security</a></li>
          <li>Use your Docker ID as username</li>
          <li>Use the generated access token (not your password)</li>
          <li>Required scopes: <code className="doc-inline-code">public_repo</code>, <code className="doc-inline-code">read:packages</code></li>
        </ul>

        <h3>GitHub Container Registry (ghcr.io)</h3>
        <ul>
          <li>Create token at <a href="https://github.com/settings/tokens" target="_blank" rel="noopener">github.com/settings/tokens</a></li>
          <li>Required scope: <code className="doc-inline-code">read:packages</code></li>
          <li>Token format: <code className="doc-inline-code">ghp_xxxxxxxxxxxxxxxxxxxx</code></li>
          <li>Even public images may require authentication for higher rate limits</li>
        </ul>

        <h3>Quay.io</h3>
        <ul>
          <li>Create robot account at <a href="https://quay.io/organization/" target="_blank" rel="noopener">quay.io</a></li>
          <li>Or generate encrypted password in account settings</li>
          <li>Use robot account name as username (format: <code className="doc-inline-code">organization+robotname</code>)</li>
          <li>Use robot token as password</li>
        </ul>

        <h3>Alibaba Container Registry (ACR)</h3>
        <ul>
          <li>Registry endpoint: <code className="doc-inline-code">cr.aliyun.com</code></li>
          <li>Use your Alibaba Cloud account username</li>
          <li>Use your Alibaba Cloud login password or access key</li>
          <li>For private repositories, ensure your account has pull permissions</li>
        </ul>

        <h3>AWS Elastic Container Registry (ECR)</h3>
        <ul>
          <li>Create IAM user with <code className="doc-inline-code">ecr:GetAuthorizationToken</code> permission</li>
          <li>Use Access Key ID and Secret Access Key</li>
          <li>Specify the AWS region (e.g., <code className="doc-inline-code">us-east-1</code>, <code className="doc-inline-code">eu-west-1</code>)</li>
          <li>Supports both public ECR and private ECR repositories</li>
        </ul>

        <h3>Google Artifact Registry (GAR)</h3>
        <ul>
          <li>Create service account in Google Cloud Console</li>
          <li>Grant <code className="doc-inline-code">Artifact Registry Reader</code> role</li>
          <li>Download JSON key file</li>
          <li>Paste the entire JSON key content as the token</li>
        </ul>

        <div className="doc-callout doc-callout-danger">
          <div className="doc-callout-icon">
            <Shield size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Security Note</div>
            <p className="doc-doc-callout-text">
              Tokens are encrypted at rest using AES-256 and never exposed via the API.
              Always use registry-specific access tokens rather than your main account password.
              Rotate tokens regularly for enhanced security.
            </p>
          </div>
        </div>

        <h2>Rate Limits</h2>
        <p>
          Authenticated pulls typically have higher rate limits than anonymous pulls:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Registry</th>
                <th>Anonymous</th>
                <th>Authenticated</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Docker Hub</td>
                <td>100 pulls/6hrs</td>
                <td>200 pulls/6hrs (free tier)</td>
              </tr>
              <tr>
                <td>GitHub Container Registry</td>
                <td>Limited</td>
                <td>5000 requests/hr</td>
              </tr>
              <tr>
                <td>Quay.io</td>
                <td>Unlimited (public)</td>
                <td>Based on plan</td>
              </tr>
              <tr>
                <td>Alibaba ACR</td>
                <td>Based on region</td>
                <td>Based on account tier</td>
              </tr>
              <tr>
                <td>AWS ECR</td>
                <td>Public: unlimited</td>
                <td>Private: based on usage</td>
              </tr>
              <tr>
                <td>Google GAR</td>
                <td>Public: unlimited</td>
                <td>Private: based on usage</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Best Practices</h2>

        <ul>
          <li><strong>Use dedicated tokens</strong> - Create separate tokens for DockerPull with minimal permissions</li>
          <li><strong>Read-only access</strong> - Tokens only need pull/read permissions, never push</li>
          <li><strong>Regular rotation</strong> - Rotate tokens every 90 days or when team members change</li>
          <li><strong>Monitor usage</strong> - Check registry audit logs for unexpected token activity</li>
          <li><strong>Store securely</strong> - DockerPull encrypts tokens, but keep your registry credentials safe</li>
        </ul>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              If a pull fails with an authentication error, verify your token has not expired
              and has the correct permissions. You can test authentication by pulling the
              image manually with docker login first.
            </p>
          </div>
        </div>

        <h2>Troubleshooting</h2>

        <h3>Authentication Failed</h3>
        <ul>
          <li>Verify the token has not expired</li>
          <li>Check token has required permissions/scopes</li>
          <li>Ensure username format is correct (especially for Quay robot accounts)</li>
          <li>For ECR, verify the region is correct</li>
        </ul>

        <h3>Rate Limit Errors</h3>
        <ul>
          <li>Use authenticated pulls for higher limits</li>
          <li>Consider upgrading your registry plan</li>
          <li>Space out pulls to avoid burst limits</li>
        </ul>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/registries" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Registries</span>
        </a>
        <a href="/docs/api-reference" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">API Reference →</span>
        </a>
      </div>
    </div>
  )
}
