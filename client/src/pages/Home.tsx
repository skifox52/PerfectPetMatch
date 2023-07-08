import { HeroSection } from "../components/HeroSection"
import { SideMenu } from "../components/SideMenu"
import { NewPost } from "../components/NewPost"
import { FilterPost } from "../components/FilterPost"
import { Post } from "../components/Post"
import { useQuery } from "@tanstack/react-query"
import { getPosts } from "../api/postApi"
import { useAuth } from "../hooks/useAuth"

export const Home: React.FC = () => {
  const userContext = useAuth()
  const { data } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getPosts(userContext?.user?.accessToken as string),
  })
  return (
    <div className="min-h-screen max-w-screen bg-bgPrimary">
      <header>
        <HeroSection />
      </header>
      <main className="flex justify-between gap-4 px-4 pt-8 w-full relative mx-auto">
        <SideMenu />
        <section className=" w-full flex flex-col items-center gap-6">
          <NewPost />
          {data ? (
            data.map((post) => (
              <Post
                key={post._id}
                nom={post.owner.nom}
                googleID={post.owner.googleID}
                prenom={post.owner.prenom}
                pet={post.pet}
                profilePicture={post.owner.image}
                title={post.title}
                content={post.content}
                postPicture={post.images}
                likes={post.likes}
                commentCount={post.comments.length}
                createdAt={post.createdAt}
              />
            ))
          ) : (
            <h1>Loading...</h1>
          )}
        </section>
        <FilterPost />
      </main>
    </div>
  )
}
