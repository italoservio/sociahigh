import {HTMLAttributes, ReactNode} from 'react';

export function Card(props: HTMLAttributes<HTMLDivElement>) {
  const {className, children} = props;
  return (
    <div className={'bg-gray-100 p-3 rounded ' + className || ''}>
      {children}
    </div>
  );
}
