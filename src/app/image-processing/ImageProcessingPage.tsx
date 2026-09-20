'use client';

import { useState } from 'react';
import clamp from 'lodash-es/clamp';

import { TransformedImage } from '@/components/TransformedImage';

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

  let transform: Parameters<typeof TransformedImage>[0]['transform'];

  switch (transformation) {
    case TransformationMode.Intensity:
      transform = ({ r, g, b, a }) => {
        let value = clamp(
          (r * luminanceRatios[0]) / 100 +
            (g * luminanceRatios[1]) / 100 +
            (b * luminanceRatios[2]) / 100,
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

    case TransformationMode.Quantization:
      const step = Math.floor(255 / (quantK - 1));

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

    case TransformationMode.Logarithmic:
      const logQuantize = (value: number) =>
        clamp(logTransform.c * Math.floor(Math.log(value + 1)), 0, 255);

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

  return (
    <div className="imageContainer">
      <TransformedImage
        imageUrl="/image-processing/image.jpeg"
        transform={transform}
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
    </div>
  );
}
