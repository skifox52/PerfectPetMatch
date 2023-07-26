import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { deletePost, getReportedPosts } from '../api/postApi';
import Loader from '../common/Loader';
import { SinglePost } from '../components/SinglePost';

interface PostsProps {}

const Posts: React.FC<PostsProps> = ({}) => {
  const accessToken = useAuth()?.user?.accessToken as string;
  const { data: posts, isLoading } = useQuery(['posts', accessToken], () => {
    return getReportedPosts(accessToken);
  });

  if (isLoading) return <Loader />;
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <h4 className="text-xl font-semibold text-black dark:text-white">
          Top Products
        </h4>
      </div>

      <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
        <div className="col-span-3 flex items-center">
          <p className="font-medium">Category</p>
        </div>
        <div className="col-span-2 hidden items-center sm:flex">
          <p className="font-medium">Animal</p>
        </div>
        <div className="col-span-1 flex items-center">
          <p className="font-medium">Race</p>
        </div>

        <div className="col-span-1 flex items-center">
          <p className="font-medium">Nombre de signalement</p>
        </div>
      </div>
      {posts?.map((post) => (
        <SinglePost key={post._id} post={post} />
      ))}
    </div>
  );
};
export default Posts;
