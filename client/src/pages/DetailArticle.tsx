import { useQuery } from "@tanstack/react-query"
import React from "react"
import { useParams } from "react-router-dom"
import { getArticleByID } from "../api/articleApi"
import { useAuth } from "../hooks/useAuth"

interface DetailArticleProps {}

export const DetailArticle: React.FC<DetailArticleProps> = ({}) => {
  const token = useAuth()?.user?.accessToken as string
  const { id } = useParams()
  const {
    data: article,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["article", id],
    queryFn: () => getArticleByID(token, id as string),
  })
  console.log(article)
  return (
    <div className="p-8 pt-12 w-full">
      <article className="w-[100%] xl:w-[60%] mx-auto bg-white rounded-3xl border border-gray-200 shadow-lg">
        <h1 className="text-[5vw] font-semibold text-primary text-center mb-4">
          {article?.title}
        </h1>
        <div className="w-full h-[50vh]">
          <img
            src={`${import.meta.env.VITE_MEDIA_SERVICE}${article?.image}`}
            alt="article image"
            className="w-full h-full object-cover shadow-lg"
          />
        </div>
        <p className=" text-justify leading-8 p-4 md:p-8 px-8 md:px-8 lg:px-32 text-lg text-gray-600">
          {article?.content}
        </p>
        <div className="flex flex-col items-end p-6 mt-3 text-gray-400 font-semibold">
          <span>
            Source:{" "}
            <a
              href={article?.source}
              target="_blank"
              className="hover:text-gray-600"
            >
              {article?.source}
            </a>
          </span>
          <span>Date d'ajout: {article?.createdAt.slice(0, 10)}</span>
        </div>
      </article>
    </div>
  )
}
