import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';

export async function checkTextExists(
  textTitle: string,
  textDescription: string,
): Promise<boolean> {
  const s3Client = new S3Client();

  const command = new HeadObjectCommand({
    Bucket: 'prospero-texts',
    Key: `${textTitle}-${textDescription}`,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch {
    return false;
  }
}
