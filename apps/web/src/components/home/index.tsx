import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import homeImage from "../../assets/images-svg/home.svg";
import { Instrument } from "../../enums/Instrument.ts";
import {
  PostDetails,
  postService,
  SearchCriteria,
} from "../../services/PostService.ts";
import { PostGrid } from "../authenticated/posts/post-card/PostGrid.tsx";
import { Button } from "../Button.tsx";
import { Container } from "../Container.tsx";
import { Headline } from "../Headline.tsx";
import { Select } from "../Select.tsx";

export const Home = () => {
  const [posts, setPosts] = useState<PostDetails[]>([]);
  const [showingPosts, setShowingPosts] = useState<PostDetails[]>([]);
  const [notFoundInstrument, setNotFoundInstrument] = useState<string | null>(
    null,
  );
  const [selectedInstrument, setSelectedInstrument] = useState<string | null>(
    null,
  );

  const navigate = useNavigate();

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedInstrument(event.target.value);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    setShowingPosts(posts);
  }, [posts]);

  const fetchPosts = async () => {
    try {
      const data = await postService.getLatestPosts();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  const searchPostBasedOnInstrument = async (instrument: SearchCriteria) => {
    setNotFoundInstrument(instrument?.instrument ?? null);
    try {
      const data = await postService.searchPost(instrument);
      setShowingPosts(data);
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
          <div className="md:w-1/1">
            <p className="text-[30px] leading-[34px] mt-12 mb-7 text-custom-red font-oswald md:leading-[54px] md:mt-0 md:mb-14 md:text-[50px]">
              The place where amateur musicians find each other and play music
              together
            </p>
            <div className="flex flex-col space-y-2 md:flex-row items-center justify-between w-full md:space-y-0">
              <div className="w-full  md:w-1/2 md:mr-3">
                <Select
                  onChange={(selectedOption) =>
                    handleSelectChange(selectedOption)
                  }
                  options={Object.values(Instrument).map((type) =>
                    type.toString(),
                  )}
                />
              </div>
              <div className="w-full md:w-1/2 md:ml-3">
                <Button
                  title="See posts"
                  className="text-white bg-steel-blue w-full"
                  onClick={() =>
                    selectedInstrument
                      ? searchPostBasedOnInstrument({
                          instrument: selectedInstrument,
                        })
                      : console.error("No instrument selected")
                  }
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
        {showingPosts.length > 0 ? (
          <PostGrid posts={showingPosts} handlePostClick={handlePostClick} />
        ) : (
          <p>No posts available at this moment with {notFoundInstrument}! </p>
        )}
      </section>
    </Container>
  );
};
