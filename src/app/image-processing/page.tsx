import './page.css';

import type { Metadata } from 'next';

import { ImageProcessingPage } from './ImageProcessingPage';

export const metadata: Metadata = {
  title: `Image Processing`,
  description: `We have some fun implementing some image processing concepts for the web.`,
};

export default async function Page() {
  return (
    <div className="articlePage">
      <ImageProcessingPage />
    </div>
  );
}
