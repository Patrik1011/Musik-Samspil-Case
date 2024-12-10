import { useEffect, useState } from "react";
import { PostDetails, postService } from "../../services/PostService.ts";
import homeImage from "../../assets/images-svg/home.svg";
import { Select } from "../Select.tsx";
import { Instrument } from "../../enums/Instrument.ts";
import { Button } from "../Button.tsx";
import { useNavigate } from "react-router-dom";
import { Headline } from "../Headline.tsx";
import { PostGrid } from "../authenticated/posts/post-card/PostGrid.tsx";
import { Container } from "../Container.tsx";

export const Home = () => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await postService.getLatestPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const handlePostClick = (id: string) => {
    navigate(`/post-details/${id}`);
  };

  return (
    <Container className="my-8 md:my-0 md:mb-8">
      <section className="mb-16 flex items-center justify-center md:min-h-[70vh] md:mb-0">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between w-full">
          <div className="md:w-1/2">
            <p className="text-[30px] leading-[34px] mt-12 mb-7 text-custom-red font-oswald md:leading-[54px] md:mt-0 md:mb-14 md:text-[50px]">
              The place where amateur musicians find each other and play music
              together
            </p>
            <div className="flex flex-col space-y-2 md:flex-row items-center justify-between w-full md:space-y-0">
              <div className="w-full  md:w-1/2 md:mr-3">
                <Select
                  onChange={() => console.log()}
                  options={Object.values(Instrument).map((type) =>
                    type.toString(),
                  )}
                />
              </div>
              <div className="w-full md:w-1/2 md:ml-3">
                <Button
                  title="See posts"
                  className="text-white bg-steel-blue w-full"
                />
              </div>
            </div>
          </div>
          <img src={homeImage} alt="home" className="w-full md:w-auto" />
        </div>
      </section>
      <section>
        <div className="flex flex-col space-y-4 mb-4 md:flex-row md:justify-between md:items-baseline md:mt-8 md:mb-14">
          <Headline
            title="Latests posts"
            textColor="text-steel-blue"
            className="text-4xl font-oswald"
          />
          <a
            href="/posts"
            className="text-base md:text-lg text-custom-red font-bold"
          >
            See all posts
          </a>
        </div>
        <PostGrid posts={posts} handlePostClick={handlePostClick} />
      </section>
    </Container>
  );
};
