import {Dispatch, SetStateAction} from 'react';
import {User} from '../../hooks/use-users-api/types';

export type AppContextProps = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
  logOut: () => void;
};
