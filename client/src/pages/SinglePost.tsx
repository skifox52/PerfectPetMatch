import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { postById } from "../api/postApi"
import { LoadingDog } from "../components/LoadingDog"
import { PostInterface } from "../types/postType"
import toast from "react-hot-toast"
import { Post } from "../components/Post"

interface SinglePostProps {}

export const SinglePost: React.FC<SinglePostProps> = ({}) => {
  const { id } = useParams() as { id: string }
  const { data, isError, error, isLoading } = useQuery<any, any, PostInterface>(
    {
      queryKey: ["SinglePost", id],
      queryFn: () => postById(id as string),
    }
  )
  useEffect(() => {
    if (isError) toast.error(error.response?.data?.err || error.message)
  }, [isError])
  if (isLoading) return <LoadingDog />
  return (
    <div className=" bg-primary bg-opacity-40 flex items-start">
      <div className="w-3/5 mx-auto h-full  bg-bgPrimary px-16 py-8 flex justify-center">
        {data && (
          <Post
            nom={data.owner.nom}
            googleID={data.owner.googleID}
            prenom={data.owner.prenom}
            profilePicture={data.owner.image}
            category={data.category}
            postId={data._id}
            description={data.description}
            postPicture={data.images}
            likes={data.likes}
            commentCount={data.comments.length}
            createdAt={data.createdAt}
            pet={data.pet}
            id={id}
          />
        )}
      </div>
    </div>
  )
}
