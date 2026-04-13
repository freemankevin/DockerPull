import {
  Sparkles,
  ArrowRight,
  Container,
  Layers,
  Globe,
  Download,
  Bell,
  Settings,
  Key,
  Code,
  type LucideIcon
} from 'lucide-react'

export interface DocSection {
  title: string
  items: DocItem[]
}

export interface DocItem {
  id: string
  title: string
  path: string
  icon: LucideIcon
  description?: string
}

export const docSections: DocSection[] = [
  {
    title: 'Getting Started',
    items: [
      {
        id: 'introduction',
        title: 'Introduction',
        path: '/docs/introduction',
        icon: Sparkles,
        description: 'Learn what DockerPull is and how it can help you manage container images.'
      },
      {
        id: 'quick-start',
        title: 'Quick Start',
        path: '/docs/quick-start',
        icon: ArrowRight,
        description: 'Get up and running with DockerPull in under 5 minutes.'
      },
      {
        id: 'installation',
        title: 'Installation',
        path: '/docs/installation',
        icon: Container,
        description: 'Deploy DockerPull using Docker for easy setup and management.'
      }
    ]
  },
  {
    title: 'Core Features',
    items: [
      {
        id: 'image-management',
        title: 'Image Management',
        path: '/docs/image-management',
        icon: Layers,
        description: 'Learn how to add, monitor, and manage container images.'
      },
      {
        id: 'multi-platform',
        title: 'Multi-Platform',
        path: '/docs/multi-platform',
        icon: Globe,
        description: 'Handle multi-architecture container images automatically.'
      },
      {
        id: 'auto-export',
        title: 'Auto Export',
        path: '/docs/auto-export',
        icon: Download,
        description: 'Automatically export pulled images to a specified directory.'
      },
      {
        id: 'webhooks',
        title: 'Webhooks',
        path: '/docs/webhooks',
        icon: Bell,
        description: 'Receive real-time notifications for image events.'
      }
    ]
  },
  {
    title: 'Configuration',
    items: [
      {
        id: 'settings',
        title: 'Settings',
        path: '/docs/settings',
        icon: Settings,
        description: 'Configure DockerPull to match your workflow.'
      },
      {
        id: 'registries',
        title: 'Registries',
        path: '/docs/registries',
        icon: Globe,
        description: 'Pull from multiple container registries with unified management.'
      },
      {
        id: 'tokens',
        title: 'Access Tokens',
        path: '/docs/tokens',
        icon: Key,
        description: 'Configure registry credentials for private image pulls.'
      }
    ]
  },
  {
    title: 'Reference',
    items: [
      {
        id: 'api-reference',
        title: 'API Reference',
        path: '/docs/api-reference',
        icon: Code,
        description: 'Programmatic access via REST API.'
      }
    ]
  }
]

export const docPages: Record<string, DocItem> = docSections
  .flatMap(s => s.items)
  .reduce((acc, item) => {
    acc[item.id] = item
    return acc
  }, {} as Record<string, DocItem>)

export const findDocByPath = (path: string): DocItem | undefined => {
  return docSections.flatMap(s => s.items).find(item => item.path === path)
}

export const findDocById = (id: string): DocItem | undefined => {
  return docPages[id]
}
