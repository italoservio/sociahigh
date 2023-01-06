import {ReactNode} from 'react';

export function StatusText({
  children,
  variant,
}: {
  children: ReactNode;
  variant: 'orange' | 'red' | 'green';
}) {
  return (
    <div className='flex items-center gap-1'>
      <div className={`h-2 w-2 bg-${variant}-500 rounded-full`}></div>
      <div>{children}</div>
    </div>
  );
}
