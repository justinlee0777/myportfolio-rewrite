'use client';

import './index.css';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';

interface Props {
  data: ImageDataArray;
  width: number;
  height: number;
}

export function TransformedImage({ data, height, width }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (canvasElement) {
      canvasElement.height = height;
      canvasElement.width = width;

      const context = canvasElement.getContext('2d')!;

      const imageData = new ImageData(
        data,
        canvasElement.width,
        canvasElement.height,
      );

      context.putImageData(imageData, 0, 0);
    }
  }, [data, height, width, canvasRef.current]);

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
