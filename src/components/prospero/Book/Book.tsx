import '@/fonts/bookerly/Bookerly.css';
import './Book.css';

import { useEffect, useRef, type JSX } from 'react';

interface Props {
  bookTitle: string;
  bookAuthor: string;

  createBooks?: () => HTMLElement | undefined;
}

export function Book({
  createBooks,
  bookAuthor,
  bookTitle,
}: Props): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (createBooks) {
      const books = createBooks();

      if (containerRef.current && books) {
        books.classList.add('prosperoBook');

        containerRef.current.appendChild(books);

        return () => books.remove();
      }
    }
  }, [containerRef, createBooks]);

  return (
    <>
      <h1 className="bookTitle">{bookTitle}</h1>
      <h2 className="bookAuthor">{bookAuthor}</h2>
      <div ref={containerRef}></div>
    </>
  );
}
