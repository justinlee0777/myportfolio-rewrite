'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState, type JSX } from 'react';

import { ProsperoLibraryTitle } from '@/models/prospero-library-title.model';
import infiniteScroll from '@/utils/infinite-scroll.function';

interface Props {
  books: Array<ProsperoLibraryTitle>;
}

export function ProsperoLibrary({ books }: Props): JSX.Element {
  const pageSize = 12;

  const [searchId] = useMemo(() => ['prosperoLibrarySearch'], []);

  const [entriesShown, setEntriesShown] = useState(pageSize * 2);

  const [search, setSearch] = useState('');

  useEffect(() => {
    const destroyInfiniteScroll = infiniteScroll('.content', () => {
      setEntriesShown(Math.min(entriesShown + pageSize, books.length));
    });

    return () => {
      destroyInfiniteScroll();
    };
  }, [entriesShown]);

  const searchRegex = new RegExp(search, 'i');

  return (
    <div className="prosperoLibrary">
      <div className="filters">
        <label htmlFor={searchId}>Search</label>
        <input
          id={searchId}
          placeholder="Search by author name or book title"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value ?? '');
          }}
        />
      </div>
      {books
        .filter(
          ({ name, authorDisplayName }) =>
            searchRegex.test(name) || searchRegex.test(authorDisplayName),
        )
        .slice(0, entriesShown)
        .map(({ name, authorDisplayName, urlSlug }) => {
          return (
            <Link key={name} className="book" href={`/prospero/${urlSlug}`}>
              <div className="spine"></div>
              <div>
                <h2>{name}</h2>
                <p>By {authorDisplayName}</p>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
