export type TitleSource = 'Project Gutenberg' | 'Other';

export interface ProsperoLibraryTitle {
  name: string;
  authorFirstName: string;
  authorLastName: string;
  authorDisplayName: string;
  urlSlug: string;
  source: TitleSource;
  sourceUrl: string;
}
