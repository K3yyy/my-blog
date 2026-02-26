/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Allow images from your real Supabase storage domain
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ypxmbphviefcnyhowivi.supabase.co',  // ← your project ref from the env
                port: '',
                pathname: '/storage/v1/object/public/**',       // allows all public files
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',  // allows any path under the domain
            },
            {
                protocol: 'https',
                hostname: 'fonts.googleapis.com',
            },
            {
                protocol: 'https',
                hostname: 'fonts.gstatic.com',
            },

        ],

        // Allow quality=82 (optional but fixes the quality warning)
        qualities: [75, 82],
    },
};

export default nextConfig;