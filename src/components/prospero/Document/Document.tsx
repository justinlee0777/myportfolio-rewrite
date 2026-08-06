'use client';

import './Document.css';

import {
  PageProps,
  ProsperoPageElement,
  ProsperoSlateElement,
  registerPageComponent,
  registerSlateComponent,
} from '@prospero-library/web/components';
import { Pages } from '@prospero-library/web/utils';
import { useEffect, useRef } from 'react';

interface Props {
  htmlContent: string;
  pageStyles: PageProps['styles'];
}

export function ProsperoDocument({ htmlContent, pageStyles }: Props) {
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isCurrent = true;

    (async () => {
      const containerElement = componentRef.current;

      if (containerElement) {
        registerPageComponent();
        registerSlateComponent();

        const parsingElement = document.createElement('div');

        parsingElement.innerHTML = htmlContent;

        const styleElements: Array<HTMLStyleElement> = [];

        for (const styleElement of parsingElement.querySelectorAll('style')) {
          styleElements.push(styleElement);

          styleElement.remove();
        }

        const styleElementString = styleElements.reduce(
          (acc, styleElement) => acc + styleElement.outerHTML,
          '',
        );

        containerElement.innerHTML = styleElementString;

        const slate = document.createElement(
          'prospero-slate',
        ) as ProsperoSlateElement;

        slate.styles = pageStyles;

        containerElement.appendChild(slate);

        const pages = new Pages(
          slate.children.item(0) as HTMLElement,
          htmlContent,
        );

        let i = 0;

        let page = await pages.get(i);

        const pageElements: Array<ProsperoPageElement> = [];

        while (page) {
          const pageElement = document.createElement(
            'prospero-page',
          ) as ProsperoPageElement;

          pageElement.styles = pageStyles;
          pageElement.page = {
            number: i,
            content: page,
          };

          pageElements.push(pageElement);

          await cedeToMainThread();

          page = await pages.get(++i);
        }

        if (isCurrent) {
          for (const pageElement of pageElements) {
            containerElement.appendChild(pageElement);
          }
        }

        async function cedeToMainThread() {
          if ('scheduler' in window) {
            await scheduler.yield();
          } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
        }
      }
    })();

    return () => {
      isCurrent = false;
    };
  }, [htmlContent, pageStyles, componentRef.current]);

  return <div className="prosperoDocument" ref={componentRef}></div>;
}
