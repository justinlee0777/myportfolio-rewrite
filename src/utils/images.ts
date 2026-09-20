import chunk from 'lodash-es/chunk';
import clamp from 'lodash-es/clamp';

export interface RGBAValue {
  r: number;
  g: number;
  b: number;
  a: number;
}

export type Pixels = Array<Array<RGBAValue>>;

export interface PixelTransform {
  (
    value: RGBAValue,
    x: number,
    y: number,
    image: Array<Array<RGBAValue>>,
  ): RGBAValue;
}

export async function getPixels(imageUrl: string): Promise<Pixels> {
  const img = new Image();
  img.src = imageUrl;

  return new Promise((resolve, reject) => {
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

      const matrix: Pixels = Array.from({
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

      resolve(matrix);
    };

    img.onerror = () => {
      reject(new Error(`Could not load image: ${imageUrl}`));
    };
  });
}

export function transformPixels(
  pixels: Pixels,
  transform: PixelTransform,
): Pixels {
  const transformedPixels: Pixels = Array.from({ length: pixels.length }).map(
    (_, i) => Array.from({ length: pixels[i].length }),
  );

  for (let i = 0; i < pixels.length; i++) {
    for (let j = 0; j < pixels[i].length; j++) {
      let pixel = pixels[i][j];

      transformedPixels[i][j] = transform(pixel, j, i, pixels);
    }
  }

  return transformedPixels;
}

export type ImageHistogramData = Array<number>;

export type HistogramType = 'Red' | 'Green' | 'Blue' | 'Gray';

export function getHistogram(
  pixels: Pixels,
  type: HistogramType,
): ImageHistogramData {
  const data: ImageHistogramData = Array.from({ length: 256 }).map(() => 0);

  for (const row of pixels) {
    for (const pixel of row) {
      switch (type) {
        case 'Red':
        case 'Gray': // For Intensity images, R = G = B
          data[pixel.r]++;
          break;
        case 'Green':
          data[pixel.g]++;
          break;
        case 'Blue':
          data[pixel.b]++;
          break;
      }
    }
  }

  return data;
}
