import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

export async function getGutenbergText(title: string): Promise<string> {
  const s3Client = new S3Client();

  const command = new GetObjectCommand({
    Bucket: 'gutenberg-texts',
    Key: `${title}.txt`,
  });

  const result = await s3Client.send(command);

  return result.Body!.transformToString();
}
