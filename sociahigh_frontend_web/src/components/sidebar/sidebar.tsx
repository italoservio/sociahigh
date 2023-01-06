import {Dispatch, memo, SetStateAction, useContext, useMemo} from 'react';
import HouseSVG from '../../assets/svgs/house.svg';
import LogoutSVG from '../../assets/svgs/logout.svg';
import MailSVG from '../../assets/svgs/mail.svg';
import SongSVG from '../../assets/svgs/song.svg';
import {AppContext} from '../../contexts/app-context/app-context';
import {RoutesEnum} from '../../utils/enums';
import {Link, MenuLink} from '../link';

type SidebarProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export const Sidebar = memo((props: SidebarProps) => {
  const {user, logOut} = useContext(AppContext);

  const menu_routes = useMemo(
    () => [
      {
        icon: HouseSVG,
        link: RoutesEnum.HOME,
        name: 'Página Inicial',
      },
      {
        icon: SongSVG,
        link: RoutesEnum.EVENTS,
        name: 'Meus Eventos',
      },
      {
        icon: MailSVG,
        link: RoutesEnum.INVITATIONS,
        name: 'Meus Convites',
      },
    ],
    [],
  );

  function userInitials() {
    if (Object.keys(user).length)
      return (
        user.first_name.charAt(0).toLocaleUpperCase() +
        user.last_name.charAt(0).toLocaleUpperCase()
      );
    return '';
  }

  if (!props.open) return <></>;

  return (
    <>
      <div
        className='fixed top-0 left-0 h-screen w-screen z-20 bg-neutral-800 opacity-40'
        onClick={() => props.setOpen(false)}
      />
      <nav className='fixed top-0 left-0 h-screen w-64 z-30 bg-white p-5 overflow-auto'>
        <div className='flex justify-start items-center gap-3 mb-14'>
          <div className='flex justify-center items-center bg-neutral-300 rounded-full h-12 w-12 text-white font-bold text-xl'>
            {userInitials()}
          </div>
          <div className='flex flex-col items-start'>
            <b className='font-sans text-lg'>{`${user.first_name} ${user.last_name}`}</b>
            <Link to={'#'}>Editar Perfil</Link>
          </div>
        </div>

        <ul className='flex flex-col gap-4'>
          {menu_routes.map((route, i) => (
            <li key={i} className='flex justify-start items-center gap-3'>
              <img src={route.icon} />
              <MenuLink to={route.link}>{route.name}</MenuLink>
            </li>
          ))}
        </ul>

        <div className='fixed bottom-5 left-5'>
          <span className='flex justify-start items-center gap-3 ba'>
            <img src={LogoutSVG} />
            <MenuLink to={RoutesEnum.LOGIN} onClick={logOut}>
              Sair
            </MenuLink>
          </span>
        </div>
      </nav>
    </>
  );
});
