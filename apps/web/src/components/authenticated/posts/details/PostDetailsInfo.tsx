import { Button } from "../../../Button.tsx";
import { Headline } from "../../../Headline.tsx";
import { faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";
import { Divider } from "../../../Divider.tsx";
import { SubHeadline } from "../../../SubHeadline.tsx";
import { DetailItem } from "../../../DetailItem.tsx";
import { formatAndValidateURL } from "../../../../utils/validateUrl.ts";

interface PostDetailsInfoProps {
  title: string;
  description: string;
  firstName: string;
  lastName: string;
  website: string;
  type: string;
  instruments: string[];
  location: {
    address?: string;
    city?: string;
    country?: string;
  };
  createdAt: string;
}

export const PostDetailsInfo = ({
  title,
  description,
  firstName,
  lastName,
  website,
  type,
  location,
  instruments,
  createdAt,
}: PostDetailsInfoProps) => {
  const handleWebsiteRedirection = () => {
    const validatedUrl = formatAndValidateURL(website);
    if (validatedUrl) {
      window.location.replace(validatedUrl);
    }
  };

  return (
    <div>
      <div className="bg-white border border-soft-gray p-8 rounded-[10px] shadow-lg h-full">
        <Headline title="Post Details" textColor="text-steel-blue" />
        <div className="space-y-2">
          <p className="text-base font-bold text-steel-blue mt-4">{title}</p>
          <p className="text-medium-gray text-sm">
            Posted on{" "}
            {new Date(createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <DetailItem icon={faUser} content={`${firstName} ${lastName}`} />
          <DetailItem
            icon={faLocationDot}
            content={`${location.address}, ${location.city}, ${location.country}`}
          />
          <p className="text-medium-gray font-semibold text-sm">{type}</p>
        </div>
        <div>
          <Button
            title="Contact"
            type="button"
            className="text-white bg-steel-blue mt-4"
          />
        </div>
        <Divider className="my-4" />
        <div>
          <SubHeadline title="Instruments" className="text-steel-blue" />
          {instruments.map((instrument, index) => (
            <span key={instrument} className="text-medium-gray text-sm mr-1">
              {instrument}
              {index < instruments.length - 1 && ", "}
            </span>
          ))}
        </div>
        <div className="mt-4">
          <SubHeadline title="Description" className="text-steel-blue" />
          <p className="text-medium-gray text-sm">{description}</p>
        </div>
        <Button
          title="Visit website"
          type="button"
          onClick={handleWebsiteRedirection}
          className="mt-4 text-steel-blue border border-soft-gray"
        />
      </div>
    </div>
  );
};
