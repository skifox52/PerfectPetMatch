import React, { useState } from "react"
import articleProfile from "../assets/pictures/articlePage.jpg"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "../hooks/useAuth"
import { getArticles, type ArticleInterface } from "../api/articleApi"
import { SingleArticle } from "../components/SingleArticle"
import { Link } from "react-router-dom"
import { LoadingDog } from "../components/LoadingDog"

interface ArticlesProps {}

export const Articles: React.FC<ArticlesProps> = ({}) => {
  const token = useAuth()?.user?.accessToken
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["articles", currentPage],
    queryFn: () => getArticles(token!, currentPage),
  })
  //Pagination section
  const paginationOnclick: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const pageText = (e.currentTarget as HTMLButtonElement).textContent
    setCurrentPage(Number(pageText))
  }
  const pagination = Array.from({ length: data?.totalPages! }, (_, i) => {
    return (
      <button
        key={i}
        onClick={paginationOnclick}
        className={
          i + 1 === currentPage
            ? "join-item btn rounded-none btn-primary bg-opacity-40 btn-active text-white font-bold"
            : "join-item rounded-none btn btn-primary text-white font-bold"
        }
      >
        {i + 1}
      </button>
    )
  })
  if (isLoading) return <LoadingDog />
  return (
    <div className="bg-bgPrimary pb-8">
      <header className="h-64 w-full relative shadow-lg">
        <h1 className="absolute top-1/2 left-8 max-w-[60vw] -translate-y-1/2 text-gray-50 font-bold text-8xl">
          Articles et conseils
        </h1>
        <img
          src={articleProfile}
          alt="article header"
          className="max-h-full w-full object-cover"
        />
      </header>
      <section className=" w-3/5 mx-auto">
        <article className="w-full relative mx-auto my-16 h-96 overflow-hidden flex bg-white rounded-2xl border border-gray-200 shadow-lg">
          <span className="absolute right-4 top-6 rounded-full text-white font-bold bg-error px-2 py-1 border-2 border-red-500">
            Nouveau
          </span>
          <img
            src={`${import.meta.env.VITE_MEDIA_SERVICE}${
              data?.latestArticle[0].image
            }`}
            alt="article image"
            className="h-full w-2/5 object-center object-cover"
          />
          <div className="px-16 py-4">
            <Link
              to={`/articles/${data?.latestArticle[0]._id}`}
              className="text-6xl text-primary font-semibold "
            >
              {data?.latestArticle[0].title}
            </Link>
            <span className="text-gray-400 block">
              Source:{" "}
              <a
                href={data?.latestArticle[0].source}
                className="hover:text-gray-800"
                target="_blank"
              >
                {data?.latestArticle[0].source}
              </a>
            </span>
            <span className="text-gray-400 block">
              <p className="inline-block">
                {data?.latestArticle[0].createdAt.toString().slice(0, 10)}{" "}
                {data?.latestArticle[0].createdAt.toString().slice(11, -8)}
              </p>
            </span>
            <p className="mt-4 text-justify">
              {data?.latestArticle[0].content.length! > 150
                ? `${data?.latestArticle[0].content
                    .split(" ")
                    .slice(0, 150)
                    .join(" ")}...`
                : data?.latestArticle[0].content}
            </p>
          </div>
        </article>
        <div className="grid grid-cols-4 gap-4">
          {data?.articles.map((article, i) => (
            <SingleArticle
              article={article}
              key={article._id}
              latestArticle={data.latestArticle[0]}
            />
          ))}
        </div>
      </section>
      <div className="join w-fit rounded-lg overflow-hidden mx-auto mt-16">
        {pagination}
      </div>
    </div>
  )
}
