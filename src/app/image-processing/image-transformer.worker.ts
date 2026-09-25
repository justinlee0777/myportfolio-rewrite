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
          transform = createIntensityImageFn(payload.intensityTransform);
          break;
        case 'Quantization':
          transform = createQuantImageFn(payload.quantK);
          break;
        case 'Logarithmic':
          transform = createLogImage(payload.logTransform);
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
        transform = createHistogramEqualizationFn(histograms.Gray!);

        transformedData = transformImage(transform, transformedData);
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

function transformImage(transform?: PixelTransform, data?: ImageDataArray) {
  if (!imageData) {
    throw new Error('No imageData to transform.');
  }

  if (!data) {
    data = imageData.data;
  }

  const transformedData: ImageDataArray = new Uint8ClampedArray(data.length);

  for (let i = 0; i < data.length; i += 4) {
    const x = i % imageData.width,
      y = Math.floor(i / imageData.width);

    let r = data[i],
      g = data[i + 1],
      b = data[i + 2],
      a = data[i + 3];

    if (transform) {
      ({ r, g, b, a } = transform({ r, g, b, a }, x, y, data));
    }

    transformedData[i] = r;
    transformedData[i + 1] = g;
    transformedData[i + 2] = b;
    transformedData[i + 3] = a;
  }

  return transformedData;
}

function createIntensityImageFn(
  intensityTransform: IntensityTransform,
): PixelTransform {
  return ({ r, g, b, a }) => {
    let value = clamp(
      Math.floor(
        (r * intensityTransform.ratios[0]) / 100 +
          (g * intensityTransform.ratios[1]) / 100 +
          (b * intensityTransform.ratios[2]) / 100,
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
}

function createQuantImageFn(quantK: number): PixelTransform {
  const step = Math.floor(255 / (quantK - 1));

  const quantize = (value: number) => Math.floor(value / step) * step;

  return ({ r, g, b, a }) => {
    return {
      r: quantize(r),
      g: quantize(g),
      b: quantize(b),
      a,
    };
  };
}

function createLogImage(
  logTransform: LogarithmicTransformation,
): PixelTransform {
  const logQuantize = (value: number) =>
    clamp(Math.floor(logTransform.c * Math.log(value + 1)), 0, 255);

  return ({ r, g, b, a }) => {
    return {
      r: logQuantize(r),
      g: logQuantize(g),
      b: logQuantize(b),
      a,
    };
  };
}

function createHistogramEqualizationFn(
  grayHistogram: ImageHistogramData,
): PixelTransform {
  const intensityHistogram = getCumulativeHistogram(grayHistogram);

  const totalPixels = intensityHistogram.at(-1)!;

  const np = totalPixels / 256;

  return ({ r, a }) => {
    const value = Math.max(0, Math.round(intensityHistogram[r] / np) - 1);

    return {
      r: value,
      g: value,
      b: value,
      a,
    };
  };
}
