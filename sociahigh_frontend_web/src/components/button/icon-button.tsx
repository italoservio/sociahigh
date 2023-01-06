import {ButtonHTMLAttributes} from 'react';

export function IconButton(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    outlined: boolean;
    variant: 'orange' | 'red' | 'green';
  },
) {
  function getProps() {
    const {outlined, variant, ...rest} = props;
    const classes = outlined
      ? `shadow p-2 rounded bg-transparent border-2 border-${variant}-600 text-${variant}-600 transition hover:bg-${variant}-600 hover:text-white active:bg-${variant}-700 active:border-${variant}-700`
      : `shadow p-2 rounded bg-${variant}-500 text-white transition hover:bg-${variant}-600 active:bg-${variant}-700`;
    return {...rest, className: classes};
  }

  return <button {...getProps()}>{props.children}</button>;
}
