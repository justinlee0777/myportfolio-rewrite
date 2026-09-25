import './index.css';

import clsx from 'clsx';
import { useState } from 'react';

import {
  getCumulativeHistogram,
  type ImageHistogramData,
} from '@/utils/images';

interface Props {
  id: string;
  data: ImageHistogramData;

  className?: string;
}

export function ImageHistogram({ id, data, className }: Props) {
  const [cumulative, setCumulative] = useState(false);

  if (cumulative) {
    data = getCumulativeHistogram(data);
  }

  const greatestCount = Math.max(...data);

  const cumulativeId = `${id}-cumulative`;

  return (
    <div id={id} className="imageHistogramContainer">
      <div>
        <input
          id={cumulativeId}
          type="checkbox"
          checked={cumulative}
          onChange={() => {
            setCumulative((current) => !current);
          }}
        />
        <label htmlFor={cumulativeId}>Cumulative?</label>
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
