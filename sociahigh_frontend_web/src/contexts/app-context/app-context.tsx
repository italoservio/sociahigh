import {createContext, ReactNode, useEffect, useState} from 'react';
import toast, {Toaster} from 'react-hot-toast';
import {useCoordinator} from '../../hooks/use-coordinator';
import {useUsersAPI} from '../../hooks/use-users-api';
import {User} from '../../hooks/use-users-api/types';
import {public_routes} from '../../routes';
import {ACCESS_TOKEN_KEY} from '../../utils/constants';
import {AppContextProps} from './types';

export const AppContext = createContext({} as AppContextProps);

export default function AppContextProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState({} as User);
  const {profile} = useUsersAPI();
  const {goToLogin} = useCoordinator();

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);

    const in_private_route = !!~public_routes.findIndex(el =>
      location.pathname.startsWith(el.pathname),
    );

    if (!token && in_private_route) {
      logOut();
      return;
    }

    profile()
      .then(response => {
        setUser(response.data);
      })
      .catch(_err => {
        toast.error('Falha ao obter sessão do usuário');
        logOut();
      });
  }, []);

  function logOut() {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    setUser({} as User);
    goToLogin();
  }

  return (
    <AppContext.Provider value={{user, setUser, logOut}}>
      <Toaster />
      {children}
    </AppContext.Provider>
  );
}
