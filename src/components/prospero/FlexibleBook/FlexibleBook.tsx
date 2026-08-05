'use client';

import {
  BookProps,
  ProsperoFlexibleBookElement,
  registerFlexibleBookComponent,
} from '@prospero-library/web/components';
import {
  DoublePageBookAnimation,
  SinglePageBookAnimation,
} from '@prospero-library/web/add-ons/animations';
import {
  changeOnArrowKeys,
  turnPageOnClick,
} from '@prospero-library/web/add-ons/event-listeners';
import { useCallback, useMemo, type JSX } from 'react';

import { Book } from '../Book/Book';

interface Props {
  bookTitle: string;
  bookAuthor: string;
  text: string;
}

export function FlexibleBook({
  bookTitle,
  bookAuthor,
  text,
}: Props): JSX.Element {
  const getBookConfig = useMemo(
    () =>
      (
        bookmarkKey: string,
      ): Pick<BookProps, 'showBookmark' | 'showPagePicker'> => {
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
      },
    [],
  );

  const createBooks = useCallback(() => {
    if (document && text) {
      registerFlexibleBookComponent();

      const flexibleBookElement = document.createElement(
        'prospero-flexible-book',
      ) as ProsperoFlexibleBookElement;

      flexibleBookElement.text = text;
      flexibleBookElement.mediaQueryList = [
        {
          ...getBookConfig(`${bookTitle}-mobile-key`),
          pagesShown: 1,
          pageStyles: {
            'font-family': 'Bookerly',
            'font-size': '14px',
            'line-height': 2,
            padding: '2em 1em',
          },
          containerStyles: {
            height: '80dvh',
            'max-width': '1200px',
            margin: 'auto',
          },
          events: {
            onClick: turnPageOnClick,
          },
          animation: () => new SinglePageBookAnimation(),
        },
        {
          config: {
            ...getBookConfig(`${bookTitle}-desktop-key`),
            pagesShown: 2,
            pageStyles: {
              'font-family': 'Bookerly',
              'font-size': '14px',
              'line-height': 2,
              padding: '2em 1em',
            },
            containerStyles: {
              height: '80dvh',
              'max-width': '1200px',
              margin: 'auto',
            },
            events: {
              onClick: turnPageOnClick,
              onKeyDown: changeOnArrowKeys,
            },
            animation: () => new DoublePageBookAnimation(),
          },
          pattern: {
            minWidth: 800,
          },
        },
      ];

      return flexibleBookElement;
    }
  }, [getBookConfig, text]);

  return (
    <Book
      createBooks={createBooks}
      bookTitle={bookTitle}
      bookAuthor={bookAuthor}
    />
  );
}
