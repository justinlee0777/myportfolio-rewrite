'use client';

import './ServerBook.css';

import { BookConfig, BooksElement } from 'prospero/types';
import {
  BookComponent,
  BooksComponent,
  DefaultBookTheme,
  DoublePageBookAnimation,
  listenToClickEvents,
  listenToKeyboardEvents,
  LoadingScreenComponent,
  ServerPages,
  SinglePageBookAnimation,
} from 'prospero/web';
import { useMemo, type JSX } from 'react';

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

  const mobilePages = useMemo(
    () => new ServerPages(`${endpointBase}/${bookSlug}/pages/mobile`),
    [],
  );

  const desktopPages = useMemo(
    () => new ServerPages(`${endpointBase}/${bookSlug}/pages/desktop`),
    [],
  );

  const createBooks = useMemo(
    () => () => {
      function getBookConfig(bookmarkKey: string): BookConfig {
        return {
          showBookmark: {
            storage: {
              get: () => JSON.parse(localStorage.getItem(bookmarkKey)!),
              save: (bookmarkData) =>
                localStorage.setItem(bookmarkKey, JSON.stringify(bookmarkData)),
            },
          },
          showPagePicker: true,
          theme: DefaultBookTheme,
          loading: LoadingScreenComponent,
        };
      }

      const desktopBook = BookComponent(
        {
          getPage: (pageNumber) => desktopPages.get(pageNumber),
          pageStyles: desktopStyles,
        },
        {
          animation: new DoublePageBookAnimation(),
          listeners: [listenToClickEvents, listenToKeyboardEvents],
          pagesShown: 2,
          media: {
            minWidth: 750,
          },
          tableOfContents: fetch(
            `${endpointBase}/${bookSlug}/table-of-contents/desktop`,
          ).then((response) => response.json()),
          ...getBookConfig(`desktop-${bookSlug}-bookmark`),
        },
        { classnames: ['book'] },
      );

      const mobileBook = BookComponent(
        {
          getPage: (pageNumber) => mobilePages.get(pageNumber),
          pageStyles: mobileStyles,
        },
        {
          animation: new SinglePageBookAnimation(),
          listeners: [listenToClickEvents],
          pagesShown: 1,
          tableOfContents: fetch(
            `${endpointBase}/${bookSlug}/table-of-contents/mobile`,
          ).then((response) => response.json()),
          ...getBookConfig(`mobile-${bookSlug}-bookmark`),
        },
        { classnames: ['book'] },
      );

      return BooksComponent({
        children: [mobileBook, desktopBook],
      });
    },
    [mobileStyles, desktopStyles],
  );

  return (
    <Book
      createBooks={createBooks as () => BooksElement}
      bookTitle={bookTitle}
      bookAuthor={bookAuthor}
    />
  );
}
