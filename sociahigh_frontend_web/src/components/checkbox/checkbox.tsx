import classnames from 'classnames';
import CheckSVG from '../../assets/svgs/check.svg';
import React, {HTMLAttributes} from 'react';

export function Checkbox(
  props: HTMLAttributes<HTMLDivElement> & {checked: boolean},
) {
  const {checked, ...rest} = props;
  return (
    <div
      {...rest}
      className={classnames(
        'shadow p-2 w-8 h-8 rounded-full border-2 border-black cursor-pointer',
        {
          ['bg-gray-200 hover:bg-gray-300']: !checked,
          ['bg-green-500 hover:bg-green-600']: checked,
        },
      )}
    >
      {checked ? <img src={CheckSVG} className='h-full' /> : ''}
    </div>
  );
}
