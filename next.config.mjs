/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  env: {
    NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:
     process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "",
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
     process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || ""
  }
};

export default nextConfig;
