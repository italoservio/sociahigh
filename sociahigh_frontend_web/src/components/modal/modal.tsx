import {Dispatch, SetStateAction} from 'react';
import PureModal from 'react-pure-modal';
import 'react-pure-modal/dist/react-pure-modal.min.css';

type ModalProps = {
  children: JSX.Element;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export function Modal({children, open, setOpen}: ModalProps) {
  return (
    <PureModal
      replace={true}
      isOpen={open}
      onClose={() => {
        setOpen(false);
        return true;
      }}
    >
      <div className='bg-white rounded-md p-5'>
        {children}
      </div>
    </PureModal>
  );
}
