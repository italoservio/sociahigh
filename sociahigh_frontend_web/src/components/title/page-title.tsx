import classnames from 'classnames';
import {HTMLAttributes} from 'react';

export function PageTitle(props: HTMLAttributes<HTMLHeadElement>) {
  return (
    <h1
      {...props}
      className={classnames('font-serif text-4xl md:text-5xl text-black', {
        [props.className as string]: !!props.className,
      })}
    >
      {props.children}
    </h1>
  );
}
