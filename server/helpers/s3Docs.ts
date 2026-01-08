// helpers/s3Docs.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const REGION = process.env.AWS_REGION as string;
const BUCKET = process.env.S3_DOCS_BUCKET as string;

export const s3 = new S3Client({ region: REGION });

export function buildDocKey(args: {
  companyId: string;
  docId?: string;
  originalName: string;
}) {
  const safe = args.originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const ts = Date.now();
  // keep it deterministic + grouped by company
  return `companies/${args.companyId}/docs/${ts}_${safe}`;
}

export async function uploadToS3(args: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: args.key,
      Body: args.body,
      ContentType: args.contentType,
      // private by default (since bucket is private). No ACL needed.
    })
  );
}

export async function presignGetUrl(args: { key: string; expiresSeconds?: number }) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: args.key });
  return await getSignedUrl(s3, cmd, { expiresIn: args.expiresSeconds ?? 60 });
}

export async function deleteFromS3(args: { key: string }) {
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: args.key }));
}

export const DOCS_BUCKET = BUCKET;
