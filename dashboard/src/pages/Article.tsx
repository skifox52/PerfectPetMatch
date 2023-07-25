import React, { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addArticle } from '../api/articleApi';
import { useAuth } from '../hooks/useAuth';

interface ArticleProps {}

const Article: React.FC<ArticleProps> = ({}) => {
  const accessToken: string = useAuth()?.user?.accessToken as string;
  const [articleData, setArticleData] = useState<{
    title: string;
    content: string;
    source: string;
  }>({ title: '', content: '', source: '' });
  const [showIsSuccess, setShowIsSuccess] = useState<boolean>(false);
  const [file, setFile] = useState<FileList | null>(null);
  const handleOnChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (e) => {
    setArticleData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  //Add article mutation
  const { mutate, isLoading, isSuccess } = useMutation(
    (variables: { formData: FormData; token: string }) =>
      addArticle(variables.formData, variables.token)
  );
  useEffect(() => {
    if (isSuccess) {
      setShowIsSuccess(true);
      var timer = setTimeout(() => {
        setShowIsSuccess(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [isSuccess]);
  //Handle onsubmit
  const handleOnSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData: FormData = new FormData();
    Object.entries(articleData).forEach(([k, v]) => formData.append(k, v));
    if (file?.length) formData.append('image', file[0]);
    mutate({ formData: formData, token: accessToken });
  };
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {showIsSuccess && (
        <div className="flex w-full border-l-6 border-[#34D399] bg-[#34D399] bg-opacity-[15%] px-7 py-8 shadow-md dark:bg-[#1B1B24] dark:bg-opacity-30 md:p-9">
          <div className="mr-5 flex h-9 w-full max-w-[36px] items-center justify-center rounded-lg bg-[#34D399]">
            <svg
              width="16"
              height="12"
              viewBox="0 0 16 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.2984 0.826822L15.2868 0.811827L15.2741 0.797751C14.9173 0.401867 14.3238 0.400754 13.9657 0.794406L5.91888 9.45376L2.05667 5.2868C1.69856 4.89287 1.10487 4.89389 0.747996 5.28987C0.417335 5.65675 0.417335 6.22337 0.747996 6.59026L0.747959 6.59029L0.752701 6.59541L4.86742 11.0348C5.14445 11.3405 5.52858 11.5 5.89581 11.5C6.29242 11.5 6.65178 11.3355 6.92401 11.035L15.2162 2.11161C15.5833 1.74452 15.576 1.18615 15.2984 0.826822Z"
                fill="white"
                stroke="white"
              ></path>
            </svg>
          </div>
          <div className="w-full">
            <h5 className="mb-3 text-lg font-semibold text-black dark:text-[#34D399] ">
              Article Added successfully
            </h5>
          </div>
        </div>
      )}
      <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">Add article</h3>
      </div>
      <form onSubmit={handleOnSubmit}>
        <div className="p-6.5">
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Title
            </label>
            <input
              type="text"
              name="title"
              onChange={handleOnChange}
              required
              placeholder="Enter your title"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Source
            </label>
            <input
              type="text"
              name="source"
              required
              onChange={handleOnChange}
              placeholder="Enter your source"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>
          <div className="mb-4.5">
            <label className="mb-2.5 block text-black dark:text-white">
              Content
            </label>
            <textarea
              name="content"
              required
              onChange={handleOnChange}
              placeholder="Enter your content"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
            />
          </div>

          <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
            <h3 className="font-medium text-black dark:text-white">
              File upload
            </h3>
          </div>
          <div className="flex flex-col gap-5.5 p-6.5">
            <div>
              <label className="mb-3 block text-black dark:text-white">
                Article image
              </label>
              <input
                type="file"
                required
                onChange={(e) => setFile(e.target.files)}
                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent font-medium outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
              />
            </div>
          </div>

          <button
            disabled={isLoading}
            className={
              isLoading
                ? 'flex w-full justify-center rounded bg-warning p-3 font-medium text-gray'
                : 'flex w-full justify-center rounded bg-primary p-3 font-medium text-gray'
            }
          >
            {isLoading ? 'Loading...' : 'Add article'}
          </button>
        </div>
      </form>
    </div>
  );
};
export default Article;
