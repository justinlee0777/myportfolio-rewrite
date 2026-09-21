'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import clamp from 'lodash-es/clamp';

import { TransformedImage } from '@/components/TransformedImage';
import { getPixels, Pixels } from '@/utils/images';
import { ImageHistogram } from '@/components/ImageHistogram';

import type { Payload, WorkerPayload } from './image-transformer.worker';

export enum TransformationMode {
  None = 'None',
  Intensity = 'Intensity',
  Quantization = 'Quantization',
  Logarithmic = 'Logarithmic',
}

export interface IntensityTransform {
  ratios: [number, number, number];
  equalize: boolean;
}

export type QuantK = number;

export interface LogarithmicTransformation {
  c: number;
}

export function ImageProcessingPage() {
  const workerRef = useRef<Worker | null>(null);

  const [imageUrl, setImageUrl] = useState('/image-processing/image.jpeg');
  const [originalPixels, setOriginalPixels] = useState<Pixels | null>(null);
  const [pixels, setPixels] = useState<ImageDataArray | null>(null);

  const [histograms, setHistograms] = useState<WorkerPayload['histograms']>({});

  const [transformation, setTransformation] = useState<TransformationMode>(
    TransformationMode.None,
  );

  const [intensityTransform, setIntensityTransform] =
    useState<IntensityTransform>({
      ratios: [29.9, 58.7, 11.4],
      equalize: false,
    });

  const [quantK, setQuantK] = useState<QuantK>(255);

  const [logTransform, setLogTransform] = useState<LogarithmicTransformation>({
    c: 51,
  });

  useEffect(() => {
    async function loadPixels() {
      setOriginalPixels(await getPixels(imageUrl));
    }

    loadPixels();
  }, [imageUrl, setOriginalPixels]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./image-transformer.worker.ts', import.meta.url),
    );

    workerRef.current.onmessage = (event: MessageEvent<WorkerPayload>) => {
      setOriginalPixels((current) => {
        current!.data = new Uint8ClampedArray(event.data.data);

        return current;
      });

      setPixels(event.data.imageData);
      setHistograms(event.data.histograms);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [setOriginalPixels, setPixels, setHistograms]);

  useEffect(() => {
    const worker = workerRef.current;

    if (worker && originalPixels) {
      const event: Payload = {
        data: originalPixels.data.buffer,
        width: originalPixels.width,
        transformation,
        intensityTransform,
        quantK,
        logTransform,
        grayHistogram: histograms.Gray?.buffer,
      };

      worker.postMessage(
        event,
        [originalPixels.data.buffer, histograms.Gray?.buffer].filter(
          Boolean,
        ) as Array<ArrayBufferLike>,
      );
    }
  }, [
    workerRef,
    originalPixels,
    transformation,
    intensityTransform,
    quantK,
    logTransform,
  ]);

  if (!(originalPixels && pixels)) {
    return <>Processing image...</>;
  }

  return (
    <div className="imageContainer">
      <TransformedImage
        data={pixels}
        height={originalPixels.height}
        width={originalPixels.width}
      />

      <label htmlFor="imageTransformation">Transformation</label>

      <select
        id="imageTransformation"
        value={transformation}
        onChange={(event) =>
          setTransformation(event.target.value as TransformationMode)
        }
      >
        {Object.values(TransformationMode).map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      {transformation === TransformationMode.Intensity && (
        <div className="intensityOptions">
          <div>
            <input
              type="checkbox"
              checked={intensityTransform.equalize}
              onChange={() => {
                setIntensityTransform({
                  ...intensityTransform,
                  equalize: !intensityTransform.equalize,
                });
              }}
            />
            <label>Equalize</label>
          </div>

          <label htmlFor="intensityRed">R</label>

          <div className="inputContainer">
            <input
              id="intensityRed"
              type="number"
              min={0}
              max={100}
              value={intensityTransform.ratios[0]}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  setIntensityTransform({
                    ...intensityTransform,
                    ratios: [
                      value,
                      intensityTransform.ratios[1],
                      intensityTransform.ratios[2],
                    ],
                  });
                }
              }}
            />
          </div>

          <label htmlFor="intensityGreen">G</label>

          <div className="inputContainer">
            <input
              id="intensityGreen"
              type="number"
              min={0}
              max={100}
              value={intensityTransform.ratios[1]}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  setIntensityTransform({
                    ...intensityTransform,
                    ratios: [
                      intensityTransform.ratios[0],
                      value,
                      intensityTransform.ratios[2],
                    ],
                  });
                }
              }}
            />
          </div>

          <label htmlFor="intensityBlue">B</label>

          <div className="inputContainer">
            <input
              id="intensityBlue"
              type="number"
              min={0}
              max={100}
              value={intensityTransform.ratios[2]}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  setIntensityTransform({
                    ...intensityTransform,
                    ratios: [
                      intensityTransform.ratios[0],
                      intensityTransform.ratios[1],
                      value,
                    ],
                  });
                }
              }}
            />
          </div>
        </div>
      )}

      {transformation === TransformationMode.Quantization && (
        <>
          <label htmlFor="kQuant">K</label>

          <div className="inputContainer">
            <input
              id="kQuant"
              type="number"
              min={2}
              max={256}
              value={quantK}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  setQuantK(clamp(value, 2, 256));
                }
              }}
            />
          </div>
        </>
      )}

      {transformation === TransformationMode.Logarithmic && (
        <>
          <label htmlFor="logQuantizeC">C</label>

          <div className="inputContainer">
            <input
              id="logQuantizeC"
              type="number"
              value={logTransform.c}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  setLogTransform({
                    c: value,
                  });
                }
              }}
            />
          </div>
        </>
      )}

      {Object.entries(histograms).map(([type, histogram]) => {
        return (
          <Fragment key={type}>
            <h3>{type} Histogram</h3>
            <ImageHistogram data={histogram} />
          </Fragment>
        );
      })}
    </div>
  );
}
