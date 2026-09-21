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

export interface Payload {
  data: ArrayBuffer;
  width: number;
  transformation: TransformationMode;

  intensityTransform: IntensityTransform;
  quantK: QuantK;
  logTransform: LogarithmicTransformation;

  grayHistogram?: ArrayBufferLike;
}

export interface PixelTransform {
  (value: RGBAValue, x: number, y: number, image: ImageDataArray): RGBAValue;
}

export interface WorkerPayload {
  histograms: Histograms;
  imageData: ImageDataArray;

  data: ArrayBuffer;
  grayHistogram?: ArrayBufferLike;
}

self.onmessage = async (event: MessageEvent<Payload>) => {
  const { data } = event;

  const { transformation } = data;

  let transform: PixelTransform | undefined;

  switch (transformation) {
    case 'Intensity':
      transform = ({ r, g, b, a }) => {
        let value = clamp(
          Math.floor(
            (r * data.intensityTransform.ratios[0]) / 100 +
              (g * data.intensityTransform.ratios[1]) / 100 +
              (b * data.intensityTransform.ratios[2]) / 100,
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

      if (data.intensityTransform.equalize) {
        const intensityHistogram = getCumulativeHistogram(
          new Uint32Array(data.grayHistogram!),
        );

        const totalPixels = intensityHistogram.at(-1)!;

        const np = totalPixels / 256;

        const jTransform = transform;

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
      }
      break;
    case 'Quantization':
      const step = Math.floor(255 / (data.quantK - 1));

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
        clamp(Math.floor(data.logTransform.c * Math.log(value + 1)), 0, 255);

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

  const imageData = new Uint8ClampedArray(data.data);

  const transformedData: ImageDataArray = new Uint8ClampedArray(
    imageData.length,
  );

  for (let i = 0; i < imageData.length; i += 4) {
    const x = i % data.width,
      y = Math.floor(i / data.width);

    let r = imageData[i],
      g = imageData[i + 1],
      b = imageData[i + 2],
      a = imageData[i + 3];

    if (transform) {
      ({ r, g, b, a } = transform({ r, g, b, a }, x, y, imageData));
    }

    transformedData[i] = r;
    transformedData[i + 1] = g;
    transformedData[i + 2] = b;
    transformedData[i + 3] = a;
  }

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

  const message: WorkerPayload = {
    histograms,
    imageData: transformedData,
    data: data.data,
    grayHistogram: data.grayHistogram,
  };

  self.postMessage(message, {
    transfer: [event.data.data, event.data.grayHistogram].filter(
      Boolean,
    ) as Array<ArrayBufferLike>,
  });
};
