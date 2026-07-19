import './page.css';

import type { Metadata } from 'next';
import { readFile } from 'fs/promises';
import process from 'process';

import { KnuthOnTreesPage } from './KnuthOnTreesPage';
import { join } from 'path';

export const metadata: Metadata = {
  title: `Knuth on Trees`,
  description: `We have some fun with Donald Knuth's discussion on Trees in his famous Art of Computer Programming.`,
};

export default async function Page() {
  const [
    noahFamilyTree,
    indentRepresentation,
    listRepresentation,
    parenthesisRepresentation,
    englishLineage,
  ] = await Promise.all([
    readFile(join(process.cwd(), 'data/knuth-on-trees/noah-family-tree.txt'), {
      encoding: 'utf-8',
    }),
    readFile(
      join(process.cwd(), 'data/knuth-on-trees/indent-representation.txt'),
      { encoding: 'utf-8' },
    ),
    readFile(
      join(process.cwd(), 'data/knuth-on-trees/list-representation.txt'),
      { encoding: 'utf-8' },
    ),
    readFile(
      join(process.cwd(), 'data/knuth-on-trees/parenthesis-representation.txt'),
      { encoding: 'utf-8' },
    ),
    readFile(join(process.cwd(), 'data/knuth-on-trees/english-lineage.txt'), {
      encoding: 'utf-8',
    }),
  ]);

  return (
    <KnuthOnTreesPage
      noahFamilyTree={noahFamilyTree}
      indentRepresentation={indentRepresentation}
      listRepresentation={listRepresentation}
      parenthesisRepresentation={parenthesisRepresentation}
      englishLineage={englishLineage}
    />
  );
}
