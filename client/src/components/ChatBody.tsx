import React from "react"
import { FiSend } from "react-icons/fi"

interface ChatBodyProps {}

export const ChatBody: React.FC<ChatBodyProps> = ({}) => {
  //Handle onSubmit
  const handleOnSubmite: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
  }
  return (
    <main className="bg-base-300 flex-1 h-5/6 first-letter rounded-3xl p-8 flex flex-col gap-6 items-center shadow-md shadow-gray-600">
      <section className="rounded-3xl bg-base-100 w-full block flex-1 border-gray-300 border shadow-md"></section>
      <section className="h-16 w-full rounded-3xl relative flex items-center shadow-md">
        <form onSubmit={handleOnSubmite} className="h-full w-full">
          <input
            type="text"
            name="chatBody"
            placeholder="Saisissez votre message..."
            className="h-full w-full rounded-3xl pl-6  input border-2 input-primary font-bold tracking-wide pr-16"
          />
          <button
            type="submit"
            className="absolute right-6 h-full w-8 text-neutral hover:text-primary cursor-pointer"
          >
            <FiSend className="h-full w-full" />
          </button>
        </form>
      </section>
    </main>
  )
}
