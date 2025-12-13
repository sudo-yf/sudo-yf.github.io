import type { IconMap, SocialLink, Site } from '@/types'
import { withBase } from '@/lib/path-utils'

export const SITE: Site = {
  title: "Yifan's Blog",
  description:
    '19y/o @SCUT | bedroom pop enthusiast | icyball',
  href: 'https://sudo-yf.github.io',
  author: 'yifan',
  locale: 'en-US',
  featuredPostCount: 2,
  postsPerPage: 4,
}

export const NAV_LINKS: SocialLink[] = [
  {
    href: withBase('/'),
    label: 'Home',
  },
  {
    href: withBase('/blog'),
    label: 'Blog',
  },
  {
    href: withBase('/work'),
    label: 'Work',
  },
  {
    href: withBase('/about'),
    label: 'About',
  },
]

export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: 'https://github.com/sudo-yf',
    label: 'GitHub',
  },
  {
    href: 'mailto:shiyi20060618@gmail.com',
    label: 'Email',
  },
  {
    href: withBase('/rss.xml'),
    label: 'RSS',
  },
]

export const ICON_MAP: IconMap = {
  Website: 'lucide:globe',
  GitHub: 'lucide:github',
  LinkedIn: 'lucide:linkedin',
  Twitter: 'lucide:twitter',
  Email: 'lucide:mail',
  RSS: 'lucide:rss',
}

// Giscus Comment System Configuration
// Get these values from https://giscus.app after setting up GitHub Discussions
export const GISCUS_CONFIG = {
  // REQUIRED: Your GitHub repository in the format 'username/repo'
  // Example: 'sudo-yf/sudo-yf.github.io'
  repo: 'sudo-yf/sudo-yf.github.io' as `${string}/${string}`,

  // REQUIRED: Repository ID - get from giscus.app
  repoId: 'R_kgDOQnsBMg',

  // REQUIRED: Discussion category name
  // Default: 'Comments' (create this category in your GitHub Discussions)
  category: 'General',

  // REQUIRED: Category ID - get from giscus.app
  categoryId: 'DIC_kwDOQnsBMs4CzvhT',

  // Optional: How to map pages to discussions
  mapping: 'pathname' as const,

  // Optional: Enable reactions on the main post
  reactionsEnabled: true,

  // Optional: Language
  lang: 'zh-CN',
}
