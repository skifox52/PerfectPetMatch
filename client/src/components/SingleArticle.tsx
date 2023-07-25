import React from "react"
import { ArticleInterface } from "../api/articleApi"
import { Link } from "react-router-dom"

interface SingleArticleProps {
  article: ArticleInterface
  latestArticle: ArticleInterface
}

export const SingleArticle: React.FC<SingleArticleProps> = ({
  article,
  latestArticle,
}) => {
  return (
    <article className="bg-white rounded-xl overflow-hidden relative border border-gray-200 shadow-lg">
      {article._id === latestArticle._id && (
        <span className="absolute top-2 left-3 rounded-full text-white font-semibold bg-error px-1 text-sm border-2 border-red-500">
          Nouveau
        </span>
      )}
      <img
        src={`${import.meta.env.VITE_MEDIA_SERVICE}${article.image}`}
        alt=""
      />
      <div className="p-4">
        <Link
          to={`/articles/${article._id}`}
          className="font-bold text-2xl text-primary"
        >
          {article.title}
        </Link>
        <p className="py-2 text-justify h-20 overflow-hidden">
          {article.content.length > 20
            ? `${article.content.split(" ").slice(0, 20).join(" ")}...`
            : article.content}
        </p>
        <div className="text-sm mt-6">
          <span className="text-gray-400 block hover:text-gray-800">
            <a href={article.source} target="_blank">
              {article.source}
            </a>
          </span>
          <span className="text-gray-400 block">
            <p className="inline-block">
              {article.createdAt.toString().slice(0, 10)}{" "}
              {article.createdAt.toString().slice(11, -8)}
            </p>
          </span>
        </div>
      </div>
    </article>
  )
}
