'use client';

import clamp from 'lodash-es/clamp';

import {
  getCumulativeHistogram,
  getHistogram,
  type ImageHistogramData,
  type HistogramType,
  type RGBAValue,
} from '@/utils/images';

import type {
  IntensityTransform,
  LogarithmicTransformation,
  QuantK,
  TransformationMode,
} from './ImageProcessingPage';

export type Histograms = {
  [type in HistogramType]?: ImageHistogramData;
};

interface ImageDataPayload {
  data: ArrayBuffer;
  width: number;
}

interface ProcessImagePayload {
  transformation: TransformationMode;

  intensityTransform: IntensityTransform;
  quantK: QuantK;
  logTransform: LogarithmicTransformation;
}

export type MessagePayload = ImageDataPayload | ProcessImagePayload;

export interface PixelTransform {
  (value: RGBAValue, x: number, y: number, image: ImageDataArray): RGBAValue;
}

export interface WorkerPayload {
  histograms: Histograms;
  imageData: ImageDataArray;
}

let imageData:
  | {
      data: ImageDataArray;
      width: number;
    }
  | undefined;

let mostRecentProcessMessage: ProcessImagePayload | undefined;

async function handleMessage(payload: MessagePayload) {
  if ('data' in payload) {
    if (imageData) {
      imageData.data.buffer.transfer(0);
    }
    imageData = {
      data: new Uint8ClampedArray(payload.data),
      width: payload.width,
    };

    if (mostRecentProcessMessage) {
      handleMessage(mostRecentProcessMessage);
    }
  } else {
    mostRecentProcessMessage = payload;
    if (imageData) {
      const { transformation } = payload;

      let transform: PixelTransform | undefined;

      switch (transformation) {
        case 'Intensity':
          transform = ({ r, g, b, a }) => {
            let value = clamp(
              Math.floor(
                (r * payload.intensityTransform.ratios[0]) / 100 +
                  (g * payload.intensityTransform.ratios[1]) / 100 +
                  (b * payload.intensityTransform.ratios[2]) / 100,
              ),
              0,
              255,
            );

            return {
              r: value,
              g: value,
              b: value,
              a,
            };
          };
          break;
        case 'Quantization':
          const step = Math.floor(255 / (payload.quantK - 1));

          const quantize = (value: number) => Math.floor(value / step) * step;

          transform = ({ r, g, b, a }) => {
            return {
              r: quantize(r),
              g: quantize(g),
              b: quantize(b),
              a,
            };
          };
          break;
        case 'Logarithmic':
          const logQuantize = (value: number) =>
            clamp(
              Math.floor(payload.logTransform.c * Math.log(value + 1)),
              0,
              255,
            );

          transform = ({ r, g, b, a }) => {
            return {
              r: logQuantize(r),
              g: logQuantize(g),
              b: logQuantize(b),
              a,
            };
          };
          break;
      }

      let transformedData = transformImage(transform);

      let histogramTypes: Array<HistogramType>;

      switch (transformation) {
        case 'None':
        case 'Logarithmic':
        case 'Quantization':
          histogramTypes = ['Red', 'Green', 'Blue'];
          break;
        case 'Intensity':
          histogramTypes = ['Gray'];
          break;
      }

      const histograms: WorkerPayload['histograms'] = {};

      await Promise.all(
        histogramTypes!.map(async (type) => {
          const data = await getHistogram(transformedData, type);

          histograms[type] = data;
        }),
      );

      if (
        transformation === 'Intensity' &&
        payload.intensityTransform.equalize
      ) {
        const intensityHistogram = getCumulativeHistogram(histograms.Gray!);

        const totalPixels = intensityHistogram.at(-1)!;

        const np = totalPixels / 256;

        const jTransform = transform!;

        transform = (...args) => {
          const j = jTransform(...args);

          const value = Math.max(
            0,
            Math.round(intensityHistogram[j.r] / np) - 1,
          );

          return {
            r: value,
            g: value,
            b: value,
            a: j.a,
          };
        };

        transformedData = transformImage(transform);
      }

      const message: WorkerPayload = {
        histograms,
        imageData: transformedData,
      };

      self.postMessage(message);
    }
  }
}

self.onmessage = (event: MessageEvent<MessagePayload>) =>
  handleMessage(event.data);

function transformImage(transform?: PixelTransform) {
  if (!imageData) {
    throw new Error('');
  }

  const transformedData: ImageDataArray = new Uint8ClampedArray(
    imageData.data.length,
  );

  for (let i = 0; i < imageData.data.length; i += 4) {
    const x = i % imageData.width,
      y = Math.floor(i / imageData.width);

    let r = imageData.data[i],
      g = imageData.data[i + 1],
      b = imageData.data[i + 2],
      a = imageData.data[i + 3];

    if (transform) {
      ({ r, g, b, a } = transform({ r, g, b, a }, x, y, imageData.data));
    }

    transformedData[i] = r;
    transformedData[i + 1] = g;
    transformedData[i + 2] = b;
    transformedData[i + 3] = a;
  }

  return transformedData;
}
