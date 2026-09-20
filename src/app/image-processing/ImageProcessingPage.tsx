'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import clamp from 'lodash-es/clamp';

import { TransformedImage } from '@/components/TransformedImage';
import {
  getPixels,
  Pixels,
  HistogramType,
  ImageHistogramData,
  getHistogram,
  PixelTransform,
  transformPixels,
} from '@/utils/images';
import { ImageHistogram } from '@/components/ImageHistogram';

enum TransformationMode {
  None = 'None',
  Intensity = 'Intensity',
  Quantization = 'Quantization',
  Logarithmic = 'Logarithmic',
}

interface LogarithmicTransformation {
  c: number;
}

export function ImageProcessingPage() {
  const [imageUrl, setImageUrl] = useState('/image-processing/image.jpeg');
  const [originalPixels, setOriginalPixels] = useState<Pixels | null>(null);
  const [pixels, setPixels] = useState<Pixels | null>(null);

  const [histograms, setHistograms] = useState<{
    [type in HistogramType]?: ImageHistogramData;
  }>({});

  const [transformation, setTransformation] = useState<TransformationMode>(
    TransformationMode.None,
  );

  const [luminanceRatios, setLuminanceRatios] = useState<
    [number, number, number]
  >([29.9, 58.7, 11.4]);

  const [quantK, setQuantK] = useState(255);

  const [logTransform, setLogTransform] = useState<LogarithmicTransformation>({
    c: 51,
  });

  useEffect(() => {
    async function loadPixels() {
      setOriginalPixels(await getPixels(imageUrl));
    }

    loadPixels();
  }, [imageUrl, setOriginalPixels]);

  const transform: PixelTransform | undefined = useMemo(() => {
    switch (transformation) {
      case TransformationMode.Intensity:
        return ({ r, g, b, a }) => {
          let value = clamp(
            Math.floor(
              (r * luminanceRatios[0]) / 100 +
                (g * luminanceRatios[1]) / 100 +
                (b * luminanceRatios[2]) / 100,
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

      case TransformationMode.Quantization:
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

      case TransformationMode.Logarithmic:
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
  }, [transformation, luminanceRatios, quantK, logTransform]);

  useEffect(() => {
    if (originalPixels) {
      let finalPixels = structuredClone(originalPixels);

      if (transform) {
        finalPixels = transformPixels(finalPixels, transform);
      }

      let histogramTypes: Array<HistogramType>;

      switch (transformation) {
        case TransformationMode.None:
        case TransformationMode.Logarithmic:
        case TransformationMode.Quantization:
          histogramTypes = ['Red', 'Green', 'Blue'];
          break;
        case TransformationMode.Intensity:
          histogramTypes = ['Gray'];
          break;
      }

      setPixels(finalPixels);
      setHistograms(
        histogramTypes.reduce((acc, type) => {
          return {
            ...acc,
            [type]: getHistogram(finalPixels, type),
          };
        }, {}),
      );
    }
  }, [originalPixels, transform, setHistograms]);

  if (!pixels) {
    return <>Processing image...</>;
  }

  return (
    <div className="imageContainer">
      <TransformedImage pixels={pixels} />

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
          <label htmlFor="intensityRed">R</label>

          <div className="inputContainer">
            <input
              id="intensityRed"
              type="number"
              min={0}
              max={100}
              value={luminanceRatios[0]}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  setLuminanceRatios([
                    value,
                    luminanceRatios[1],
                    luminanceRatios[2],
                  ]);
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
              value={luminanceRatios[1]}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  setLuminanceRatios([
                    luminanceRatios[0],
                    value,
                    luminanceRatios[2],
                  ]);
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
              value={luminanceRatios[2]}
              onChange={(event) => {
                const value = Number(event.target.value);
                if (!isNaN(value)) {
                  setLuminanceRatios([
                    luminanceRatios[0],
                    luminanceRatios[1],
                    value,
                  ]);
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
