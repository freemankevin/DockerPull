import { useEffect } from 'react'
import { Globe, Container, Sparkles, Lock } from 'lucide-react'
import '../components/DocPage.css'

export default function Registries() {
  useEffect(() => {
    document.title = 'Registries - DockerPull Documentation'
  }, [])

  return (
    <div className="doc-page">
      <div className="doc-page-header">
        <div className="doc-page-breadcrumb">
          <a href="/docs/introduction">Docs</a>
          <span className="doc-page-breadcrumb-separator">/</span>
          <span>Configuration</span>
        </div>
        <h1 className="doc-page-title">Registry Support</h1>
        <p className="doc-page-description">
          Pull from multiple container registries with unified management. DockerPull supports Docker Hub, GHCR, Quay, Alibaba ACR, AWS ECR, and Google GAR.
        </p>
      </div>

      <div className="doc-content">
        <h2>Supported Registries</h2>
        <p>
          DockerPull provides first-class support for all major container registries:
        </p>

        <div className="doc-feature-grid">
          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Container size={22} />
            </div>
            <h3 className="doc-feature-title">Docker Hub</h3>
            <p className="doc-feature-description">
              The default public registry. Largest collection of public container images.
              Supports both official and user-published images.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Globe size={22} />
            </div>
            <h3 className="doc-feature-title">GitHub Container Registry</h3>
            <p className="doc-feature-description">
              ghcr.io - For GitHub packages and private repos. Integrated with GitHub Actions
              and GitHub Packages.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Container size={22} />
            </div>
            <h3 className="doc-feature-title">Quay.io</h3>
            <p className="doc-feature-description">
              Red Hat's container registry with security scanning. Popular for
              enterprise and open-source projects.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Globe size={22} />
            </div>
            <h3 className="doc-feature-title">Alibaba Container Registry</h3>
            <p className="doc-feature-description">
              cr.aliyun.com - Alibaba Cloud's container registry. Fast access in Asia-Pacific
              with enterprise features.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Lock size={22} />
            </div>
            <h3 className="doc-feature-title">AWS ECR</h3>
            <p className="doc-feature-description">
              Elastic Container Registry for AWS deployments. Supports both public
              and private repositories across regions.
            </p>
          </div>

          <div className="doc-feature-card">
            <div className="doc-feature-icon">
              <Globe size={22} />
            </div>
            <h3 className="doc-feature-title">Google Artifact Registry</h3>
            <p className="doc-feature-description">
              Google Cloud's unified artifact management. Supports Docker, Helm,
              and other artifact formats.
            </p>
          </div>
        </div>

        <h2>Registry Detection</h2>
        <p>
          DockerPull automatically detects the registry based on the image name format:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Image Name</th>
                <th>Registry</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code className="doc-inline-code">nginx:latest</code></td>
                <td>docker.io</td>
                <td>Implicit Docker Hub</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">docker.io/library/nginx:latest</code></td>
                <td>docker.io</td>
                <td>Explicit Docker Hub</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">ghcr.io/myorg/myapp:tag</code></td>
                <td>ghcr.io</td>
                <td>GitHub Container Registry</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">quay.io/org/image:tag</code></td>
                <td>quay.io</td>
                <td>Red Hat Quay</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">registry.cn-hangzhou.aliyuncs.com/...)</code></td>
                <td>Alibaba ACR</td>
                <td>Region-specific endpoint</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">public.ecr.aws/...</code></td>
                <td>AWS ECR Public</td>
                <td>AWS public registry</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.amazonaws.com/...</code></td>
                <td>AWS ECR Private</td>
                <td>Account-specific endpoint</td>
              </tr>
              <tr>
                <td><code className="doc-inline-code">*.pkg.dev/...</code></td>
                <td>Google GAR</td>
                <td>Project-specific endpoint</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Authentication Requirements</h2>
        <p>
          Different registries have different authentication requirements:
        </p>

        <div className="doc-table-wrapper">
          <table className="doc-table">
            <thead>
              <tr>
                <th>Registry</th>
                <th>Public Images</th>
                <th>Private Images</th>
                <th>Rate Limits</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Docker Hub</td>
                <td>No auth required</td>
                <td>Username + Token</td>
                <td>100-200 pulls/6hrs</td>
              </tr>
              <tr>
                <td>GitHub GHCR</td>
                <td>Token recommended</td>
                <td>Token required</td>
                <td>5000 requests/hr</td>
              </tr>
              <tr>
                <td>Quay.io</td>
                <td>No auth required</td>
                <td>Token required</td>
                <td>Based on plan</td>
              </tr>
              <tr>
                <td>Alibaba ACR</td>
                <td>Depends on repo</td>
                <td>Username + Password</td>
                <td>Based on account</td>
              </tr>
              <tr>
                <td>AWS ECR Public</td>
                <td>No auth required</td>
                <td>AWS credentials</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>AWS ECR Private</td>
                <td>N/A</td>
                <td>AWS credentials</td>
                <td>Based on usage</td>
              </tr>
              <tr>
                <td>Google GAR</td>
                <td>Depends on repo</td>
                <td>Service account key</td>
                <td>Based on usage</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Registry-Specific Notes</h2>

        <h3>Docker Hub</h3>
        <ul>
          <li>Official images need no prefix: <code className="doc-inline-code">nginx:latest</code></li>
          <li>User images: <code className="doc-inline-code">username/image:tag</code></li>
          <li>Rate limit: 100 pulls/6hrs (anonymous), 200 pulls/6hrs (free)</li>
          <li>Full path: <code className="doc-inline-code">docker.io/library/nginx:latest</code></li>
        </ul>

        <h3>GitHub Container Registry</h3>
        <ul>
          <li>Format: <code className="doc-inline-code">ghcr.io/OWNER/IMAGE:TAG</code></li>
          <li>Integrated with GitHub permissions</li>
          <li>Free for public packages</li>
          <li>Requires token even for some public images</li>
        </ul>

        <h3>Quay.io</h3>
        <ul>
          <li>Built-in security scanning</li>
          <li>Robot accounts for CI/CD</li>
          <li>Repository visibility controls</li>
        </ul>

        <h3>Alibaba Container Registry</h3>
        <ul>
          <li>Multiple region endpoints (e.g., registry.cn-hangzhou.aliyuncs.com)</li>
          <li>Supports namespace-based organization</li>
          <li>Integration with Alibaba Cloud IAM</li>
        </ul>

        <h3>AWS ECR</h3>
        <ul>
          <li>Public registry: <code className="doc-inline-code">public.ecr.aws</code></li>
          <li>Private registry: <code className="doc-inline-code">ACCOUNT.dkr.ecr.REGION.amazonaws.com</code></li>
          <li>Region-specific endpoints</li>
          <li>IAM-based authentication</li>
        </ul>

        <h3>Google Artifact Registry</h3>
        <ul>
          <li>Format: <code className="doc-inline-code">LOCATION-docker.pkg.dev/PROJECT/REPOSITORY/IMAGE</code></li>
          <li>Unified with other Google Cloud services</li>
          <li>Service account authentication</li>
        </ul>

        <div className="doc-callout doc-callout-warning">
          <div className="doc-callout-icon">
            <Container size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Rate Limits</div>
            <p className="doc-callout-text">
              Be aware of rate limits imposed by registries. Docker Hub has strict pull limits
              for anonymous and free users. Consider configuring authentication tokens to
              increase limits and avoid service interruptions.
            </p>
          </div>
        </div>

        <h2>Configuring Access Tokens</h2>
        <p>
          For private registries or higher rate limits, configure access tokens in the
          <a href="/docs/tokens">Tokens</a> section. DockerPull supports:
        </p>

        <ul>
          <li><strong>Docker Hub</strong> - Username + access token</li>
          <li><strong>GitHub GHCR</strong> - Personal access token</li>
          <li><strong>Quay.io</strong> - Robot account or OAuth token</li>
          <li><strong>Alibaba ACR</strong> - Username + password</li>
          <li><strong>AWS ECR</strong> - Access Key ID + Secret Key + Region</li>
          <li><strong>Google GAR</strong> - Service account JSON key</li>
        </ul>

        <div className="doc-callout doc-callout-tip">
          <div className="doc-callout-icon">
            <Sparkles size={18} />
          </div>
          <div className="doc-callout-content">
            <div className="doc-callout-title">Pro Tip</div>
            <p className="doc-callout-text">
              Configure registry tokens in Settings for private image access.
              Tokens are encrypted at rest and never exposed via the API.
              Even for public images, authentication may increase rate limits.
            </p>
          </div>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="doc-page-nav">
        <a href="/docs/settings" className="doc-page-nav-prev">
          <span className="doc-page-nav-label">Previous</span>
          <span className="doc-page-nav-title">← Settings</span>
        </a>
        <a href="/docs/tokens" className="doc-page-nav-next">
          <span className="doc-page-nav-label">Next</span>
          <span className="doc-page-nav-title">Access Tokens →</span>
        </a>
      </div>
    </div>
  )
}
