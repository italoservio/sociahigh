import {
  ClassAttributes,
  forwardRef,
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react';
import ClosedEyeSVG from '../../assets/svgs/closed-eye.svg';
import OpenedEyeSVG from '../../assets/svgs/opened-eye.svg';

type InputProps = ClassAttributes<HTMLInputElement> &
  InputHTMLAttributes<HTMLInputElement> & {label: string};

export const Input = forwardRef<HTMLInputElement | null, InputProps>((props, ref) => {
  const [type, setType] = useState<HTMLInputTypeAttribute>('text');

  useEffect(() => {
    if (props && props.type) setType(props.type);
  }, [props.type]);

  return (
    <div className='flex flex-col relative'>
      <label
        htmlFor={props.id}
        className='font-sans font-bold mb-1 text-md md:text-lg'
      >
        {props.label}
      </label>
      <input
        {...props}
        ref={ref}
        type={type}
        className={`bg-gray-100 rounded border-2 border-black h-11 pl-3 ${
          props.type === 'password' ? 'pr-12' : 'pr-3'
        } text-lg outline-none transition focus:border-orange-600`}
      />

      {!!props.type && props.type === 'password' && (
        <div
          className={`absolute ${
            type === 'password' ? 'bottom-1' : 'bottom-2'
          } right-3 transition`}
        >
          <button
            type='button'
            onClick={() =>
              setType(prev => (prev === 'text' ? 'password' : 'text'))
            }
          >
            {type === 'password' ? (
              <img src={ClosedEyeSVG} alt={'closed-eye'} />
            ) : (
              <img src={OpenedEyeSVG} alt={'opened-eye'} />
            )}
          </button>
        </div>
      )}
    </div>
  );
});
