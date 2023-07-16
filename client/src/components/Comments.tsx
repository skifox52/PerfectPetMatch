import React, { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { BiDownArrow } from "react-icons/bi"
import { useAuth } from "../hooks/useAuth"
import { fetchComments, type FetchCommentsInterface } from "../api/postApi"
import { SingleComment } from "./SingleComment"

interface CommentsProps {
  postId: string
}

export const Comments: React.FC<CommentsProps> = ({ postId }) => {
  const accessToken = useAuth()?.user?.accessToken as string

  //Ininite scroll for fetching comments
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
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.pageCount > pages.length) {
          return pages.length + 1
        }
        return undefined
      },
      cacheTime: 3600000,
    }
  )

  return (
    <section className="text-gray-800 flex flex-col gap-4 ">
      {data?.pages.map((page) =>
        page.pages.map((com) => (
          <SingleComment com={com} key={com._id} postId={postId} />
        ))
      )}
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
    </section>
  )
}
