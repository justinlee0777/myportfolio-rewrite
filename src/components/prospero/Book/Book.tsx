import './Book.css';

import { BooksElement } from 'prospero/types';
import { useEffect, useRef, type JSX } from 'react';
import { loadBookerly } from '@/utils/load-bookerly.function';

interface Props {
  bookTitle: string;
  bookAuthor: string;

  createBooks?: () => BooksElement;
}

export function Book({
  createBooks,
  bookAuthor,
  bookTitle,
}: Props): JSX.Element {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    loadBookerly();
  }, []);

  useEffect(() => {
    if (createBooks) {
      const books = createBooks();

      if (containerRef.current && books) {
        containerRef.current.appendChild(books);
        return () => books.prospero.destroy();
      }
    }
  }, [containerRef, createBooks]);

  return (
    <>
      <h1 className="bookTitle">{bookTitle}</h1>
      <h2 className="bookAuthor">{bookAuthor}</h2>
      <main ref={containerRef}></main>
    </>
  );
}
