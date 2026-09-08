import "server-only";
import {
  DeleteObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  type GetObjectCommandOutput,
} from "@aws-sdk/client-s3";

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

export type R2Object = {
  key: string;
  /** Size in bytes, as reported by the bucket. */
  size: number;
  lastModified: Date | null;
};

/** R2 caps a list response at 1000 keys, so a full bucket takes several round trips. */
const LIST_PAGE_SIZE = 1000;

/** Safety net so a runaway bucket can never spin this request forever. */
const MAX_LIST_PAGES = 25;

/** Lists every object in the bucket, following continuation tokens to the end. */
export async function listAllR2Objects(): Promise<R2Object[]> {
  const objects: R2Object[] = [];
  let continuationToken: string | undefined;

  for (let page = 0; page < MAX_LIST_PAGES; page += 1) {
    const response = await getR2Client().send(
      new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        MaxKeys: LIST_PAGE_SIZE,
        ContinuationToken: continuationToken,
      }),
    );

    for (const item of response.Contents ?? []) {
      if (!item.Key) continue;
      objects.push({
        key: item.Key,
        size: item.Size ?? 0,
        lastModified: item.LastModified ?? null,
      });
    }

    continuationToken = response.IsTruncated
      ? response.NextContinuationToken
      : undefined;
    if (!continuationToken) break;
  }

  return objects;
}

/** Fetches one object so it can be streamed back to the admin as a download. */
export async function getR2Object(key: string): Promise<GetObjectCommandOutput> {
  return getR2Client().send(
    new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    }),
  );
}
