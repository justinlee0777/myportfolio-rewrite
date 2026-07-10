import clsx from 'clsx';

import type { JSX } from 'react';

export interface RadiogroupOption<T extends string> {
  label: string;
  value: T;
}

interface Props<T extends string> {
  id: string;
  options: Array<RadiogroupOption<T>>;
  type: 'checkbox' | 'radio';

  header?: string;
  classes?: {
    fieldset?: string;
    option?: string;
  };
  selected?: T | Array<T>;
  onChange?: (value: T) => void;
}

export function Radiogroup<T extends string>({
  header,
  id,
  options,
  type,
  classes,
  selected,
  onChange,
}: Props<T>): JSX.Element {
  const selectedValues = selected ? ([] as Array<T>).concat(selected) : [];

  return (
    <fieldset id={id} className={clsx('radiogroup', classes?.fieldset)}>
      {header && <legend>{header}</legend>}

      {options.map(({ value, label }) => {
        const radioId = `${id}-${value}-option`;

        return (
          <div
            key={value}
            className={clsx('radiogroupOption', classes?.option)}
          >
            <input
              type={type}
              id={radioId}
              value={value}
              checked={selectedValues.includes(value)}
              onChange={() => {
                onChange?.(value);
              }}
            />
            <label className="radioLabel" htmlFor={radioId}>
              {label}
            </label>
          </div>
        );
      })}
    </fieldset>
  );
}
