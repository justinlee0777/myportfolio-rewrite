import './page.css';

import type { Metadata } from 'next';

import { ProsperoLibraryTitleModel } from '@/orm/prospero/library-title.model';
import connectToMongoDB from '@/utils/connect-to-mongodb.function';

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
    .orFail();

  return (
    <div className="prosperoPage">
      <h1>Prospero Library</h1>
      {books.map(({ name, authorFirstName, authorLastName, urlSlug }) => {
        return (
          <a key={name} className="book" href={`/prospero/${urlSlug}`}>
            <h2>{name}</h2>
            <p>
              By {authorFirstName} {authorLastName}
            </p>
          </a>
        );
      })}
    </div>
  );
}
