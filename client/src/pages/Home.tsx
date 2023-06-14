import { HeroSection } from "../components/HeroSection"
import { SideMenu } from "../components/SideMenu"
import { NewPost } from "../components/NewPost"
import { FilterPost } from "../components/FilterPost"
import { Post } from "../components/Post"

export const Home: React.FC = () => {
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
        <Post />
      </main>
    </div>
  )
}
