import React, {
  ClassAttributes,
  forwardRef,
  TextareaHTMLAttributes,
} from 'react';

type TextAreaProps = ClassAttributes<HTMLTextAreaElement> &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {label: string};

export const TextArea = forwardRef<HTMLTextAreaElement | null, TextAreaProps>(
  (props, ref) => {
    return (
      <div className='flex flex-col relative'>
        <label
          htmlFor={props.id}
          className='font-sans font-bold mb-1 text-md md:text-lg'
        >
          {props.label}
        </label>
        <textarea
          {...props}
          ref={ref}
          className={`bg-gray-100 rounded border-2 border-black px-3 py-2 text-lg outline-none transition focus:border-orange-600 resize-none`}
        />
      </div>
    );
  },
);
