export type TitleTag = 'essay' | 'novel' | 'play' | 'novella';

export type TitleField =
  'fiction' | 'computer science' | 'philosophy' | 'satire';

export type TitleSource = 'Project Gutenberg' | 'Other';

export interface ProsperoLibraryTitle {
  name: string;
  authorFirstName: string;
  authorLastName: string;
  fields: Array<TitleField>;
  tags: Array<TitleTag>;
  urlSlug: string;
  source: TitleSource;
  sourceUrl: string;
}
