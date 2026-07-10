import './globals.css';
import './layout.css';

import Image from 'next/image';

import { Settings } from '@/components/Settings';
import { cookies } from 'next/headers';
import { cookieName } from '@/consts/settings.const';
import { StoredSettings } from '@/models/settings.model';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const settingsString = cookieStore.get(cookieName)?.value;

  let themeClass: string | undefined;

  if (settingsString) {
    const settings: StoredSettings = JSON.parse(settingsString);

    if (settings.theme) {
      themeClass = `theme-${settings.theme.toLowerCase().split(' ').join('-')}`;
    }
  }

  return (
    <html lang="en">
      <body className={themeClass}>
        <div className="navbar">
          <a href="/">Home</a>
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
        <div className="content">
          {children}
          <Settings classes={{ button: 'settingsPrompt' }} />
        </div>
      </body>
    </html>
  );
}
