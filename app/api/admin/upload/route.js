import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get("file");
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const upload = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ resource_type: "image" }, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }).end(buffer);
    });
    return NextResponse.json({ url: upload.secure_url });
  } catch (err) {
    return NextResponse.json({ error: "Cloudinary upload failed" }, { status: 500 });
  }
} 