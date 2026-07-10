'use client';

import { createTriggerElement } from 'picture-in-picture-js';
import { useEffect, useRef } from 'react';
import { JSX } from 'react/jsx-runtime';

export function TowerOfBabel(): JSX.Element {
  const towerOfBabelRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (towerOfBabelRef.current) {
      const imgElement = towerOfBabelRef.current;

      const element = createTriggerElement(imgElement, {
        replaceWith: true,
        initialize: {
          top: 50,
        },
      });

      element.classList.add('triggerContainer');

      return () => element.remove();
    }
  }, [towerOfBabelRef]);

  return (
    <img
      className="towerOfBabelImg"
      ref={towerOfBabelRef}
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg/960px-Pieter_Bruegel_the_Elder_-_The_Tower_of_Babel_%28Vienna%29_-_Google_Art_Project_-_edited.jpg"
    />
  );
}
