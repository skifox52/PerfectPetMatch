import React, { useEffect, useRef, useState } from "react"
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query"
import { AiOutlineClose } from "react-icons/ai"
import { BiDownArrow } from "react-icons/bi"
import { useAuth } from "../hooks/useAuth"
import { fetchComments, type FetchCommentsInterface } from "../api/postApi"

interface CommentsProps {
  postId: string
}

export const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const modalRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const accessToken = useAuth()?.user?.accessToken as string
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
    refetch,
  } = useInfiniteQuery<FetchCommentsInterface>(
    ["comments", postId],
    ({ pageParam = 1 }) =>
      fetchComments({
        postId,
        pageParam,
        token: accessToken,
      }),
    {
      enabled: isModalOpen,
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.pageCount > pages.length) {
          return pages.length + 1
        }
        return undefined
      },
    }
  )
  useEffect(() => {
    refetch()
    queryClient.invalidateQueries(["comments"])
  }, [isModalOpen, postId])
  return (
    <section className="text-gray-800 relative">
      <input
        type="checkbox"
        id="my_modal_7"
        onChange={() => setIsModalOpen((prev) => !prev)}
        checked={isModalOpen}
        ref={modalRef}
        className="modal-toggle"
      />

      <div className="modal">
        <div className="modal-box relative pt-10">
          <label
            className="modal-backdrop absolute hover:bg-error rounded-full group p-1 text-2xl top-1 right-3 cursor-pointer"
            htmlFor="my_modal_7"
          >
            <AiOutlineClose className="fill-error group-hover:fill-white" />
          </label>
          <div className="flex flex-col gap-6 items-center">
            {data?.pages.map((page) =>
              page.pages.map((com) => (
                <section
                  key={com._id}
                  className="w-full flex flex-col gap-2 bg-bgPrimary p-2 rounded-md shadow-md border border-gray-200"
                >
                  <div className="flex gap-4  items-start">
                    <img
                      src={
                        com.userId.googleID
                          ? com.userId.image
                          : `${import.meta.env.VITE_MEDIA_SERVIC}${
                              com.userId.image
                            }`
                      }
                      className="h-10 rounded-full"
                      alt="profile picture"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-xs text-gray-500">
                        {com.createdAt.slice(0, 16).split("T").join(" ")}
                      </span>
                      <p className="font-bold text-sm">
                        {com.userId.nom.toUpperCase()}{" "}
                        {com.userId.prenom.toLowerCase()}
                      </p>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className=" bg-white p-2 text-sm rounded-lg">
                      {com.content}
                    </p>
                  </div>
                </section>
              ))
            )}
          </div>
          {hasNextPage ? (
            <button
              onClick={() => fetchNextPage()}
              className="flex items-center justify-center gap-2 w-full btn btn-sm btn-primary bg-opacity-30 text-slate-950 hover:text-gray-50 mt-8"
            >
              Afficher plus de commentaires <BiDownArrow />
            </button>
          ) : (
            <h1 className="text-center mt-8 font-bold text-slate-700">
              Plus de commentaires à afficher
            </h1>
          )}
        </div>
      </div>
    </section>
  )
}
