'use client';

import clamp from 'lodash-es/clamp';
import chunk from 'lodash-es/chunk';

import {
  getHistogram,
  type HistogramType,
  type RGBAValue,
} from '@/utils/images';

import type {
  IntensityRatios,
  LogarithmicTransformation,
  QuantK,
  TransformationMode,
  WorkerPayload,
} from './ImageProcessingPage';

export interface Payload {
  data: ImageDataArray;
  width: number;
  transformation: TransformationMode;

  intensityRatios: IntensityRatios;
  quantK: QuantK;
  logTransform: LogarithmicTransformation;
}

export interface PixelTransform {
  (value: RGBAValue, x: number, y: number, image: ImageDataArray): RGBAValue;
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
            (r * data.intensityRatios[0]) / 100 +
              (g * data.intensityRatios[1]) / 100 +
              (b * data.intensityRatios[2]) / 100,
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

  const imageData = data.data;

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
  };

  self.postMessage(message);
};
