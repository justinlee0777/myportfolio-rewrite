'use client';

import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import clamp from 'lodash-es/clamp';

import { TransformedImage } from '@/components/TransformedImage';
import { getPixels, Pixels } from '@/utils/images';
import { ImageHistogram } from '@/components/ImageHistogram';

import type { MessagePayload, WorkerPayload } from './image-transformer.worker';

export function ImageProcessingPage() {
  return (
    <div className="articlePage">
      <h1>Image Processing</h1>
      <time dateTime="2026-09-24">September 24, 2026</time>
      <p>
        I'm learning image processing. The web is furnished with almost every
        rendering tool and trick, so I thought it'd be fun to apply it in the
        frontend.
      </p>
      <p>
        The below application takes an image and allows the following
        transformations:
      </p>
      <ul>
        <li>
          Creation of a greyscale / intensity / brightness image (this has a
          million terms)
        </li>
        <li>
          A histogram equalization of the above intensity image (not applicable
          to the color images because ... would take too long)
        </li>
        <li>
          Quantization (reducing the range of values each pixel can take ex. [0,
          255] for k = 2, [0, 85, 170, 255] for k = 4)
        </li>
        <li>
          Logarithmic (logarithming the pixel value and multiplying by a
          constant)
        </li>
      </ul>
      <p>
        I'll probably add more transformations in a separate article; I just
        wanted to cap this off for now, as this can literally go on forever.
      </p>
      <p>
        The program transforms the image and also generates histograms for RGB
        values for the image (or the brightness values for intensity images).
      </p>
      <p>
        The histograms were to be used for thresholding and power laws ... next
        time.
      </p>
      <p>
        The code makes use of HTML's canvas element, which can take in image
        URLs and represent them as RGBA values in a flat array.
      </p>
      <p>The transformations output RGBA values in the same data format.</p>
      <p>
        The histograms really strained the processing time, so a Web Worker was
        set up to offput the computation onto another thread.
      </p>
      <p>
        Anything else? Ah, the Worker makes use of a nifty API to directly
        transfer the image bytes to the Worker so as to reduce computation time.
      </p>
      <p>
        As image transformations require more data and images get bigger, I am
        sure I will need to figure out more performant mechanisms.
      </p>
      <p>
        (I can't really separate the histogram ... I could spin up multiple
        workers and do parallel work ... or I could make use of look-up tables
        which is a known image processing technique... Another option is to
        cancel Worker work in the case of rapid changes.)
      </p>
      <p>
        I also didn't figure out a way to represent the metrics of the
        histograms well; hard to figure out where to put the labels and how to
        ensure the text isn't too small. I could use tooltips, but I didn't want
        to implement a tooltip mechanism or install one.
      </p>
      <p>Well, stuff to think about.</p>

      <ImageControlPanel />
    </div>
  );
}

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

const MAX_SIZE_MB = 15;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export function ImageControlPanel() {
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

  const loadPixels = useCallback(
    async (url: string) => {
      const originalPixels = await getPixels(url);
      setOriginalPixels(originalPixels);

      setPixels(null);

      const event: MessagePayload = {
        data: originalPixels.data.buffer,
        width: originalPixels.width,
      };

      workerRef.current!.postMessage(event, [originalPixels.data.buffer]);
    },
    [workerRef, setOriginalPixels],
  );

  useEffect(() => {
    loadPixels(imageUrl);
  }, [imageUrl, loadPixels]);

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('./image-transformer.worker.ts', import.meta.url),
    );

    workerRef.current.onmessage = (event: MessageEvent<WorkerPayload>) => {
      setPixels(event.data.imageData);
      setHistograms(event.data.histograms);
    };

    return () => {
      workerRef.current?.terminate();
    };
  }, [setPixels, setHistograms]);

  useEffect(() => {
    const worker = workerRef.current;

    if (worker) {
      const event: MessagePayload = {
        transformation,
        intensityTransform,
        quantK,
        logTransform,
      };

      worker.postMessage(event);
    }
  }, [workerRef, transformation, intensityTransform, quantK, logTransform]);

  if (!(originalPixels && pixels)) {
    return <>Processing image...</>;
  }

  return (
    <div className="imageContainer">
      <input
        id="imageUpload"
        type="file"
        accept="image/*"
        onChange={async (event) => {
          const file = event.target.files?.[0];

          if (file) {
            if (file.size > MAX_SIZE_BYTES) {
              alert(
                `File is too large. Please select an image under ${MAX_SIZE_MB}MB.`,
              );
            } else {
              const blobUrl = URL.createObjectURL(file);

              await loadPixels(blobUrl);

              URL.revokeObjectURL(blobUrl);
            }

            event.target.value = '';
          }
        }}
      />

      <TransformedImage
        data={pixels}
        height={originalPixels.height}
        width={originalPixels.width}
      />

      <label htmlFor="imageTransformation">Transformation</label>

      <select
        id="imageTransformation"
        value={transformation}
        onChange={(event) => {
          const transformation = event.target.value as TransformationMode;

          setTransformation(transformation);
        }}
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
              id="intensityEqualize"
              type="checkbox"
              checked={intensityTransform.equalize}
              onChange={() => {
                const newTransform = {
                  ...intensityTransform,
                  equalize: !intensityTransform.equalize,
                };
                setIntensityTransform(newTransform);
              }}
            />
            <label htmlFor="intensityEqualize">Equalize</label>
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
            <ImageHistogram id={`histogram-${type}`} data={histogram} />
          </Fragment>
        );
      })}
    </div>
  );
}
