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
  // env: {
  //   NEXT_PUBLIC_AWS_S3_BUCKET_ACCESS_KEY_ID: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_ACCESS_KEY_ID,
  //   NEXT_PUBLIC_AWS_S3_BUCKET_SECRET_ACCESS_KEY:
  //     process.env.NEXT_PUBLIC_AWS_S3_BUCKET_SECRET_ACCESS_KEY,
  //   NEXT_PUBLIC_AWS_S3_BUCKET_REGION: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_REGION,
  //   NEXT_PUBLIC_AWS_S3_BUCKET_NAME: process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME,
  // },
};

export default config;
