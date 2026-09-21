import chunk from 'lodash-es/chunk';
import clamp from 'lodash-es/clamp';

export interface RGBAValue {
  r: number;
  g: number;
  b: number;
  a: number;
}

export class Pixels {
  constructor(
    public data: ImageDataArray,
    public width: number,
    public height: number,
  ) {}

  *[Symbol.iterator]() {
    const chunkedData = chunk(this.data, 4);

    for (let i = 0; i < chunkedData.length; i++) {
      const [r, g, b, a] = chunkedData[i];

      const x = i % this.width,
        y = Math.floor(i / this.width);

      const rgbaValue: RGBAValue = {
        r,
        g,
        b,
        a,
      };

      const value: [RGBAValue, number, number] = [rgbaValue, x, y];

      yield value;
    }
  }
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
      const pixels = new Pixels(imageData.data, img.width, img.height);

      resolve(pixels);
    };

    img.onerror = () => {
      reject(new Error(`Could not load image: ${imageUrl}`));
    };
  });
}

export type ImageHistogramData = Uint32Array;

export type HistogramType = 'Red' | 'Green' | 'Blue' | 'Gray';

export function getHistogram(
  imageData: ImageDataArray,
  type: HistogramType,
): ImageHistogramData {
  const data: ImageHistogramData = Uint32Array.from({ length: 256 }).map(
    () => 0,
  );

  for (const [r, g, b] of chunk(imageData, 4)) {
    switch (type) {
      case 'Red':
      case 'Gray': // For Intensity images, R = G = B
        data[r]++;
        break;
      case 'Green':
        data[g]++;
        break;
      case 'Blue':
        data[b]++;
        break;
    }
  }

  return data;
}

export function getCumulativeHistogram(
  data: ImageHistogramData,
): ImageHistogramData {
  let sum = 0;

  return data.map((value) => (sum += value));
}
