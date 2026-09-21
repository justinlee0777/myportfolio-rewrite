import './index.css';

import clsx from 'clsx';
import { useState } from 'react';

import {
  getCumulativeHistogram,
  type ImageHistogramData,
} from '@/utils/images';

interface Props {
  data: ImageHistogramData;

  className?: string;
}

export function ImageHistogram({ data, className }: Props) {
  const [cumulative, setCumulative] = useState(false);

  if (cumulative) {
    data = getCumulativeHistogram(data);
  }

  const greatestCount = Math.max(...data);

  return (
    <div className="imageHistogramContainer">
      <div>
        <input
          type="checkbox"
          checked={cumulative}
          onChange={() => {
            setCumulative((current) => !current);
          }}
        />
        <label>Cumulative?</label>
      </div>

      <div className={clsx('imageHistogram', className)}>
        {Array.from(data, (frequency, i) => {
          return (
            <div
              key={i}
              className="imageHistogramFrequency"
              style={{
                height: `${((frequency * 100) / greatestCount).toFixed(4)}%`,
              }}
            ></div>
          );
        })}
      </div>
    </div>
  );
}
