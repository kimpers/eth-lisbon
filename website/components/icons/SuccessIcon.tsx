import React, { FC } from 'react';

interface SuccessIconProps {
  className?: string;
}

const SuccessIcon: FC<SuccessIconProps> = () => (
  <svg
    width="62"
    height="62"
    viewBox="0 0 62 62"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="31" cy="31" r="31" fill="#5EE11E" />
    <path
      d="M28.6 31.4L24.6 29L23 30.6L28.6 37L39 26.6L37.4 25L28.6 31.4Z"
      fill="black"
    />
  </svg>
);

const MemoizedSuccessIcon = React.memo(SuccessIcon);

export { MemoizedSuccessIcon as SuccessIcon };
