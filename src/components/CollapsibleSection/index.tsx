import clsx from 'clsx';
import { JSX, ReactNode, useState } from 'react';
import { MdArrowDropDown, MdArrowDropUp } from 'react-icons/md';

interface Props {
  initialOpened: boolean;

  classes?: {
    header?: string;
  };
  children?: ReactNode;
  header?: ReactNode;
}

export function CollapsibleSection({
  classes,
  initialOpened,
  children,
  header,
}: Props): JSX.Element {
  const [opened, setOpened] = useState(initialOpened);

  return (
    <div className={clsx('collapsibleSection')}>
      <button
        className={clsx('button', 'collapsibleSectionHeader', classes?.header)}
        onClick={() => setOpened((value) => !value)}
      >
        {header}

        <span className="collapsibleSectionHeaderIcon">
          {opened ? <MdArrowDropUp /> : <MdArrowDropDown />}
        </span>
      </button>

      {opened && children}
    </div>
  );
}
