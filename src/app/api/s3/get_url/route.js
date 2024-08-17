const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { NextResponse } = require("next/server");

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  },
});

const bucketName = process.env.AWS_BUCKET_NAME;

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const fileId = searchParams.get("fileId");

  if (!fileId) {
    return NextResponse.json({
      success: false,
      message: "File ID is required",
    });
  }

  const getObjectParams = {
    Bucket: bucketName,
    Key: fileId,
  };

  const getCommand = new GetObjectCommand(getObjectParams);

  try {
    const url = await getSignedUrl(s3Client, getCommand, {
      expiresIn: 3600, // URL expira 
    });
    return NextResponse.json({
      success: true,
      message: "Presigned URL generated",
      url,
    });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json({
      success: false,
      message: "Error generating presigned URL",
    });
  }
}
