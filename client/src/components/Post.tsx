import React, { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { BiCommentDots } from "react-icons/bi"
import { AiOutlineLike, AiOutlineSend, AiTwotoneLike } from "react-icons/ai"
import { TbCat, TbDog } from "react-icons/tb"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { CommentInterface } from "../types/postType"
import { dislikePost, likePost, postComment } from "../api/postApi"
import { toast } from "react-hot-toast"
import { useAuth } from "../hooks/useAuth"
import { Comments } from "./Comments"
import autoAnimate from "@formkit/auto-animate"
import { GoCommentDiscussion } from "react-icons/go"

interface PostProps {
  nom: string
  prenom: string
  profilePicture: string
  postPicture: string[]
  description: string
  category: string
  likes: string[]
  commentCount: number
  googleID: string | undefined
  createdAt: Date
  postId: string
  id?: string
  pet: {
    type: "chat" | "chien"
    race: string
    sexe: "male" | "femelle"
    date_de_naissance: Date
    _id: string
  }
}

export const Post: React.FC<PostProps> = ({
  nom,
  prenom,
  profilePicture,
  googleID,
  postPicture,
  likes,
  commentCount,
  description,
  category,
  createdAt,
  postId,
  pet,
  id,
}) => {
  const queryClient = useQueryClient()
  const commentInputRef = useRef<HTMLDivElement>(null)
  const commentsRef = useRef<HTMLDivElement>(null)
  const showDescriptionRef = useRef<HTMLDivElement>(null)
  const token: string = useAuth()?.user?.accessToken as string
  const currenUserId: string = useAuth()?.user?._id as string
  const [fetchComments, setFetchComments] = useState<boolean>(false)
  const [showPostDescription, setShowPostDescription] = useState<boolean>(false)
  const [openComment, setOpenComment] = useState<boolean>(false)
  const [commentInput, setCommentInput] = useState<string>("")
  const timeDiff: number =
    (new Date().getTime() - new Date(createdAt).getTime()) / 1000 / 3600
  //function that calculates pet age
  const calculatePetAge = (birthDate: Date): string => {
    const now = new Date()
    const petAgeDiff = Date.now() - new Date(birthDate).getTime()

    const years = Math.floor(petAgeDiff / (1000 * 60 * 60 * 24 * 365))
    const remainingMonths =
      Math.floor(petAgeDiff / (1000 * 60 * 60 * 24 * 30)) % 12
    if (years > 0 && remainingMonths > 0) {
      return `${years}an${years > 1 ? "s" : ""} et ${remainingMonths}moi${
        remainingMonths > 1 ? "s" : ""
      }`
    } else if (years > 0) {
      return `${years} an${years > 1 ? "s" : ""}`
    } else {
      return `${remainingMonths} moi${remainingMonths > 1 ? "s" : ""}`
    }
  }
  //Comment section
  //--Add comment mutation
  const postCommentMutation = useMutation<
    CommentInterface,
    any,
    { token: string; content: string; postId: string }
  >({
    mutationFn: (variables: {
      token: string
      content: string
      postId: string
    }) => postComment(variables.token, variables.content, variables.postId),
    onError: (err) => toast.error(err.response?.date.err || err.message),
    onSuccess: () => {
      setCommentInput("")
      queryClient.invalidateQueries(["comments"])
      queryClient.invalidateQueries(["posts"])
      queryClient.invalidateQueries(["SinglePost", id])
    },
  })
  //Comment onsubmit
  const handleCommentOnSubmit: React.FormEventHandler<HTMLFormElement> = (
    e
  ) => {
    e.preventDefault()
    if (commentInput === "") return
    postCommentMutation.mutate({ token, content: commentInput, postId })
  }
  useEffect(() => {
    commentInputRef.current && autoAnimate(commentInputRef.current)
  }, [commentInputRef])
  useEffect(() => {
    commentsRef.current && autoAnimate(commentsRef.current)
    showDescriptionRef.current && autoAnimate(showDescriptionRef.current)
  }, [commentsRef, showDescriptionRef])
  //Like post mutation
  const likePostMutation = useMutation<
    { success: boolean; message: string },
    any,
    { token: string; postId: string }
  >({
    mutationFn: (variables: { token: string; postId: string }) =>
      likePost(variables.token, variables.postId),
    onError: (err) => toast.error(err.response?.date.err || err.message),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["posts"])
    },
  })
  //Dislike post mutation
  const dislikePostMutation = useMutation<
    { success: boolean; message: string },
    any,
    { token: string; postId: string }
  >({
    mutationFn: (variables: { token: string; postId: string }) =>
      dislikePost(variables.token, variables.postId),
    onError: (err) => toast.error(err.response?.date.err || err.message),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["posts"])
    },
  })
  return (
    <div className="flex flex-col  p-6 pb-0 space-y-4 overflow-hidden rounded-lg shadow-lg border bg-white border-gray-300 w-full max-w-2xl white:bg-gray-900 dark:text-gray-100">
      <div className="flex justify-between">
        <div className="flex space-x-4">
          <img
            alt="profile picture"
            src={
              googleID
                ? profilePicture
                : `${import.meta.env.VITE_MEDIA_SERVIC}${profilePicture}`
            }
            className=" object-contain object-center w-12 h-12 rounded-full shadow dark:bg-gray-200"
          />
          <div className="flex flex-col space-y-1">
            <Link
              rel="noopener noreferrer"
              to="#"
              className="text-sm font-bold text-gray-600 "
            >
              {nom} {prenom}
            </Link>
            <span className="text-xs dark:text-gray-400">
              {timeDiff >= 1
                ? timeDiff < 24
                  ? `Il y'a ${Math.floor(timeDiff)} heures`
                  : `Il y'a ${Math.floor(timeDiff / 24)} jours`
                : Math.floor(timeDiff * 60) == 0
                ? "A l'instant"
                : `Il y'a ${Math.floor(timeDiff * 60)} minutes`}
            </span>
          </div>
        </div>
        <span
          className={
            category === "adoption"
              ? "py-1 px-2 shadow-md  rounded-3xl bg-accent text-gray-50 font-bold text h-8 flex items-center"
              : "py-1 px-2 shadow-md  rounded-3xl bg-secondary text-gray-50 font-bold text h-8 flex items-center"
          }
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      </div>
      <div>
        <section className="text-accent text-xl font-semibold bg-bgPrimary shadow-lg border border-gray-200 rounded-xl p-4 flex justify-between">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-4 bg-white px-4 py-1 w-fit rounded-full border border-gray-200">
              <span className="text-xs text-primary font-normal">Type</span>
              {pet.type.charAt(0).toUpperCase()}
              {pet.type.slice(1)}
            </div>
            <div className="flex items-center gap-4 bg-white px-4 py-1 w-fit rounded-full border border-gray-200">
              <span className="text-sm text-primary font-normal">Race</span>{" "}
              {pet.race}
            </div>
            <div className="flex items-center gap-4 bg-white px-4 py-1 w-fit rounded-full border border-gray-200">
              <span className="text-sm text-primary font-normal">Sexe</span>{" "}
              {pet.sexe.charAt(0).toUpperCase()}
              {pet.sexe.slice(1)}
            </div>
            <div className="flex items-center gap-4 bg-white px-4 py-1 w-fit rounded-full border border-gray-200">
              <span className="text-sm text-primary font-normal">Age</span>{" "}
              {calculatePetAge(pet.date_de_naissance)}
            </div>
          </div>
          {pet.type === "chat" ? (
            <TbCat className="text-8xl h-full my-auto text-primary" />
          ) : (
            <TbDog className="text-8xl h-full my-auto text-primary" />
          )}
        </section>
        <div className="flex items-end flex-col" ref={showDescriptionRef}>
          <p
            className="text-purple-500 mt-6 mb-1 hover:cursor-pointer hover:underline hover:text-purple-700 w-fit"
            onClick={() => setShowPostDescription((prev) => !prev)}
          >
            Show details
          </p>
          {showPostDescription && (
            <p className="text-lg font-semibold w-full p-4 text-justify bg-bgPrimary rounded-xl border border-gray-200 shadow-lg mt-2 dark:text-gray-700 mb-6">
              {description}
            </p>
          )}
        </div>
        {postPicture && (
          <div className=" carousel rounded-box">
            {postPicture.map((pp, i) => (
              <div className="carousel-item w-full" key={i}>
                <img
                  src={`${import.meta.env.VITE_MEDIA_SERVICE}${pp}`}
                  alt="post images"
                  className="object-contain border  border-gray-200 object-center w-full  h-auto  dark:bg-bgPrimary"
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-wrap justify-between">
        <div className="space-x-2">
          <button
            aria-label="Share this post"
            type="button"
            className="p-2 text-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-4 h-4 fill-current dark:text-violet-400"
            >
              <path d="M404,344a75.9,75.9,0,0,0-60.208,29.7L179.869,280.664a75.693,75.693,0,0,0,0-49.328L343.792,138.3a75.937,75.937,0,1,0-13.776-28.976L163.3,203.946a76,76,0,1,0,0,104.108l166.717,94.623A75.991,75.991,0,1,0,404,344Zm0-296a44,44,0,1,1-44,44A44.049,44.049,0,0,1,404,48ZM108,300a44,44,0,1,1,44-44A44.049,44.049,0,0,1,108,300ZM404,464a44,44,0,1,1,44-44A44.049,44.049,0,0,1,404,464Z"></path>
            </svg>
          </button>
          <button aria-label="Bookmark this post" type="button" className="p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="w-4 h-4 fill-current dark:text-violet-400"
            >
              <path d="M424,496H388.75L256.008,381.19,123.467,496H88V16H424ZM120,48V456.667l135.992-117.8L392,456.5V48Z"></path>
            </svg>
          </button>
        </div>
        <div className="flex space-x-4 text-sm dark:text-gray-400">
          <button
            onClick={() => {
              commentCount !== 0 && setFetchComments((prev) => !prev)
            }}
            className="flex hover:cursor-pointer text-gray-800 items-start p-1 space-x-1.5"
          >
            <GoCommentDiscussion className="text-2xl" />
            <span className="text-lg">{commentCount}</span>
          </button>
          <button
            type="button"
            className="flex items-start text-gray-800 p-1 space-x-1.5"
          >
            {likes.includes(currenUserId) ? (
              <AiTwotoneLike
                className="text-2xl"
                onClick={() =>
                  dislikePostMutation.mutate({ token: token, postId })
                }
              />
            ) : (
              <AiOutlineLike
                className="text-2xl hover:fill-gray-400"
                onClick={() =>
                  likePostMutation.mutate({ token: token, postId })
                }
              />
            )}
            <span className="text-lg">{likes.length}</span>
          </button>
        </div>
      </div>
      <div ref={commentsRef}>
        {fetchComments && <Comments postId={postId} />}
      </div>
      <div className="w-full text-slate-500 border-t pt-3 flex justify-between">
        <div className="w-full font-semibold text-lg flex gap-2 items-center justify-center">
          <span
            onClick={() => setOpenComment(!openComment)}
            className="flex items-center hover:cursor-pointer gap-2"
          >
            <BiCommentDots /> Commenter
          </span>
        </div>
      </div>
      <div ref={commentInputRef}>
        {openComment && (
          <form
            className="w-full relative mb-6"
            onSubmit={handleCommentOnSubmit}
          >
            <input
              type="text"
              name="comment"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              disabled={postCommentMutation.isLoading}
              placeholder="Entrez un commentaire..."
              className="input input-ghost rounded-sm w-full pr-8"
            />
            <button type="submit" disabled={postCommentMutation.isLoading}>
              <AiOutlineSend className="absolute right-1  h-full text-xl hover:cursor-pointer hover:fill-primary  fill-gray-400 top-0 bottom-2" />
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
