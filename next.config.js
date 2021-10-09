module.exports = (phase, _) => {
  if (process.env.NODE_ENV==='development') {
    return {
      async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'http://localhost:8080/:path*'
          },
        ]
      },
      images: {
        domains: ['www.artic.edu'],
      },
    }
  } else if (process.env.NODE_ENV === 'test') {
    return {
      async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://art-flex.co/api/:path*'
          },
        ]
      },
      images: {
        domains: ['www.artic.edu'],
      },
    }
  }
  else {
    return {
      images: {
        domains: ['www.artic.edu'],
      },
    }
  }
}
