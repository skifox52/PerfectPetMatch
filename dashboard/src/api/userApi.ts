import axios from 'axios';

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
        `${gateWayURI}/api/user/all`,
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
