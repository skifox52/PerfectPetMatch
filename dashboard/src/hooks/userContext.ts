import { createContext } from 'react';

export interface UserInterface {
  _id: string;
  role: string;
  accessToken: string;
  refreshToken: string;
}

export const userContext = createContext<{
  user: UserInterface | null;
  setUser: (value: UserInterface | null) => void;
} | null>(null);
