import React, { useEffect, useRef, useState } from "react"
import emailjs from "@emailjs/browser"
import contactPage from "../assets/pictures/contactPage.jpg"
import toast from "react-hot-toast"

interface ContactProps {}

export const Contact: React.FC<ContactProps> = ({}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingState, setLoadingState] = useState<any>(null)
  const form = useRef<HTMLFormElement>(null)
  const sendEmail: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    setLoading(true)
    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICEID,
        import.meta.env.VITE_EMAILJS_TEMPLATEID,
        form.current!,
        import.meta.env.VITE_EMAILJS_PUBLICKEY
      )
      .then(
        () => {
          toast.success("Mail envoyer avec succès!")
        },
        (error) => {
          toast.error(error.text)
        }
      )
      .finally(() => {
        setLoading(false)
        form.current!.reset()
      })
  }
  useEffect(() => {
    if (loading) {
      setLoadingState(toast.loading("Envoie en cours..."))
    } else {
      setLoadingState(null)
      toast.dismiss(loadingState)
    }
  }, [loading])
  return (
    <div className="h-[93.1vh] flex justify-between">
      <div className="flex flex-col lg:flex-row w-[90%] lg:w-4/6 h-[90vh] lg:h-[80vh] my-auto border border-gray-200 rounded-3xl shadow-xl overflow-hidden mx-auto ">
        <img
          src={contactPage}
          alt="contact page"
          className="w-auto object-center h-1/3 lg:h-full lg:w-1/3 object-cover"
        />
        <div className="w-full flex h-2/3 lg:h-full flex-col lg:justify-center bg-white px-6 lg:px-16 py-8">
          <h1 className="text-center font-bold mb-2 lg:mb-8 text-purple-500 text-2xl lg:text-5xl">
            Nous contacter
          </h1>
          <form
            ref={form}
            onSubmit={sendEmail}
            className="flex flex-col px-1 gap-1 w-full lg:w-4/5 mx-auto overflow-y-auto my-auto"
          >
            <label className="text-sm md:text-md lg:text-md text-gray-600">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Votre nom..."
              required
              className="lg:mb-4 mb-2  input input-primary input-sm md:input-lg lg:input-md text-lg bg-gray-50"
            />
            <label className="text-sm md:text-md lg:text-md text-gray-600">
              Subject
            </label>
            <input
              type="text"
              name="subject"
              placeholder="Sujet..."
              required
              className="lg:mb-4 mb-2  input input-primary input-sm md:input-lg lg:input-md text-lg bg-gray-50"
            />
            <label className="text-sm md:text-md lg:text-md text-gray-600">
              Email
            </label>
            <input
              type="email"
              placeholder="Votre adresse mail..."
              name="mail"
              required
              className="lg:mb-4 mb-2  input input-primary input-sm md:input-lg lg:input-md text-lg bg-gray-50"
            />
            <label className="text-sm md:text-md lg:text-md text-gray-600">
              Message
            </label>
            <textarea
              placeholder="Votre message..."
              name="message"
              required
              className="lg:mb-4 mb-2  textarea textarea-primary textarea-sm md:textarea-md lg:textarea-md text-lg bg-gray-50"
            />
            <input
              type="submit"
              value="Envoyer"
              disabled={loading}
              className="btn btn-accent btn-sm  md:btn-md text-lg text-gray-50 shadow-md focus:bg-success"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
