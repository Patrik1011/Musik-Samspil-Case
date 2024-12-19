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

  const formatLocation = (location: PostDetailsInfoProps["location"]) =>
    [location.address, location.city, location.country].filter(Boolean).join(", ") ||
    "Location not available";

  return (
    <section className="bg-white border border-soft-gray p-8 rounded-[10px] shadow-lg h-full">
      <Headline title="Post Details" textColor="text-steel-blue" />

      <article className="space-y-2">
        <p className="text-base font-bold text-steel-blue mt-4">{title}</p>
        <Paragraph content="Posted on" isDate={true} date={createdAt} />
        <DetailItem icon={faUser} content={`${firstName} ${lastName}`} />
        <DetailItem icon={faLocationDot} content={formatLocation(location)} />
        <Paragraph content={type} className="font-semibold" />
      </article>

      <Button
        title="Contact"
        type="button"
        className="text-white bg-steel-blue mt-4"
        onClick={() => setIsModalOpen(true)}
      />

      <Divider className="my-4" />

      <section>
        <SubHeadline title="Instruments" className="text-steel-blue" />
        <p className="text-medium-gray text-sm">
          {instruments.length ? instruments.join(", ") : "No instruments listed."}
        </p>
      </section>

      <section className="mt-4">
        <SubHeadline title="Description" className="text-steel-blue" />
        <Paragraph content={description} />
      </section>

      <Button
        title="Visit website"
        type="button"
        onClick={handleWebsiteRedirection}
        className="mt-4 text-steel-blue border border-soft-gray"
      />

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={email}
        ensembleName={ensembleName}
        firstName={firstName}
        lastName={lastName}
        phone={phoneNumber}
      />
    </section>
  );
};
