import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { fetchAllUsers } from '../api/userApi';
import { SIngleUserTableElement } from '../components/SIngleUserTableElement';

interface UsersProps {}

const Users: React.FC<UsersProps> = ({}) => {
  const [enabledOne, setEnabledOne] = useState<boolean>(false);
  const [enabledTwo, setEnabledTwo] = useState<boolean>(false);
  const [enabledThree, setEnabledThree] = useState<boolean>(false);

  const accessToken: string = useAuth()?.user?.accessToken as string;
  const {
    data: users,
    isLoading,
    isError,
    error: any,
  } = useQuery({
    queryKey: ['users', accessToken],
    queryFn: () => {
      return fetchAllUsers(accessToken);
    },
  });
  return (
    <div>
      <div className="borde6 mb-8 flex justify-around rounded-sm border-stroke bg-white px-5 py-3 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 ">
        <div className="flex items-center justify-center gap-4">
          <h1 className="font-medium text-black dark:text-white">
            Sort by name
          </h1>
          <label
            htmlFor="toggle1"
            className="flex cursor-pointer select-none items-center"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="toggle1"
                className="sr-only"
                disabled={enabledTwo || enabledThree}
                onChange={() => {
                  setEnabledOne(!enabledOne);
                }}
              />
              <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
              <div
                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
                  enabledOne &&
                  '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                }`}
              ></div>
            </div>
          </label>
        </div>
        <div className="flex items-center justify-center gap-4">
          <h1 className="font-medium text-black dark:text-white">
            Sort by role
          </h1>
          <label
            htmlFor="toggle2"
            className="flex cursor-pointer select-none items-center"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="toggle2"
                className="sr-only"
                disabled={enabledOne || enabledThree}
                onChange={() => {
                  setEnabledTwo(!enabledTwo);
                }}
              />
              <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
              <div
                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
                  enabledTwo &&
                  '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                }`}
              ></div>
            </div>
          </label>
        </div>
        <div className="flex items-center justify-center gap-4">
          <h1 className="font-medium text-black dark:text-white">
            Sort by Account type
          </h1>
          <label
            htmlFor="toggle3"
            className="flex cursor-pointer select-none items-center"
          >
            <div className="relative">
              <input
                type="checkbox"
                id="toggle3"
                className="sr-only"
                disabled={enabledOne || enabledTwo}
                onChange={() => {
                  setEnabledThree(!enabledThree);
                }}
              />
              <div className="block h-8 w-14 rounded-full bg-meta-9 dark:bg-[#5A616B]"></div>
              <div
                className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition ${
                  enabledThree &&
                  '!right-1 !translate-x-full !bg-primary dark:!bg-white'
                }`}
              ></div>
            </div>
          </label>
        </div>
      </div>
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                  Name
                </th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                  Role
                </th>
                <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                  Account type
                </th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users?.length &&
                users
                  //@ts-ignore
                  ?.sort((a, b) => {
                    if (!enabledOne && !enabledTwo && !enabledThree) return;
                    if (enabledOne) return a.nom < b.nom && -1;
                    if (enabledTwo) return a.role! < b.role! && -1;
                    if (enabledThree) return a.googleID && -1;
                  })
                  .map((usr) => (
                    <SIngleUserTableElement usr={usr} key={usr._id} />
                  ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Users;
