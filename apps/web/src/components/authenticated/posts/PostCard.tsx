import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faGlobe, faMusic } from "@fortawesome/free-solid-svg-icons";
import musicImage from "../../../assets/images-svg/music.svg";

interface PostCardProps {
  title: string;
  description: string;
  firstName: string;
  lastName: string;
  website: string;
  type: string;
  instruments: string[];
  location: string;
  className?: string;
}

export const PostCard = ({
  title,
  website,
  firstName,
  lastName,
  instruments,
  type,
  location,
  className,
}: PostCardProps) => {
  return (
    <div
      className={`bg-white rounded-[10px] border border-soft-gray shadow ${className}`}
    >
      <div className="px-4 pt-4">
        <p className="text-base font-bold text-steel-blue">{title}</p>
        <div className="mt-2">
          <div className="flex items-start w-full">
            <div>
              <FontAwesomeIcon
                icon={faUser}
                className="text-medium-gray mr-3 text-sm"
              />
              <span className="text-medium-gray text-sm">{`${firstName} ${lastName}`}</span>
            </div>
          </div>
          <div>
            <FontAwesomeIcon
              icon={faMusic}
              className="text-medium-gray mr-3 text-sm"
            />
            {instruments.map((instrument) => (
              <span key={instrument} className="text-medium-gray text-sm mr-1">
                {instrument}
              </span>
            ))}
          </div>
          <div>
            <FontAwesomeIcon
              icon={faGlobe}
              className="text-medium-gray mr-3 text-sm"
            />
            <a
              href={website}
              className="text-medium-gray text-sm hover:underline truncate"
              title={website}
            >
              {website}
            </a>
          </div>
          <div className="flex justify-between">
            <div>
              <span className="text-medium-gray font-semibold text-sm">
                {type}
              </span>
            </div>
            <div>
              <img src={musicImage} alt="music" className="object-contain" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center bg-light-gray border-t rounded-b-[10px]">
        <div className="pl-4 py-2">
          <span className="text-medium-gray text-sm">{location}</span>
        </div>
      </div>
    </div>
  );
};
