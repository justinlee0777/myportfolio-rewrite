'use client';

import './ServerBook.css';

import { BookProps, ProsperoBooksElement, registerBooksComponent } from '@prospero-library/web/components.js';
import { ServerPages } from '@prospero-library/web/utils.js'
import { changeOnArrowKeys, turnPageOnClick } from '@prospero-library/web/add-ons/event-listeners';
import { DoublePageBookAnimation, SinglePageBookAnimation } from '@prospero-library/web/add-ons/animations';

import { useCallback, useEffect, useMemo, type JSX } from 'react';

import { desktopStyles, mobileStyles } from '@/consts/server-book-styles.const';

import { Book } from '../Book/Book';

interface Props {
  bookTitle: string;
  bookAuthor: string;
  bookSlug: string;
}

export function ServerBook({
  bookAuthor,
  bookSlug,
  bookTitle,
}: Props): JSX.Element {
  const endpointBase = '/api/prospero';

  useEffect(() => {
    registerBooksComponent();
  })

  const mobilePages = useMemo(
    () => new ServerPages(`${endpointBase}/${bookSlug}/pages/mobile`),
    [],
  );

  const desktopPages = useMemo(
    () => new ServerPages(`${endpointBase}/${bookSlug}/pages/desktop`),
    [],
  );

  const createBooks = useCallback(
    () => {
      function getBookConfig(bookmarkKey: string): Pick<BookProps, 'showBookmark' | 'showPagePicker'> {
        return {
          showBookmark: {
            storage: {
              get: () => JSON.parse(localStorage.getItem(bookmarkKey)!),
              save: (bookmarkData) =>
                localStorage.setItem(bookmarkKey, JSON.stringify(bookmarkData)),
            },
          },
          showPagePicker: true,
        };
      }

      registerBooksComponent();

      const booksElement = document.createElement('prospero-books') as ProsperoBooksElement;

      booksElement.books = [
          {
            getPage: (pageNumber) => mobilePages.get(pageNumber),
            ...mobileStyles,
                      animation: () => new SinglePageBookAnimation(),
          events: {
            onClick: turnPageOnClick,
          },
          pagesShown: 1,
                 ...getBookConfig(`mobile-${bookSlug}-bookmark`),
          },
          {
            config: {
                        getPage: (pageNumber) => desktopPages.get(pageNumber),
                        ...desktopStyles,
          animation: () => new DoublePageBookAnimation(),
          events: {
            onClick: turnPageOnClick,
            onKeyDown: changeOnArrowKeys
          },
          pagesShown: 2,
           ...getBookConfig(`desktop-${bookSlug}-bookmark`),
            },
            media: {
                  minWidth: 750,
            }
          }
        ];

      return booksElement;
    },
    [mobileStyles, desktopStyles],
  );

  return (
    <Book
      bookTitle={bookTitle}
      bookAuthor={bookAuthor}
      createBooks={createBooks}
    >
    </Book>
  );
}
