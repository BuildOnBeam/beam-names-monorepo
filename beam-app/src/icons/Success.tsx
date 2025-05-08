import { FC, SVGProps } from 'react';

export const SuccessIcon: FC<SVGProps<SVGSVGElement>> = ({
  width = 41,
  height = 32,
  ...props
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    fill="none"
    viewBox="0 0 41 32"
    {...props}
  >
    <path
      stroke="#60FF83"
      strokeLinecap="round"
      strokeWidth="1.5"
      d="M39.645 1 11.02 30.817a.5.5 0 0 1-.722 0L1 21.128"
    />
  </svg>
);
