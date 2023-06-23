import React from "react"
import { AiOutlinePlusCircle, AiFillPicture } from "react-icons/ai"

interface NewPostProps {}

export const NewPost: React.FC<NewPostProps> = ({}) => {
  return (
    <React.Fragment>
      {/* The button to open modal */}
      <label
        htmlFor="my_modal_6"
        className="btn btn-primary font-bold text-gray-50 flex items-center gap-4 mt-8"
      >
        Ajouter un post <AiOutlinePlusCircle className="text-2xl" />
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="my_modal_6" className="modal-toggle" />
      <div className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-xl text-primary text-center">
            Ajouter un post
          </h3>
          <form className="flex flex-col gap-3 p-4">
            <input
              type="text"
              placeholder="Titre du poste..."
              className="input input-bordered input-primary w-full"
              name="title"
            />
            <textarea
              className="textarea textarea-primary w-full"
              placeholder="Contenue du poste..."
              name="content"
            ></textarea>
            <label
              htmlFor="file"
              className="flex items-center gap-4 font-bold text-gray-50 btn btn-primary w-full"
            >
              Ajouter des photos <AiFillPicture className="text-2xl" />
            </label>
            <input type="file" name="images" className="hidden" id="file" />
          </form>
          <div className="modal-action">
            <label
              htmlFor="my_modal_6"
              className="btn btn-primary font-bold text-gray-50"
            >
              Ajouter
            </label>
            <label
              htmlFor="my_modal_6"
              className="btn btn-primary font-bold text-gray-50"
            >
              Annuler
            </label>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
