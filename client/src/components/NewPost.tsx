import React from "react"

interface NewPostProps {}

export const NewPost: React.FC<NewPostProps> = ({}) => {
  return (
    <div className="flex-1 bg-white flex flex-col p-4 gap-4">
      <input type="text" className="w-full input input-primary" />
      <label htmlFor="fileUpdate" className="btn btn-primary">
        Upload
      </label>
      <input type="file" id="fileUpdate" className="hidden" />
    </div>
  )
}
