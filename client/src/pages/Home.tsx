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
  console.log(data)
  return (
    <div className="min-h-screen max-w-screen  bg-base-200  ">
      <header>
        <HeroSection />
      </header>
      {/* <HomeContainer /> */}
      <main className=" flex flex-col gap-8 items-center">
        <div className="gap-4 h-full flex mt-16 w-full">
          <SideMenu />
          <NewPost />
          <FilterPost />
        </div>
        {data ? (
          data.map((post) => (
            <Post
              key={post._id}
              nom={post.owner.nom}
              prenom={post.owner.prenom}
              profilePicture={post.owner.image}
              title={post.title}
              content={post.content}
              postPicture={post.images[0]}
              likes={post.likes}
              commentCount={post.comments.length}
            />
          ))
        ) : (
          <h1>Loading...</h1>
        )}
      </main>
    </div>
  )
}
