import { PostDetails } from "../../../../services/PostService.ts";
import { PostCard } from "./PostCard.tsx";

interface PostGridProps {
  posts: PostDetails[];
  handlePostClick: (id: string) => void;
  isPostCardAdmin?: boolean;
  onDeleteButtonClick?: (id: string) => void;
}

export const PostGrid = ({
  posts,
  handlePostClick,
  onDeleteButtonClick,
  isPostCardAdmin,
}: PostGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 md:mt-10">
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
            isPostCardAdmin={isPostCardAdmin}
            onDeleteButtonClick={() => onDeleteButtonClick?.(post._id)}
          />
        </div>
      ))}
    </div>
  );
};
