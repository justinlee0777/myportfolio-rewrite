'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type JSX } from 'react';

import { ProsperoLibraryTitle } from '@/models/prospero-library-title.model';
import infiniteScroll from '@/utils/infinite-scroll.function';

interface Props {
  books: Array<ProsperoLibraryTitle>;
}

export function ProsperoLibrary({ books }: Props): JSX.Element {
  const pageSize = 12;

  const listingElementRef = useRef<HTMLDivElement>(null);

  const [entriesShown, setEntriesShown] = useState(pageSize * 2);

  useEffect(() => {
    if (listingElementRef.current) {
      const destroyInfiniteScroll = infiniteScroll('.content', () => {
        setEntriesShown(Math.min(entriesShown + pageSize, books.length));
      });

      return () => {
        destroyInfiniteScroll();
      };
    }
  }, [entriesShown]);

  return (
    <div className="prosperoLibrary" ref={listingElementRef}>
      {books
        .slice(0, entriesShown)
        .map(({ name, authorDisplayName, urlSlug }) => {
          return (
            <Link key={name} className="book" href={`/prospero/${urlSlug}`}>
              <h2>{name}</h2>
              <p>By {authorDisplayName}</p>
            </Link>
          );
        })}
    </div>
  );
}
