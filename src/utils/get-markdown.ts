import { marked } from 'marked';
import DOMPurify from 'isomorphic-dompurify';

export async function getMarkdown(content: string): Promise<string> {
  const rawHtml = await marked.parse(content, {});

  // 2. Sanitize the HTML string to stay safe from XSS attacks
  return DOMPurify.sanitize(rawHtml);
}
