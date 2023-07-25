import { userContext, UserInterface } from './userContext';
import { useContext } from 'react';

export const useAuth = (): {
  user: UserInterface | null;
  setUser: (value: UserInterface | null) => void;
} | null => {
  return useContext(userContext);
};
