import './page.css';

import type { Metadata } from 'next';

import { ProsperoLibraryTitleModel } from '@/orm/prospero/library-title.model';
import connectToMongoDB from '@/utils/connect-to-mongodb.function';
import { ProsperoLibrary } from './ProsperoLibrary';

export const metadata: Metadata = {
  title: 'Prospero: Render text on the web as a book',
  description:
    'A demo of prospero, software that renders text on the web as a book.',
};

export default async function ProsperoPage() {
  await connectToMongoDB();

  const books = await ProsperoLibraryTitleModel.find()
    .select('-_id')
    .lean()
    .sort({ name: 1 })
    .orFail();

  return (
    <div className="prosperoPage">
      <h1>Prospero Library</h1>
      <div className="credit">
        <p>
          Many books are sourced, with many thanks, from{' '}
          <a href="https://www.gutenberg.org/">Project Gutenberg</a>.
        </p>
        <p>
          That being said, this by no means will be a perfect mirror of
          Gutenberg; this is a limited subset of literature.
        </p>
      </div>
      <ProsperoLibrary books={books} />
    </div>
  );
}
