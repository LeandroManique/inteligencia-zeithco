import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com'   },
      { protocol: 'https', hostname: '**.redd.it'          },
      { protocol: 'https', hostname: '**.medium.com'       },
      { protocol: 'https', hostname: '**.techcrunch.com'   },
      { protocol: 'https', hostname: '**.openai.com'       },
      { protocol: 'https', hostname: '**.anthropic.com'    },
      { protocol: 'https', hostname: '**.github.com'       },
    ],
  },
}

export default nextConfig
