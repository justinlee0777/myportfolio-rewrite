import './index.css';

import clsx from 'clsx';

import type { ImageHistogramData, Pixels } from '@/utils/images';

interface Props {
  data: ImageHistogramData;

  className?: string;
}

export function ImageHistogram({ data, className }: Props) {
  return (
    <div className={clsx('imageHistogram', className)}>
      {data.map((frequency, i) => {
        return (
          <div
            key={i}
            className="imageHistogramFrequency"
            style={{ height: `${frequency * 0.1}px` }}
          ></div>
        );
      })}
    </div>
  );
}
