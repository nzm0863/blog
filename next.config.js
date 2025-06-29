/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/blog/post/:id',
        destination: 'https://www.nnzzm.com/blog_php/api/post.php?id=:id',
      },
    ];
  },
};

module.exports = nextConfig; 