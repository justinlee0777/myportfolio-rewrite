'use client';

import 'author-map-ui/author-map-ui.css';

import { AuthorMap, AuthorMapProps } from 'author-map-ui';
import type { JSX } from 'react';

export function AuthorMapClient(props: AuthorMapProps): JSX.Element {
  return <AuthorMap className="authorMap" {...props} />;
}
