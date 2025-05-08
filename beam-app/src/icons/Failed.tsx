import { FC, SVGProps } from 'react';

export const FailedIcon: FC<SVGProps<SVGSVGElement>> = ({
  width = 49,
  height = 49,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 49 49"
    {...props}
  >
    <path
      stroke="#FF4539"
      strokeLinecap="round"
      strokeWidth="1.5"
      d="M47.804 47.8 1.004 1M47.8 1 1 47.8"
    />
  </svg>
);
