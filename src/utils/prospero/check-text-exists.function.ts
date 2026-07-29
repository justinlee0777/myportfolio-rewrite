import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { prosperoTextsBucket } from './consts';

async function checkTextExists(Bucket: string, Key: string): Promise<boolean> {
  const s3Client = new S3Client();

  const command = new HeadObjectCommand({
    Bucket,
    Key,
  });

  try {
    await s3Client.send(command);
    return true;
  } catch (error) {
    if (Bucket === 'gutenberg-texts') {
      console.log('gutenberg error', command, error);
    }
    return false;
  }
}

export async function checkProsperoTextExists(
  textTitle: string,
  textDescription: string,
): Promise<boolean> {
  return checkTextExists(
    prosperoTextsBucket,
    `${textTitle}-${textDescription}`,
  );
}

export async function checkGutenbergTextExists(
  title: string,
): Promise<boolean> {
  return checkTextExists('gutenberg-texts', `${title}.txt`);
}
