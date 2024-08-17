import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from "next/server";

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

export async function POST(req) {
  try {
    const { fileName, fileType } = await req.json();
    const fileId = `${uuidv4()}_${fileName}`;

    const params = {
      Bucket: bucketName,
      Key: fileId,
      ContentType: fileType,
    };

    const command = new PutObjectCommand(params);
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return NextResponse.json({
      success: true,
      uploadUrl,
      fileId,
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json({
      success: false,
      message: "Error generating pre-signed URL",
      error: error.message,
    });
  }
}
