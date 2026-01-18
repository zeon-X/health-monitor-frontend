/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  // Ensure static exports work properly
  trailingSlash: false,
  // Optimize images
  images: {
    unoptimized: true, // Required for static export on Netlify
  },
};

export default nextConfig;
