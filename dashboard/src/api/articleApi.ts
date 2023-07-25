import axios from 'axios';

const gateWayURI: string = 'http://localhost:3333';
const config = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}` } };
};
//Add article
export const addArticle = async (
  formData: FormData,
  token: string
): Promise<{ message: string }> => {
  try {
    await axios.post(`${gateWayURI}/api/article`, formData, config(token));
    return { message: 'Article added successfylly!' };
  } catch (error) {
    throw error;
  }
};
