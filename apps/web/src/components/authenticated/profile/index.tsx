import { Button } from "../../Button.tsx";
import { useNavigate } from "react-router-dom";
import userImage from "../../../assets/images-svg/user.svg";
import { Headline } from "../../Headline.tsx";
import { Paragraph } from "../../Paragraph.tsx";
import { useEffect, useState } from "react";
import { userService } from "../../../services/UserService.ts";
import { UserEntity } from "../../../utils/types.ts";
import { PostCard } from "../posts/PostCard.tsx";

export const Profile = () => {
  const [user, setUser] = useState<UserEntity | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = () => {
    navigate("/update-profile");
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10">
      <section>
        <div className="flex flex-row items-center">
          <div className="flex items-center justify-center w-[98px] h-[98px] p-4 rounded-[20px] bg-light-gray border-4 border-white shadow-lg">
            <img src={userImage} alt="user" />
          </div>
          <div className="ml-8">
            <Headline title={`${user.first_name} ${user.last_name}`} textColor="text-custom-red" />
            <Paragraph content={user.email} className="mt-4" />
            <Paragraph content={user.phone_number} />
          </div>
        </div>
        <Button
          title="Update Profile"
          onClick={handleUpdateProfile}
          className="text-steel-blue bg-white shadow border border-soft-gray mt-8"
        />
      </section>
      <section>
        <div className="flex flex-col space-y-4 mb-4 md:flex-row md:justify-between md:items-baseline md:mt-8 md:mb-14">
          <Headline title="My Posts" textColor="text-steel-blue" className="text-4xl font-oswald" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                onClick={() => handlePostClick(post._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handlePostClick(post._id);
                  }
                }}
              >
                <PostCard
                  key={post._id}
                  title={post.title}
                  firstName={post.author_id.first_name}
                  lastName={post.author_id.last_name}
                  description={post.description}
                  type={post.type}
                  website={post.website_url}
                  createdAt={post.created_at}
                  instruments={post.ensemble_id.open_positions}
                  location={`${post.ensemble_id.location.city}, ${post.ensemble_id.location.country}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
