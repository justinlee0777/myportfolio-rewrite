import type { Metadata } from 'next';
import { cache, JSX } from 'react';
import { readFile, access, constants as fsConstants } from 'fs/promises';
import capitalize from 'lodash-es/capitalize';

import { checkTextExists } from '@/utils/prospero/check-text-exists.function';
import { FlexibleBook } from '@/components/prospero/FlexibleBook/FlexibleBook';
import { ProsperoLibraryTitleModel } from '@/orm/prospero/library-title.model';
import connectToMongoDB from '@/utils/connect-to-mongodb.function';
import { ServerBook } from '@/components/prospero/ServerBook/ServerBook';

interface PageProps {
  params: Promise<{ bookTitle: string }>;
}

interface FSBookResult {
  content: string;
  type: 'fs';
}

interface AWSResult {
  type: 'aws';
}

type BookResult = FSBookResult | AWSResult;

function slugToBookName(bookTitle: string): string {
  return bookTitle.split('-').map(capitalize).join(' ');
}

const getBook = cache(async (bookTitle: string): Promise<BookResult> => {
  const results = await Promise.allSettled([
    new Promise<FSBookResult>(async (resolve, reject) => {
      const fileName = `data/prospero/${bookTitle.toLowerCase().split(' ').join('-')}.txt`;

      try {
        await access(fileName, fsConstants.F_OK);

        const content = await readFile(fileName, { encoding: 'utf-8' });

        resolve({ content, type: 'fs' });
      } catch {
        reject('Not in filesystem.');
      }
    }),
    new Promise<AWSResult>(async (resolve, reject) => {
      const exists = await checkTextExists(bookTitle, 'desktop');

      if (exists) {
        resolve({ type: 'aws' });
      } else {
        reject('Not on AWS.');
      }
    }),
  ]);

  const fulfilledRequest = results.find(
    (value) => value.status === 'fulfilled',
  );

  if (fulfilledRequest) {
    return fulfilledRequest.value;
  } else {
    throw new Error(`Book does not exist: ${bookTitle}`);
  }
});

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { bookTitle } = await params;

  return {
    title: slugToBookName(bookTitle),
  };
}

export default async function ProsperoBookPage({ params }: PageProps) {
  const { bookTitle } = await params;

  const result = await getBook(bookTitle);

  await connectToMongoDB();

  const { authorFirstName, authorLastName, name } =
    await ProsperoLibraryTitleModel.findOne({
      name: slugToBookName(bookTitle),
    }).orFail();

  let pageContent: JSX.Element;

  switch (result.type) {
    case 'fs':
      pageContent = (
        <FlexibleBook
          bookTitle={name}
          bookAuthor={`${authorFirstName} ${authorLastName}`}
          text={result.content}
        />
      );
      break;
    case 'aws':
      pageContent = (
        <ServerBook
          bookTitle={name}
          bookAuthor={`${authorFirstName} ${authorLastName}`}
          bookSlug={bookTitle}
        />
      );
  }

  return (
    <div className="prosperoBookPage">
      <button>
        <a href="/prospero">Back</a>
      </button>
      {pageContent}
    </div>
  );
}
