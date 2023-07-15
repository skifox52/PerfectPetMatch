import React, { useState } from "react"
import { FiEdit3 } from "react-icons/fi"
import { AiFillDelete } from "react-icons/ai"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { deleteComment, updateComment } from "../api/postApi"
import toast from "react-hot-toast"
import { useAuth } from "../hooks/useAuth"
import { CommentInterface } from "../types/postType"
interface SingleCommentProps {
  com: CommentInterface
  postId: string
}

export const SingleComment: React.FC<SingleCommentProps> = ({
  com,
  postId,
}) => {
  const accessToken = useAuth()?.user?.accessToken as string
  const [currentCommentValue, setCurrentCommentValue] = useState<string>(
    com.content
  )
  const [editComment, setEditComment] = useState<boolean>(false)
  const currentUserId = useAuth()?.user?._id as string
  const queryClient = useQueryClient()
  //Mutation for delete comment
  const deleteCommentMutation = useMutation<
    { success: boolean; message: string },
    any,
    { token: string; commentId: string }
  >({
    mutationFn: (variables: { token: string; commentId: string }) =>
      deleteComment(variables.token, variables.commentId),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries(["comments", postId])
    },
    onError: (err) => {
      toast.error(err.response?.data.err || err.message)
    },
  })
  //Mutation for updating a comment
  const updateCommentMutation = useMutation<
    { success: boolean; message: string },
    any,
    { token: string; commentId: string; content: string }
  >({
    mutationFn: (variables: {
      token: string
      commentId: string
      content: string
    }) =>
      updateComment(variables.token, variables.commentId, variables.content),
    onSuccess: (data) => {
      toast.success(data.message)
      queryClient.invalidateQueries(["comments", postId])
      setEditComment(false)
    },
    onError: (err) => {
      toast.error(err.response?.data.err || err.message)
    },
  })
  return (
    <section
      key={com._id}
      className="w-full flex flex-col gap-2 bg-bgPrimary p-2 rounded-md shadow-md border border-gray-200 relative"
    >
      {com.userId._id === currentUserId && (
        <div
          className="absolute top-2 right-4 flex gap-3 items-center"
          onClick={() => setEditComment((prev) => !prev)}
        >
          <FiEdit3 className="hover:text-error hover:cursor-pointer" />
          <AiFillDelete
            className=" hover:text-error hover:cursor-pointer"
            onClick={(e) => {
              const confiramtion: boolean = confirm(
                "Voulez vous supprimer ce commentaire?"
              )
              if (!confiramtion) return
              deleteCommentMutation.mutate({
                token: accessToken,
                commentId: com._id,
              })
            }}
          />
        </div>
      )}
      <div className="flex gap-4  items-start">
        <img
          src={
            com.userId.googleID
              ? com.userId.image
              : `${import.meta.env.VITE_MEDIA_SERVIC}${com.userId.image}`
          }
          className="h-8 rounded-full"
          alt="pp"
        />
        <div className="flex flex-col items-start">
          <span className="text-xs text-gray-500">
            {com.createdAt.slice(0, 16).split("T").join(" ")}
          </span>
          <p className="font-bold text-sm">
            {com.userId.nom.toUpperCase()} {com.userId.prenom.toLowerCase()}
          </p>
        </div>
      </div>
      <div className="p-2">
        {editComment ? (
          <div className="w-full flex flex-col gap-3">
            <input
              type="text"
              placeholder="Commentaire..."
              value={currentCommentValue}
              onChange={(e) => setCurrentCommentValue(e.target.value)}
              className="input input-primary input-sm rounded-lg"
            />
            <div className="flex gap-2">
              <button
                className="flex-1 btn btn-xs text-gray-50 font-bold btn-success"
                onClick={() => {
                  if (currentCommentValue === "")
                    return toast.error("Champ vide")
                  updateCommentMutation.mutate({
                    token: accessToken,
                    commentId: com._id,
                    content: currentCommentValue,
                  })
                }}
              >
                Confirmer
              </button>
              <button
                className="flex-1 btn btn-xs text-gray-50 font-bold btn-error"
                onClick={() => setEditComment(false)}
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <p className=" bg-white p-2 text-sm rounded-lg">{com.content}</p>
        )}
      </div>
    </section>
  )
}
