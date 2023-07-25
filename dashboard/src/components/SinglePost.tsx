import React, { useState } from 'react';
import { PostInterface } from '../api/postApi';

interface SinglePostProps {
  post: PostInterface;
}

export const SinglePost: React.FC<SinglePostProps> = ({ post }) => {
  const reasons: any = [
    'Signalement pour une publication inappropriée',
    'Signalement pour un comportement abusif dans les commentaires',
    'Signalement pour un faux compte ou une arnaque',
    'Signalement pour une annonce suspecte',
  ] as const;
  //   const reasonOne: any = post.reports.filter(
  //     (rep) => rep.reason === reasons[0]
  //   );
  //   const reasonTwo: any = post.reports.filter(
  //     (rep) => rep.reason === reasons[1]
  //   );
  //   const reasonnThree: any = post.reports.filter(
  //     (rep) => rep.reason === reasons[2]
  //   );
  const [showModal, setShowModal] = useState<boolean>(false);
  return (
    <div className="grid grid-cols-6 border-t border-stroke px-4 py-4.5 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
      <div className="col-span-3 flex items-center">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="h-12.5 w-15  rounded-full">
            <img
              src={
                post.images.length > 0
                  ? `http://localhost:5555${post.images[0]}`
                  : 'https://static.thenounproject.com/png/2616533-200.png'
              }
              alt="Product"
              className="rounded-md"
            />
          </div>

          <p className="text-sm text-black dark:text-white">{post.category}</p>
        </div>
      </div>
      <div className="col-span-2 hidden items-center sm:flex">
        <p className="text-sm text-black dark:text-white">{post.pet.type}</p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="text-sm text-black dark:text-white">{post.pet.race}</p>
      </div>
      <div className="col-span-1 flex items-center">
        <p className="text-lg text-black">
          <button
            onClick={() => setShowModal(!showModal)}
            className="inline-flex items-center justify-center rounded-md bg-primary px-0 py-1 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            {post.reports.length}{' '}
            {post.reports.length === 1 ? 'Signalement' : 'Signalements'}
          </button>
        </p>
      </div>
      {showModal ? (
        <>
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none">
            <div className="relative mx-auto my-6 w-auto max-w-3xl">
              <div className="relative flex w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none">
                <div className="flex items-center justify-between rounded-t  p-5">
                  <h3 className="w-full text-center text-xl font-semibold">
                    Signalements
                  </h3>
                </div>
                <section className="relative flex  w-auto flex-auto flex-col gap-1 p-6">
                  {reasonOne && (
                    <div className="border-t-r-secondary flex w-full items-center justify-between gap-4 border-b  border-y-bodydark1 p-3 ">
                      <span className="text-lg font-medium text-black dark:text-white">
                        {reasonOne}
                      </span>
                      <span>{reasonOne.length}</span>
                    </div>
                  )}
                  {/* {reasonTwo.length > 0 && (
                    <div className="border-t-r-secondary flex w-full items-center justify-between gap-4 border-b  border-y-bodydark1 p-3 ">
                      <span className="text-lg font-medium text-black dark:text-white">
                        {reasonTwo}
                      </span>
                      <span>{reasonTwo.length}</span>
                    </div>
                  )}
                  {reasonnThree.length > 0 && (
                    <div className="border-t-r-secondary flex w-full items-center justify-between gap-4 border-b  border-y-bodydark1 p-3 ">
                      <span className="text-lg font-medium text-black dark:text-white">
                        {reasonnThree}
                      </span>
                      <span>{reasonnThree.length}</span>
                    </div>
                  )} */}
                </section>

                <div className="flex items-center justify-end   p-6">
                  <button
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
        </>
      ) : null}
    </div>
  );
};
