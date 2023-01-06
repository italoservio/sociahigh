import {ButtonHTMLAttributes} from 'react';
import classnames from 'classnames';
import {Spinner} from '../spinner';

export function Button(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {
    outlined?: boolean;
    variant: 'orange' | 'red' | 'green';
    block?: boolean;
    loading?: boolean;
  },
) {
  function getProps() {
    const {outlined, variant, block, loading, ...rest} = props;

    const common = {
      'w-full': block,
      'opacity-50 cursor-not-allowed': props.disabled,
      'cursor-progress': props.loading,
      [props.className as string]: !!props.className,
    };

    const classes = outlined
      ? classnames(
          `font-sans uppercase font-semibold text-sm shadow px-2 py-1 rounded bg-transparent border-2 border-${variant}-600 text-${variant}-600 transition hover:bg-${variant}-600 hover:text-white active:bg-${variant}-700 active:border-${variant}-700`,
          common,
        )
      : classnames(
          `font-sans uppercase font-semibold text-sm shadow px-2 py-1 rounded bg-${variant}-500 text-white transition hover:bg-${variant}-600 active:bg-${variant}-700`,
          common,
        );
    return {...rest, className: classes};
  }

  return (
    <button {...getProps()} disabled={props.disabled || props.loading}>
      {props.loading ? <Spinner /> : props.children}
    </button>
  );
}
