import { Button } from "../../../Button.tsx";
import { Headline } from "../../../Headline.tsx";
import { faLocationDot, faUser } from "@fortawesome/free-solid-svg-icons";
import { Divider } from "../../../Divider.tsx";
import { SubHeadline } from "../../../SubHeadline.tsx";
import { DetailItem } from "../../../DetailItem.tsx";
import { formatAndValidateURL } from "../../../../utils/validateUrl.ts";
import { ContactModal } from "../modals/ContactModal.tsx";
import { useState } from "react";
import { Paragraph } from "../../../Paragraph.tsx";

interface PostDetailsInfoProps {
  title: string;
  description: string;
  firstName: string;
  lastName: string;
  website: string;
  type: string;
  email: string;
  phoneNumber: string;
  instruments: string[];
  ensembleName: string;
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
  email,
  ensembleName,
  phoneNumber,
  type,
  location,
  instruments,
  createdAt,
}: PostDetailsInfoProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <Paragraph content="Posted on" isDate={true} date={createdAt} />
          <DetailItem icon={faUser} content={`${firstName} ${lastName}`} />
          <DetailItem
            icon={faLocationDot}
            content={`${location.address}, ${location.city}, ${location.country}`}
          />
          <Paragraph content={type} className="font-semibold" />
        </div>
        <div>
          <Button
            title="Contact"
            type="button"
            className="text-white bg-steel-blue mt-4"
            onClick={() => setIsModalOpen(true)}
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
          <Paragraph content={description} />
        </div>
        <Button
          title="Visit website"
          type="button"
          onClick={handleWebsiteRedirection}
          className="mt-4 text-steel-blue border border-soft-gray"
        />
      </div>
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={email}
        ensembleName={ensembleName}
        firstName={firstName}
        lastName={lastName}
        phone={phoneNumber}
      />
    </div>
  );
};
