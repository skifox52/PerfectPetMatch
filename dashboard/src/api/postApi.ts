import axios from 'axios';

const gateWayURI: string = 'http://localhost:3333';
const config = (token: string) => {
  return { headers: { Authorization: `Bearer ${token}` } };
};

//Types
//--Pet type
interface petType {
  type: string;
  race: string;
  sexe: 'male' | 'femelle';
  date_de_naissance: Date;
}
//--Post Type
export interface PostInterface {
  _id: string;
  owner: string;
  comments: string[];
  category: 'adoption' | 'accouplement';
  description: string;
  wilaya: string;
  images: string[];
  pet: petType;
  likes: string[];
  reports: { reason: string; user: string }[];
}
//get all reported posts
export const getReportedPosts = async (
  token: string
): Promise<PostInterface[]> => {
  try {
    return (
      await axios.get<PostInterface[]>(
        `${gateWayURI}/api/post/report`,
        config(token)
      )
    ).data;
  } catch (error) {
    throw error;
  }
};
