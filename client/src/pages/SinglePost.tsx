import { useQuery } from "@tanstack/react-query"
import React, { useEffect } from "react"
import { useParams } from "react-router-dom"
import { postById } from "../api/postApi"
import { LoadingDog } from "../components/LoadingDog"
import { PostInterface } from "../types/postType"
import toast from "react-hot-toast"
import { Post } from "../components/Post"
import { fetchUserById } from "../api/userApi"
import { useAuth } from "../hooks/useAuth"

interface SinglePostProps {}

export const SinglePost: React.FC<SinglePostProps> = ({}) => {
  const { id } = useParams() as { id: string }
  const accessToken = useAuth()?.user?.accessToken as string
  const { data, isError, error, isLoading, isFetched } = useQuery<
    any,
    any,
    any
  >({
    queryKey: ["SinglePost", id],
    queryFn: () => postById(id as string),
  })
  const {
    data: owner,
    isError: ownerIsError,
    error: ownerError,
    isLoading: ownerLoading,
  } = useQuery<any, any, any>({
    queryKey: ["owner", data?.owner],
    queryFn: () => fetchUserById(data?.owner!, accessToken),
    enabled: isFetched,
  })
  useEffect(() => {
    if (isError) toast.error(error.response?.data?.err || error.message)
  }, [isError])
  console.log(data?.owner)
  if (isLoading) return <LoadingDog />
  return (
    <div className=" bg-primary bg-opacity-40 min-h-[93vh]  overflow-y-auto flex items-start">
      <div className="w-full lg:w-3/5 mx-auto min-h-[93vh] my-auto  border border-200 shadow-xl  bg-bgPrimary px-2 lg:px-16 py-8 flex justify-center">
        {data && owner && (
          <div className="w-full h-full flex justify-center items-center">
            <Post
              nom={data.owner.nom}
              googleID={owner.googleID}
              prenom={data.owner.prenom}
              profilePicture={owner.image}
              category={data.category}
              postId={data._id}
              description={data.description}
              postPicture={data.images}
              likes={data.likes}
              commentCount={data.comments.length}
              createdAt={data.createdAt}
              pet={data.pet}
              id={id}
              wilaya={data.wilaya}
            />
          </div>
        )}
      </div>
    </div>
  )
}
