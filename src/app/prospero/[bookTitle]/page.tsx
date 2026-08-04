import './page.css';

import type { Metadata } from 'next';
import { cache, JSX } from 'react';
import { readFile, access, constants as fsConstants } from 'fs/promises';
import Link from 'next/link';

import {
  checkGutenbergTextExists,
  checkProsperoTextExists,
} from '@/utils/prospero/check-text-exists.function';
import { FlexibleBook } from '@/components/prospero/FlexibleBook/FlexibleBook';
import { ProsperoLibraryTitleModel } from '@/orm/prospero/library-title.model';
import connectToMongoDB from '@/utils/connect-to-mongodb.function';
import { ServerBook } from '@/components/prospero/ServerBook/ServerBook';
import { getGutenbergText } from '@/utils/prospero/get-gutenberg-text.function';
import { ProsperoLibraryTitle } from '@/models/prospero-library-title.model';
import { getMarkdown } from '@/utils/get-markdown';
import { ProsperoTableOfContentsModel } from '@/orm/prospero/table-of-contents.model';

interface PageProps {
  params: Promise<{ bookTitle: string }>;
}

interface FSBookResult {
  content: string;
  type: 'fs';
}

interface ProsperoTextsResult {
  type: 'prospero-texts';
}

interface GutenbergTextsResult {
  type: 'gutenberg-texts';
}

type BookResult = FSBookResult | ProsperoTextsResult | GutenbergTextsResult;

const getBook = cache(async (slug: string): Promise<BookResult> => {
  const { name } = await getBookDocument(slug);

  const results = await Promise.allSettled([
    new Promise<FSBookResult>(async (resolve, reject) => {
      const fileName = `data/prospero/${slug.toLowerCase().split(' ').join('-')}.txt`;

      try {
        await access(fileName, fsConstants.F_OK);

        const content = await readFile(fileName, { encoding: 'utf-8' });

        resolve({ content, type: 'fs' });
      } catch {
        reject('Not in filesystem.');
      }
    }),
    new Promise<ProsperoTextsResult>(async (resolve, reject) => {
      const exists = await checkProsperoTextExists(slug, 'desktop');

      if (exists) {
        resolve({ type: 'prospero-texts' });
      } else {
        reject('Not on AWS.');
      }
    }),
    new Promise<GutenbergTextsResult>(async (resolve, reject) => {
      const exists = await checkGutenbergTextExists(name);

      if (exists) {
        resolve({ type: 'gutenberg-texts' });
      } else {
        reject('Not downloaded from Gutenberg.');
      }
    }),
  ]);

  const fulfilledRequest = results.find(
    (value) => value.status === 'fulfilled',
  );

  if (fulfilledRequest) {
    return fulfilledRequest.value;
  } else {
    throw new Error(`Book does not exist: ${slug}`);
  }
});

const getBookDocument = cache(
  async (urlSlug: string): Promise<ProsperoLibraryTitle> => {
    await connectToMongoDB();

    return ProsperoLibraryTitleModel.findOne({ urlSlug }).orFail();
  },
);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { bookTitle } = await params;

  const { name } = await getBookDocument(bookTitle);

  return {
    title: name,
  };
}

export default async function ProsperoBookPage({ params }: PageProps) {
  const { bookTitle } = await params;

  const result = await getBook(bookTitle);

  const { authorDisplayName, name } = await getBookDocument(bookTitle);
  let pageContent: JSX.Element;

  switch (result.type) {
    case 'fs':
      pageContent = (
        <FlexibleBook
          bookTitle={name}
          bookAuthor={authorDisplayName}
          text={result.content}
        />
      );
      break;
    case 'prospero-texts':
      const desktopTableOfContents =
          (await ProsperoTableOfContentsModel.findOne({
            textTitle: bookTitle,
            textDescription: 'desktop',
          })
            .select('-_id -sections._id')
            .lean()) ?? undefined,
        mobileTableOfContents =
          (await ProsperoTableOfContentsModel.findOne({
            textTitle: bookTitle,
            textDescription: 'mobile',
          })
            .select('-_id -sections._id')
            .lean()) ?? undefined;

      pageContent = (
        <ServerBook
          bookTitle={name}
          bookAuthor={authorDisplayName}
          bookSlug={bookTitle}
          tableOfContents={{
            desktop: desktopTableOfContents,
            mobile: mobileTableOfContents,
          }}
        />
      );
      break;
    case 'gutenberg-texts':
      let gutenbergText = await getGutenbergText(name);

      gutenbergText = gutenbergText.replaceAll(/^\n/gm, '');

      gutenbergText = await getMarkdown(gutenbergText);

      pageContent = (
        <FlexibleBook
          bookTitle={name}
          bookAuthor={authorDisplayName}
          text={gutenbergText}
        />
      );

      break;
  }

  return (
    <div className="prosperoBookPage">
      <Link href="/prospero">Back</Link>
      {pageContent}
    </div>
  );
}
