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
      <img
        src={contactPage}
        alt="contact page"
        className="w-2/5 object-center object-cover"
      />
      <div className="flex items-center justify-center w-full">
        <div className="w-3/5 bg-white border border-gray-200 rounded-2xl shadow-xl px-16 py-8">
          <h1 className="text-center font-bold mb-8 text-purple-500 text-5xl">
            Nous contacter
          </h1>
          <form
            ref={form}
            onSubmit={sendEmail}
            className="flex flex-col gap-1 w-4/5 mx-auto"
          >
            <label className="text-md text-gray-600">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Votre nom..."
              required
              className="mb-4 input input-primary input-md text-lg bg-gray-50"
            />
            <label className="text-md text-gray-600">Subject</label>
            <input
              type="text"
              name="subject"
              placeholder="Sujet..."
              required
              className="mb-4 input input-primary input-md text-lg bg-gray-50"
            />
            <label className="text-md text-gray-600">Email</label>
            <input
              type="email"
              placeholder="Votre adresse mail..."
              name="mail"
              required
              className="mb-4 input input-primary input-md text-lg bg-gray-50"
            />
            <label className="text-md text-gray-600">Message</label>
            <textarea
              placeholder="Votre message..."
              name="message"
              required
              className="mb-4 textarea textarea-primary textarea-md text-lg bg-gray-50"
            />
            <input
              type="submit"
              value="Envoyer"
              disabled={loading}
              className="btn btn-accent btn-md text-lg text-gray-50 shadow-md focus:bg-success"
            />
          </form>
        </div>
      </div>
    </div>
  )
}
