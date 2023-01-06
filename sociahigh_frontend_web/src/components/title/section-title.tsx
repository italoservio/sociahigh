import {HTMLAttributes} from 'react';

export function SectionTitle(props: HTMLAttributes<HTMLHeadElement>) {
  return (
    <h1
      {...props}
      className='font-sans font-bold text-xl md:text-2xl text-black'
    >
      {props.children}
    </h1>
  );
}
