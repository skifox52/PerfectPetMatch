import axios from "axios"

export interface ArticleInterface {
  title: string
  content: string
  image: string
  source: string
  createdAt: string
  _id: string
}
//Get all articles
export const getArticles = async (
  token: string,
  page: number = 1
): Promise<{
  articles: ArticleInterface[]
  latestArticle: ArticleInterface[]
  totalPages: number
}> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  try {
    const response = await axios.get<{
      articles: ArticleInterface[]
      totalPages: number
      latestArticle: ArticleInterface[]
    }>(
      `${import.meta.env.VITE_API_GATEWAY}/api/article/all?page=${page}`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
//Get article by id
export const getArticleByID = async (
  token: string,
  id: string
): Promise<ArticleInterface> => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
  try {
    const response = await axios.get<ArticleInterface>(
      `${import.meta.env.VITE_API_GATEWAY}/api/article/one/${id}`,
      config
    )
    return response.data
  } catch (error) {
    throw error
  }
}
