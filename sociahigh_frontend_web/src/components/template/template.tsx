import {ReactNode, useContext, useState} from 'react';
import BackBlackSVG from '../../assets/svgs/back-black.svg';
import BackOrangeSVG from '../../assets/svgs/back-orange.svg';
import MenuBlackSVG from '../../assets/svgs/menu-black.svg';
import MenuOrangeSVG from '../../assets/svgs/menu-orange.svg';
import {AppContext} from '../../contexts/app-context/app-context';
import {Sidebar} from '../sidebar';
import {PageTitle} from '../title';

export function Template(props: {
  children: ReactNode;
  title: string;
  back?: () => void;
  without_side?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currMenuImg, setCurrMenuImg] = useState(MenuBlackSVG);
  const [currBackImg, setCurrBackImg] = useState(BackBlackSVG);
  const {user} = useContext(AppContext);

  if (!Object.keys(user).length) return <></>;

  return (
    <div className='container px-4 py-2 mx-auto h-screen max-w-lg'>
      {!!!props.without_side && (
        <Sidebar open={menuOpen} setOpen={setMenuOpen} />
      )}

      <div className='flex justify-start items-center gap-4 mb-10'>
        <button
          onMouseOver={() => setCurrMenuImg(MenuOrangeSVG)}
          onMouseLeave={() => setCurrMenuImg(MenuBlackSVG)}
          onClick={() => setMenuOpen(true)}
        >
          <img src={currMenuImg} />
        </button>

        {!!('back' in props) && (
          <button
            onMouseOver={() => setCurrBackImg(BackOrangeSVG)}
            onMouseLeave={() => setCurrBackImg(BackBlackSVG)}
            onClick={() => props.back!()}
          >
            <img src={currBackImg} />
          </button>
        )}
        <PageTitle>{props.title}</PageTitle>
      </div>

      {props.children}
    </div>
  );
}
