import './page.css';

import path from 'path';
import { readFile } from 'fs/promises';
import type { Metadata } from 'next';

import { MarkdownWordProcessor } from './MarkdownWordProcessor';

export const metadata: Metadata = {
  title: `Mucking around with a Markdown-based Word Processor`,
  description: `We have some fun speculating about a Markdown-based Word Processor that doesn't have a million buttons and features.`,
};

export default async function MarkdownWordProcessorPage() {
  const articlePath = path.join(
    process.cwd(),
    'data/markdown-word-processor/article.md',
  );

  const content = await readFile(articlePath, { encoding: 'utf-8' });

  return (
    <div className="articlePage">
      <h1>Mucking around with a Markdown-based Word Processor</h1>
      <time dateTime="2026-08-06">August 6, 2026</time>
      <MarkdownWordProcessor initialContent={content} />
    </div>
  );
}
