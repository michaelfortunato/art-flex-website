const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase, _) => (
  phase === PHASE_DEVELOPMENT_SERVER ?
    {
      async redirects() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://art-flex.co/api/:path*',
            permanent: false
          },
        ]
      },
      images: {
        domains: ['www.artic.edu'],
      },
    } 
    :
    {
      images: {
        domains: ['www.artic.edu'],
      },
    }
)