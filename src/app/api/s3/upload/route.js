import { NextRequest } from 'next/server';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from 'uuid';

const s3Client = new S3Client({
  region: process.env.AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID,
  },
});


const bucketName = process.env.AWS_BUCKET_NAME;

export async function POST (file){
  const Body = await file.arrayBuffer();
  const fileId = uuidv4(); // Genera un ID único para el archivo
  const params = {
    Bucket: bucketName,
    Key: fileId, // Usa el ID único como clave para el archivo
    Body,
    ContentType: file.type,
  };
  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return fileId;
};

/*export const deleteFile = async (fileId) => {
  const params = {
    Bucket: bucketName,
    Key: fileId,
  };
  const command = new DeleteObjectCommand(params);
  await s3Client.send(command);
};
*/


