'use client';

import { useEffect, useState } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';

import { getMarkdown } from '@/utils/get-markdown';
import { ProsperoDocument } from '@/components/prospero/Document/Document';

interface Props {
  initialContent: string;
}

export function MarkdownWordProcessor({ initialContent }: Props) {
  const [articleContent, setArticleContent] = useState<string>(initialContent);

  const [htmlContent, setHtmlContent] = useState<string | null>(null);

  useEffect(() => {
    const updateHTMLContent = async () => {
      const content = await getMarkdown(articleContent, true);

      setHtmlContent(content);
    };

    if (htmlContent) {
      const timeoutId = setTimeout(() => {
        updateHTMLContent();
      }, 300);

      return () => {
        clearTimeout(timeoutId);
      };
    } else {
      updateHTMLContent();
    }
  }, [articleContent, htmlContent, setHtmlContent]);

  return (
    <Tabs defaultIndex={0}>
      <TabList className="tabList">
        <Tab>Discussion</Tab>
        <Tab>Editor</Tab>
        <Tab>Rendered Document</Tab>
      </TabList>
      <TabPanel>
        {htmlContent && (
          <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
        )}
      </TabPanel>
      <TabPanel>
        <textarea
          id="markdownEditor"
          className="markdownEditor"
          value={articleContent}
          onChange={(event) => setArticleContent(event.target.value)}
        />
      </TabPanel>
      <TabPanel>
        {htmlContent && (
          <ProsperoDocument htmlContent={htmlContent} pageStyles={{}} />
        )}
      </TabPanel>
    </Tabs>
  );
}
