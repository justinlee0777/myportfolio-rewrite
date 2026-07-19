'use client';

import './index.css';

import { ReactNode, useCallback, useRef, type JSX } from 'react';

interface Props {
  code: Function;

  hideRunner?: boolean;
  children?: ReactNode;
}

export function CodeExample({
  code,
  children,
  hideRunner,
}: Props): JSX.Element {
  const outputRef = useRef<HTMLPreElement>(null);

  const reroutedCode = useCallback(
    (...args: Array<any>) => {
      const originalLog = console.log;

      console.log = (...messages) => {
        const outputElement = outputRef.current;

        if (outputElement) {
          for (const message of messages) {
            const pElement = document.createElement('p');
            pElement.textContent = message;

            outputElement.appendChild(pElement);
          }
        }
      };

      try {
        return code.apply(null, args);
      } catch (error) {
        console.log(error);
      } finally {
        console.log = originalLog;
      }
    },
    [code, outputRef],
  );

  const codeContentRegex = /(?:(?:\(\)\W*=>\W*)|(?:function.+)){([\s\S]+)}/;

  const [, codeContent] = code.toString().match(codeContentRegex)!;

  return (
    <>
      <p>
        <code className="codeInput">{codeContent}</code>
      </p>
      {!hideRunner && (
        <>
          <div className="codeExampleActions">
            <button onClick={reroutedCode}>Run</button>
            <button
              onClick={() => {
                if (outputRef.current) {
                  outputRef.current.innerHTML = '';
                }
              }}
            >
              Reset
            </button>
          </div>
          <p>Output:</p>
          <code className="codeOutput" ref={outputRef}></code>
        </>
      )}
      {children}
    </>
  );
}
