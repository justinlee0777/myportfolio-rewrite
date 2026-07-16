import path from 'path';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';

const rootPath = path.join(process.cwd(), '../src/app');

const baseUrl = 'http://localhost:3000';

/**
 * Used to fill in dynamic routes with good examples.
 */
export async function getFinalUrls(): Promise<Array<string>> {
  let paths = await getPaths();

  const prosperoRegex = /\[bookTitle\]/;

  const books = ['the-tempest', 'ulysses'];

  const bookIndex = paths.findIndex((path) => path.match(prosperoRegex));

  const bookUrl = paths[bookIndex];

  paths.splice(bookIndex, 1);

  paths = paths.concat(
    books.map((book) => bookUrl.replace(prosperoRegex, book)),
  );

  return paths.map((path) => `${baseUrl}${path}`);
}

async function getPaths(filePath = ''): Promise<Array<string>> {
  const finalPath = path.join(rootPath, filePath);

  const files = await readdir(finalPath, { withFileTypes: true });

  const pages = [];

  if (files.some((file) => file.name.startsWith('page.'))) {
    pages.push(filePath);
  }

  const folders = files
    .filter((file) => file.isDirectory())
    .map((file) => file.name);

  const pageResults = await Promise.all(
    folders.map((folder) => getPaths(`${filePath}/${folder}`)),
  );

  return pages.concat(...pageResults);
}

console.log(import.meta.url);

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  getFinalUrls()
    .then(async (finalResult) => {
      console.log('result', finalResult);

      process.exit(0);
    })
    .catch((error) => {
      console.log('Error in populating DB:', error);
      process.exit(1);
    });
}
