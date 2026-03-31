import type { NextConfig } from "next";

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  env: {
    MONGODB_URI: "mongodb+srv://yusasive:yDty7oDTXcPayROe@yusasive.dwzc5vv.mongodb.net/nurturenova",
    JWT_SECRET: "f4e0ec3be1f12440764b2cdaa1de021cc10cc2d541d33f0361ecb850a7479649",
    GOOGLE_CLIENT_EMAIL: "nurturenova@ninth-physics-443520-t5.iam.gserviceaccount.com",
    GOOGLE_PRIVATE_KEY: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCvFAzC6ieW4GOe\nR1rqimA2LOnzkm24Q9wq7W5qZbwGylfbBFNZFZDMPcnS6KGNj4zvKU+VkLgGtv0x\ntsBo4z/xQbqC4xl4aDsdkyehGLuCnxzVOgFfnuN6tK3bQ7vZEvmt7fWPWfdslXey\n7IZ0SqEuHS1YdfU96Xx2dD1YezooH3vkUbra74eSGICid8CAiaOMlWwTTX3uqxIs\na7/5vd0ANEOpRTiTvvx5GeHyH8Z8j6TlGxjGtT8wy59H8cBfymVa+7ejblBAFT/R\nTRGUYuTZkhHBvk/64k2sucpZ0oCLlGtwNhw5owURD8Vfai35Vpt2HQwtiC7VsvDf\n7qEstcTxAgMBAAECggEASvPhdry6ECymWUehE5IEGI1n5yAEGwPqSPJ299PwCFQu\nApS6fgPuhpHZSpLPPwR6yJS9/oEDV9SVVugvPXg0kruZ9pj0+Yhd7o5mQ+CLviMS\nO/LmTaJ/LrQVTi6USB2IiL68Bw/0Did7JD2AXl7o3A4fsKRnRockAq5G6Q9wWWZT\nOjkNgJseNESCyfGygoSRq+TBF0JrX2b3jKJrTI5LIwv+Dj9oV7RWjZHXEIz7TnaE\nkp+lmhUdjd+y+E6ssqvQ5rDKlCA0D5eb664PIMjGXsGf3T4VrqCsX9yIzgknh042\n/hUpweXnPv5/xB6HipYXsN1qlhJQR/yA6iayIKpZ1QKBgQDmtCMPRTRyjF5FPS45\nEVW/I5vwsZ6tL8VvKLKHSOe4QFz16+3ixF5rmE7pIE1XUFgTanuY+732FlcNEq6y\nKW/w2ZOdGlvKOrMPMpVKB2ptZj+po9guQVXqQG53drejeUOMDclaeW3T4LN+Rn+i\nbqQHA8EFE93irixDlB3umvVW4wKBgQDCRoHCK6xwewzTEtX07H8jcgyf9fBNwlVy\nOLVhd6iIuJYHEeHte2QfPsBKbslgCmUbdIH9PGbQorJjupkroo2zcwU9VhHRuiEl\nuRQAGGP3raT1IkBvebYvyv75jiGAOk9a8Vr08lSfvVnoWFrJNjXGgL9cFFG+O4mf\n/wBejwvpGwKBgQDh+6osFxoc6qqdICTa+cQIixUBXLuV4amADVlzc1KoBUQKEKTg\n8IGc24DQkzevQ6BCxJd1b4LQP2neAGLnWfew8S/LQDqRiZZEWMQr07/IkdPik//6\nrz09TQfoNX4Ev5AO7KJD4ZZXaU/pbZ0wuzgpNuAn3SIIHZx2RexcAaY5CQKBgD86\nFSbtccyVr4HOYoW4plQR3Rv+PbwA4DAxVo6nE9mTQXiBkGbqvpYQpSJUVgOEvo0l\n6NxS2R9To/0jEJCL8dQSPgVNSrVX/0u4pVK2nWpRQBtrj074bJu3VC5B3JNP5t2x\nKSoI6BOo22brwngzxWKaKi08i7H+zHae1i7wHS87AoGBANcTqBQtYL8IWa0/8rqM\nUUHHq3e1tjCUXGDf3fJjGuwK/8BN89Vlka+x7E7e77ufsXekXOMRN7tE3mzaltZJ\ntwG48nRr2P77xVQbnts227FmH9XCvs8U7fOnB4vHA272tzplh4opx6Jqk1K16NF2\nTRU4JjG1kZo+CwvhY+6hlJ5r\n-----END PRIVATE KEY-----\n",
    GOOGLE_SHEET_ID: "1o0tnwctIEHhFizUsd3FYWE1fyo819mnr-udDqlhA3po",
    EMAIL_USER: "admin@nurturenovalearning.com",
    EMAIL_PASS: "NurtureAdmin@2024",
    EMAIL_TO: "nurturenovalearning@gmail.com",
    CLOUDINARY_CLOUD_NAME: "ddxssowqb",
    CLOUDINARY_API_KEY: "945897525253976",
    CLOUDINARY_API_SECRET: "RaZFUdpxEi-8X-oW9Gutpv7GwWA",
    RESEND_API_KEY: "re_bFvJeLdt_A3zwWNC9VFauB6uCwgGEzDTx",
  },
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com"],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https:;",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
