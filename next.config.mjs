/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        if (process.env.NODE_ENV !== 'production') {
            return [
                {
                    source: '/api/:path*',
                    destination: 'http://localhost:8000/:path*',
                },
            ]
        }
        return []
    },
};

export default nextConfig;
