'use client';

import './index.css';

import { useEffect, useRef, useState } from 'react';
import chunk from 'lodash-es/chunk';
import clsx from 'clsx';

interface RGBAValue {
  r: number;
  g: number;
  b: number;
  a: number;
}

interface Props {
  imageUrl: string;

  transform?: (
    value: RGBAValue,
    x: number,
    y: number,
    image: Array<Array<RGBAValue>>,
  ) => RGBAValue;
}

export function TransformedImage({ imageUrl, transform }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [loading, setLoading] = useState(true);

  const [loadedPixels, setLoadedPixels] = useState<Array<
    Array<RGBAValue>
  > | null>(null);

  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    setLoading(true);

    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const canvasElement = document.createElement('canvas');

      canvasElement.height = img.height;
      canvasElement.width = img.width;

      const context = canvasElement.getContext('2d')!;

      context.drawImage(img, 0, 0);

      const imageData = context.getImageData(
        0,
        0,
        canvasElement.width,
        canvasElement.height,
      );
      const pixels = imageData.data;

      const chunkedPixels = chunk(pixels, 4);

      const matrix: Array<Array<RGBAValue>> = Array.from({
        length: canvasElement.height,
      }).map(() => Array.from({ length: canvasElement.width }));

      for (let i = 0; i < chunkedPixels.length; i++) {
        const [r, g, b, a] = chunkedPixels[i];

        const x = i % canvasElement.width,
          y = Math.floor(i / canvasElement.width);

        matrix[y][x] = {
          r,
          b,
          g,
          a,
        };
      }

      setLoadedPixels(matrix);

      setLoading(false);
    };

    img.onerror = () => {
      setLoading(false);
    };
  }, [imageUrl, setLoading]);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement && loadedPixels) {
      canvasElement.height = loadedPixels.length;
      canvasElement.width = loadedPixels[0].length;

      const context = canvasElement.getContext('2d')!;

      const pixels = [];

      for (let i = 0; i < loadedPixels.length; i++) {
        for (let j = 0; j < loadedPixels[i].length; j++) {
          let pixel = loadedPixels[i][j];

          if (transform) {
            pixel = transform(pixel, j, i, loadedPixels);
          }

          const { r, g, b, a } = pixel;
          pixels.push(r, g, b, a);
        }
      }

      const imageData = new ImageData(
        new Uint8ClampedArray(pixels),
        canvasElement.width,
        canvasElement.height,
      );

      context.putImageData(imageData, 0, 0);
    }
  }, [loadedPixels, canvasRef.current, transform]);

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
