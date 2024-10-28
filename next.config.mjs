/** @type {import('next').NextConfig} */

const nextConfig = {
    experimental: {
        outputFileTracingExcludes: {
            '*': [
                'node_modules/@swc/core-linux-x64-gnu',
                'node_modules/@swc/core-linux-x64-musl',
                'node_modules/@esbuild/linux-x64',
            ],
        },
    },
};

if (process.env.NODE_ENV === 'development') {
    nextConfig.rewrites = async () => {
        return [
            {
                source: '/api/:path*',
                destination: 'http://localhost:8000/api/:path*',
            },
        ]
    }
}

export default nextConfig;
