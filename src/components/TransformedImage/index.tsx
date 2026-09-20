'use client';

import './index.css';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

import type { Pixels, RGBAValue } from '@/utils/images';

interface Props {
  pixels: Pixels;
}

export function TransformedImage({ pixels }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement) {
      canvasElement.height = pixels.length;
      canvasElement.width = pixels[0].length;

      const context = canvasElement.getContext('2d')!;

      const imageDataArray = [];

      for (let i = 0; i < pixels.length; i++) {
        for (let j = 0; j < pixels[i].length; j++) {
          let pixel = pixels[i][j];

          const { r, g, b, a } = pixel;
          imageDataArray.push(r, g, b, a);
        }
      }

      const imageData = new ImageData(
        new Uint8ClampedArray(imageDataArray),
        canvasElement.width,
        canvasElement.height,
      );

      context.putImageData(imageData, 0, 0);
    }
  }, [pixels, canvasRef.current]);

  return (
    <div
      className={clsx('transformedImageContainer')}
      onClick={() => setZoomed((current) => !current)}
    >
      <canvas
        ref={canvasRef}
        className={clsx('transformedImage', {
          zoomed,
        })}
      />
    </div>
  );
}
