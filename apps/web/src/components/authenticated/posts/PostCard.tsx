import { faUser, faGlobe, faMusic } from "@fortawesome/free-solid-svg-icons";
import musicImage from "../../../assets/images-svg/music.svg";
import { DetailItem } from "../../DetailItem.tsx";
import { SubHeadline } from "../../SubHeadline.tsx";
import { formatAndValidateURL } from "../../../utils/validateUrl.ts";
import { Paragraph } from "../../Paragraph.tsx";
import { DeleteButton } from "../../DeleteButton.tsx";

interface PostCardProps {
  postId?: string;
  title: string;
  description: string;
  firstName: string;
  lastName: string;
  website: string;
  type: string;
  createdAt: string;
  instruments: string[];
  location: string;
  className?: string;
  isPostCardAdmin?: boolean;
  onDeleteButtonClick?: (id: string) => void;
  deleteButtonClassName?: string;
}

export const PostCard = ({
  postId,
  title,
  website,
  firstName,
  lastName,
  instruments,
  type,
  location,
  createdAt,
  className,
  isPostCardAdmin = false,
  onDeleteButtonClick,
  deleteButtonClassName,
}: PostCardProps) => {
  const formattedUrl = formatAndValidateURL(website);

  const formattedDate = new Date(createdAt).toLocaleDateString("da-DK", {
    day: "numeric",
    month: "long",
  });

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteButtonClick?.(postId ?? "");
  };

  return (
    <article
      className={`bg-white rounded-[10px] border border-soft-gray shadow transition-transform transform hover:scale-105 ${className}`}
    >
      <header className="px-4 pt-4">
        <SubHeadline title={title} className="text-steel-blue" />
      </header>

      <section className="px-4 mt-2">
        <ul className="space-y-1">
          <DetailItem icon={faUser} content={`${firstName} ${lastName}`} />
          <DetailItem
            icon={faMusic}
            content={instruments.map((instrument, index) => (
              <span key={instrument} className="text-medium-gray text-sm mr-1">
                {instrument}
                {index < instruments.length - 1 && ", "}
              </span>
            ))}
          />
          <DetailItem
            icon={faGlobe}
            content={
              <a
                href={formattedUrl || "#"}
                className="text-medium-gray text-sm hover:underline truncate"
                title={website}
                onClick={(e) => e.stopPropagation()}
              >
                {website}
              </a>
            }
          />
        </ul>
        <div className="flex justify-between mt-2">
          <Paragraph content={type} className="font-semibold" />
          <img src={musicImage} alt="music" className="object-contain" />
        </div>
      </section>

      <footer className="flex items-center bg-light-gray border-t rounded-b-[10px]">
        <div className="flex pl-4 py-2">
          <p className="text-sm text-medium-gray">{formattedDate} •</p>
          <Paragraph content={location} className="ml-1" />
        </div>
        {isPostCardAdmin && (
          <DeleteButton onClick={handleDeleteClick} className={deleteButtonClassName} />
        )}
      </footer>
    </article>
  );
};
