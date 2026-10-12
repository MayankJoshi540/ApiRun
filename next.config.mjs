/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@monaco-editor/react'],

  allowedDevOrigins: [
    '*.ngrok-free.app',
    '*.ngrok-free.dev',
  ],
};

export default nextConfig;