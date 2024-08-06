/** @type {import('next').NextConfig} */

import withPWA from "next-pwa";

const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const config = {
  ...pwaConfig,
  reactStrictMode: true,
  images: {
    domains: ["momoyuki-20240804.s3.ap-northeast-1.amazonaws.com"],
  },
  env: {
    NEXT_PUBLIC_API_HOST: process.env.NEXT_PUBLIC_API_HOST,
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
    AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
    AWS_S3_BUCKET_REGION: process.env.AWS_S3_BUCKET_REGION,
    AWS_S3_BUCKET_ACCESS_KEY_ID: process.env.AWS_S3_BUCKET_ACCESS_KEY_ID,
    AWS_S3_BUCKET_SECRET_ACCESS_KEY:
      process.env.AWS_S3_BUCKET_SECRET_ACCESS_KEY,
  },
};

export default config;
