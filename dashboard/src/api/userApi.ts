import axios from 'axios';
import { UserInterface } from '../hooks/userContext';

const gateWayURI: string = 'http://localhost:3333';
const config = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}` } };
};
export interface UserType {
  _id: string;
  nom: string;
  prenom: string;
  mail: string;
  mot_de_passe?: string;
  sexe?: 'homme' | 'femme';
  adresse?: string;
  date_de_naissance?: Date;
  age: number;
  role?: 'user' | 'admin';
  image: string;
  ville?: string;
  googleID?: string;
  resetKey?: string;
}
//Fetch All users
export const fetchAllUsers = async (
  token: string
): Promise<UserType[] | []> => {
  try {
    return (
      await axios.get<UserType[] | []>(
        `${gateWayURI}/api/user/tous`,
        config(token)
      )
    ).data;
  } catch (error) {
    throw error;
  }
};
//Delete a user
export const deleteUser = async (
  token: string,
  id: string
): Promise<{ message: string }> => {
  try {
    await axios.delete(
      `${gateWayURI}/api/user/deleteUser/${id}`,
      config(token)
    );
    return { message: 'User deleted successfully' };
  } catch (error) {
    throw error;
  }
};
//Login the user
export const loginUser = async ({
  mail,
  password,
}: {
  mail: string;
  password: string;
}): Promise<UserInterface> => {
  try {
    const response = await axios.post<UserInterface>(
      `http://localhost:3333/api/auth/login`,
      {
        mail,
        password,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
//Logou | delete refreshToken from the database
export const logoutUser = async (refreshToken: string, token: string) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  try {
    await axios.delete(
      `http://localhost:3333/api/auth/logout?refreshToken=${refreshToken}`,
      config
    );
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    throw error;
  }
};
