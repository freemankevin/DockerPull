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
  titleKey: string
  items: DocItem[]
}

export interface DocItem {
  id: string
  titleKey: string
  path: string
  icon: LucideIcon
  descriptionKey?: string
}

export const docSections: DocSection[] = [
  {
    titleKey: 'docs.section.gettingStarted',
    items: [
      {
        id: 'introduction',
        titleKey: 'docs.intro.title',
        path: '/docs/introduction',
        icon: Sparkles,
        descriptionKey: 'docs.intro.heroDesc'
      },
      {
        id: 'quick-start',
        titleKey: 'docs.quickStart.title',
        path: '/docs/quick-start',
        icon: ArrowRight,
        descriptionKey: 'docs.quickStart.desc'
      },
      {
        id: 'installation',
        titleKey: 'docs.installation.title',
        path: '/docs/installation',
        icon: Container,
        descriptionKey: 'docs.installation.desc'
      }
    ]
  },
  {
    titleKey: 'docs.section.coreFeatures',
    items: [
      {
        id: 'image-management',
        titleKey: 'docs.imageManagement.title',
        path: '/docs/image-management',
        icon: Layers,
        descriptionKey: 'docs.imageManagement.desc'
      },
      {
        id: 'multi-platform',
        titleKey: 'docs.multiPlatform.title',
        path: '/docs/multi-platform',
        icon: Globe,
        descriptionKey: 'docs.multiPlatform.desc'
      },
      {
        id: 'auto-export',
        titleKey: 'docs.autoExport.title',
        path: '/docs/auto-export',
        icon: Download,
        descriptionKey: 'docs.autoExport.desc'
      },
      {
        id: 'webhooks',
        titleKey: 'docs.webhooks.title',
        path: '/docs/webhooks',
        icon: Bell,
        descriptionKey: 'docs.webhooks.desc'
      }
    ]
  },
  {
    titleKey: 'docs.section.configuration',
    items: [
      {
        id: 'settings',
        titleKey: 'docs.settings.title',
        path: '/docs/settings',
        icon: Settings,
        descriptionKey: 'docs.settings.desc'
      },
      {
        id: 'registries',
        titleKey: 'docs.registries.title',
        path: '/docs/registries',
        icon: Globe,
        descriptionKey: 'docs.registries.desc'
      },
      {
        id: 'tokens',
        titleKey: 'docs.tokens.title',
        path: '/docs/tokens',
        icon: Key,
        descriptionKey: 'docs.tokens.desc'
      }
    ]
  },
  {
    titleKey: 'docs.section.reference',
    items: [
      {
        id: 'api-reference',
        titleKey: 'docs.apiRef.title',
        path: '/docs/api-reference',
        icon: Code,
        descriptionKey: 'docs.apiRef.desc'
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
