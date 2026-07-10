'use client';

import { BookConfig } from 'prospero/types';
import {
  DefaultBookTheme,
  DoublePageBookAnimation,
  FlexibleBookComponent,
  IndentTransformer,
  listenToClickEvents,
  listenToKeyboardEvents,
  SinglePageBookAnimation,
} from 'prospero/web';
import { useMemo, type JSX } from 'react';
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
      (bookmarkKey: string): BookConfig => {
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
        };
      },
    [],
  );

  const createBooks = useMemo(() => {
    if (text) {
      return () =>
        FlexibleBookComponent(
          {
            text,
            pageStyles: {
              computedFontFamily: 'Bookerly',
              computedFontSize: '14px',
              lineHeight: 28,
              padding: {
                top: 36,
                right: 18,
                bottom: 36,
                left: 18,
              },
            },
            mediaQueryList: [
              {
                ...getBookConfig(`${bookTitle}-mobile-key`),
                pagesShown: 1,
                listeners: [listenToClickEvents],
                animation: new SinglePageBookAnimation(),
              },
              {
                pattern: {
                  minWidth: 800,
                },
                config: {
                  ...getBookConfig(`${bookTitle}-desktop-key`),
                  pagesShown: 2,
                  listeners: [listenToClickEvents, listenToKeyboardEvents],
                  theme: DefaultBookTheme,
                  animation: new DoublePageBookAnimation(),
                },
              },
            ],
          },
          { transformers: [new IndentTransformer(4)] },
          {
            styles: {
              width: '80vw',
              height: '80vh',
              maxWidth: '1200px',
              margin: 'auto',
            },
          },
        );
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
