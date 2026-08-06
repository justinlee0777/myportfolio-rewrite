import { marked } from 'marked';
import DOMPurify, { type Config } from 'isomorphic-dompurify';

export async function getMarkdown(
  content: string,
  allowStyles = false,
): Promise<string> {
  const rawHtml = await marked.parse(content, {});

  let allowStylesConfig: Config | undefined;

  if (allowStyles) {
    allowStylesConfig = {
      ADD_TAGS: ['style'],
      FORCE_BODY: true,
    };
  }

  const sanitizedHtml = DOMPurify.sanitize(rawHtml, allowStylesConfig);

  return sanitizedHtml;
}
