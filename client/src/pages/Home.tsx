import { HeroSection } from "../components/HeroSection"
import { SideMenu } from "../components/SideMenu"
import { NewPost } from "../components/NewPost"
import { FilterPost } from "../components/FilterPost"
import { Post } from "../components/Post"
import { useInfiniteQuery } from "@tanstack/react-query"
import { getPosts } from "../api/postApi"
import { useAuth } from "../hooks/useAuth"
import { PostInterface } from "../types/postType"
import InfiniteScroll from "react-infinite-scroll-component"

export const Home: React.FC = () => {
  const userContext = useAuth()

  const { data, fetchNextPage, isLoading, hasNextPage } = useInfiniteQuery<
    {
      posts: PostInterface[]
      totalPages: number
    },
    any,
    {
      posts: PostInterface[]
      totalPages: number
    }
  >(
    ["posts"],
    ({ pageParam = 1 }) => getPosts(userContext?.user?.accessToken!, pageParam),
    {
      getNextPageParam: (lastPage, page) =>
        page.length < lastPage.totalPages ? page.length + 1 : undefined,
      cacheTime: 3600,
    }
  )

  const posts =
    data &&
    data!.pages.reduce(
      (
        acc: PostInterface[],
        post: { posts: PostInterface[]; totalPages: number }
      ) => {
        return [...acc, ...post.posts]
      },
      []
    )
  return (
    <div className="min-h-screen max-w-screen">
      <header>
        <HeroSection />
      </header>
      <main className="flex justify-between gap-4 px-4 pt-8 w-full relative mx-auto">
        <SideMenu />
        <section className="w-full flex flex-col items-center gap-6">
          <NewPost />
          <InfiniteScroll
            dataLength={posts ? posts.length : 0}
            next={() => fetchNextPage()}
            hasMore={hasNextPage as boolean}
            loader={
              <div className="flex items-center justify-center space-x-2 mt-4 mb-6">
                <div className="w-4 h-4 rounded-full animate-pulse dark:bg-primary"></div>
                <div className="w-4 h-4 rounded-full animate-pulse dark:bg-accent"></div>
                <div className="w-4 h-4 rounded-full animate-pulse dark:bg-secondary"></div>
              </div>
            }
            endMessage={
              <div className="w-full bg-white border border-300 shadow-lg  flex justify-center font-semibold text-purple-500 text-xl  my-8 bg-opacity-60 px-4 py-2 rounded-lg">
                <p>Aucun post a afficher!</p>
              </div>
            }
            className="w-full flex flex-col gap-6"
          >
            {posts ? (
              posts.map((post) => (
                <Post
                  key={post._id}
                  nom={post.owner.nom}
                  googleID={post.owner.googleID}
                  prenom={post.owner.prenom}
                  profilePicture={post.owner.image}
                  category={post.category}
                  postId={post._id}
                  description={post.description}
                  postPicture={post.images}
                  likes={post.likes}
                  commentCount={post.comments.length}
                  createdAt={post.createdAt}
                  pet={post.pet}
                />
              ))
            ) : (
              <h1>Loading...</h1>
            )}
          </InfiniteScroll>
        </section>
        <FilterPost />
      </main>
    </div>
  )
}
