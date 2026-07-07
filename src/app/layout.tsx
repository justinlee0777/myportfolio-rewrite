import './globals.css';
import './layout.css';

import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: "Justin Lee's bag of stuff",
  description: 'A bag of web dev stuff by Justin Lee.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="navbar">
          <a href="/home">Home</a>
          <a href="/cv">CV</a>
          <Image
            className="portraitImage"
            src="/favicon.ico"
            loading="eager"
            width={25}
            height={25}
            alt="A portrait of me, Justin Lee."
          />
        </div>
        {children}
      </body>
    </html>
  );
}
