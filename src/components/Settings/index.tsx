'use client';

import './index.css';

import { useCallback, useEffect, useState, type JSX } from 'react';
import { MdSettings } from 'react-icons/md';
import clsx from 'clsx';

import { cookieName } from '@/consts/settings.const';
import { StoredSettings } from '@/models/settings.model';

import { CommonModal } from '../CommonModal';
import { Radiogroup } from '../Radiogroup/Radiogroup';
import { themes } from './theming.const';

interface Props {
  classes?: {
    button?: string;
    modal?: string;
  };
}

export function Settings({ classes }: Props): JSX.Element {
  const [opened, setOpened] = useState(false);

  const [storedSettings, setStoredSettings] = useState<StoredSettings | null>(
    null,
  );

  const setTheme = useCallback((themeName: string) => {
    const themePrefix = 'theme-';

    for (const [, className] of document.body.classList.entries()) {
      if (className.startsWith(themePrefix)) {
        document.body.classList.remove(className);
      }
    }

    document.body.classList.add(
      `${themePrefix}${themeName.toLowerCase().split(' ').join('-')}`,
    );
  }, []);

  const updateSettings = useCallback(
    (newSettings: StoredSettings) => {
      setStoredSettings(newSettings);

      document.cookie = `${cookieName}=${JSON.stringify(newSettings)}; path=/; max-age=31536000; SameSite=Lax`;
    },
    [setStoredSettings],
  );

  useEffect(() => {
    (async () => {
      const cookieSetting = await cookieStore.get(cookieName);

      if (cookieSetting?.value) {
        const localStoredSettings: StoredSettings = JSON.parse(
          cookieSetting.value,
        );

        setStoredSettings(localStoredSettings);
      }
    })();
  }, [cookieName, setStoredSettings, setTheme]);

  return (
    <>
      <button
        className={clsx('settingsButton', classes?.button)}
        onClick={() => setOpened(true)}
      >
        <MdSettings />
      </button>
      <CommonModal opened={opened} onClose={() => setOpened(false)}>
        <div className="settingsContent">
          <h3>Settings</h3>

          <Radiogroup
            classes={{ fieldset: 'settingsTheme' }}
            selected={storedSettings?.theme}
            header="Theming"
            id="theming"
            type="checkbox"
            options={themes.map(({ name }) => ({ label: name, value: name }))}
            onChange={(value) => {
              setTheme(value);

              updateSettings({ ...storedSettings, theme: value });
            }}
          />
        </div>
      </CommonModal>
    </>
  );
}
