/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['atr-staff-id.s3.amazonaws.com'],
  },
 
}

export default nextConfig