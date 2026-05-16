import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'

export default withMermaid(defineConfig({
  title: 'The AI Harness',
  description: 'AI Systems — From Theory to Production. Technical depth for engineers. Strategic clarity for leaders.',
  lang: 'en-US',
  cleanUrls: true,

  head: [
    ['meta', { name: 'theme-color', content: '#D97757' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'The AI Harness' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],

  sitemap: {
    hostname: 'https://theaiharness.online'
  },

  appearance: false,

  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'The AI Harness',

    nav: [
      { text: 'Learning Guide', link: '/guide/what-is-agent' },
      { text: 'Thought Leadership', link: '/articles/' },
      { text: 'Contact', link: '/contact' },
    ],

    sidebar: {
      '/guide/': [
        {
          text: '🏗️ Foundations',
          collapsed: false,
          items: [
            { text: 'What is an AI Agent?', link: '/guide/what-is-agent' },
            { text: 'Agent Taxonomy', link: '/guide/agent-taxonomy' },
            { text: 'Design Patterns', link: '/guide/design-patterns' },
          ]
        },
        {
          text: '💾 Memory',
          collapsed: false,
          items: [
            { text: 'Memory Architecture Deep Dive', link: '/guide/memory-architecture' },
            { text: 'Google ADK', link: '/guide/google-adk' },
          ]
        },
        {
          text: '🖥️ Caching',
          collapsed: false,
          items: [
            { text: 'Caching Overview', link: '/guide/caching-overview' },
            { text: 'KV Cache', link: '/guide/kv-cache' },
            { text: 'Prompt Caching', link: '/guide/prompt-caching' },
            { text: 'Semantic Caching', link: '/guide/semantic-caching' },
          ]
        },
        {
          text: '🚀 Production',
          collapsed: false,
          items: [
            { text: 'Security & Interop', link: '/guide/security-interop' },
            { text: 'Agent Ops & Architecture', link: '/guide/agent-ops' },
            { text: 'Developer Mindset', link: '/guide/developer-mindset' },
          ]
        },
      ],
      '/articles/': [
        {
          text: '🛡️ Security',
          items: [
            { text: 'Shadow AI Risk', link: '/articles/shadow-ai' },
            { text: 'Token Security — The Weakest Link', link: '/articles/token-security' },
          ]
        },
        {
          text: '👔 Leadership',
          items: [
            { text: 'The Lazy AI Trap', link: '/articles/lazy-ai-trap' },
            { text: 'Enterprise Agents at Scale', link: '/articles/enterprise-agents' },
            { text: 'Deploy GenAI Safely', link: '/articles/deploy-genai-safely' },
          ]
        },
        {
          text: '🛠️ Tools',
          items: [
            { text: 'Prompt Injection Risks', link: '/articles/prompt-injection' },
          ]
        },
      ]
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/sac34333/aiharness' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/in/sachin4/' },
    ],

    editLink: {
      pattern: 'https://github.com/sac34333/aiharness/edit/main/docs/:path',
      text: 'Contribute to this page on GitHub'
    },

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Built from real deployments. Not theory.',
      copyright: 'theaiharness.online · © 2026 Sachin Anand'
    }
  },

  mermaid: {
    theme: 'base',
    themeVariables: {
      primaryColor: '#EAE4DA',
      primaryTextColor: '#1A1714',
      primaryBorderColor: '#D97757',
      lineColor: '#D97757',
      secondaryColor: '#F3EFE8',
      tertiaryColor: '#FAFAF8',
      edgeLabelBackground: '#FAFAF8',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
    }
  },
  mermaidPlugin: {
    class: 'mermaid'
  }
}))
