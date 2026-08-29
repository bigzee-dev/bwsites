import "server-only";
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let client: S3Client | null = null;

function getR2Client() {
  if (!client) {
    client = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY ?? "",
      },
    });
  }
  return client;
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "-").toLowerCase();
}

export async function uploadImageToR2(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const key = `sites/${crypto.randomUUID()}-${sanitizeFilename(file.name)}`;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type || "application/octet-stream",
    }),
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

export async function uploadBufferToR2(
  buffer: Buffer,
  filename: string,
  contentType: string,
): Promise<string> {
  const key = `sites/${crypto.randomUUID()}-${sanitizeFilename(filename)}`;

  await getR2Client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    }),
  );

  return `${process.env.R2_PUBLIC_URL}/${key}`;
}

export async function deleteImageFromR2(imageUrl: string): Promise<void> {
  const key = imageUrl.replace(`${process.env.R2_PUBLIC_URL}/`, "");

  await getR2Client().send(
    new DeleteObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }),
  );
}
