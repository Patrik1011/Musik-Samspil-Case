import { Divider } from "../../../Divider.tsx";
import { DetailItem } from "../../../DetailItem.tsx";
import { faUser, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Headline } from "../../../Headline.tsx";
import { Paragraph } from "../../../Paragraph.tsx";

interface EnsembleDetailsProps {
  name: string;
  description: string;
  isActive: boolean;
  updatedAt: string;
  creator: string;
  creatorPhone: string;
  creatorEmail: string;
}

export const EnsembleDetails = ({
  name,
  creator,
  creatorPhone,
  creatorEmail,
  updatedAt,
  isActive,
  description,
}: EnsembleDetailsProps) => {
  return (
    <section className="bg-white border border-soft-gray p-8 rounded-[10px] shadow-lg h-full">
      <Headline title="Ensemble Details" textColor="text-steel-blue" />

      <article>
        <div className="space-y-2">
          <p className="text-base font-bold text-steel-blue mt-4">{name}</p>
          <Paragraph content={description || ""} />
          <Paragraph content="Updated on" isDate={true} date={updatedAt} />
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-5 ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </article>

      <Divider className="my-4" />

      <article>
        <Headline title="Contact Information" textColor="text-steel-blue" />
        <div className="space-y-2 mt-4">
          <DetailItem icon={faUser} content={creator || ""} />
          <DetailItem icon={faPhone} content={creatorPhone || ""} />
          <DetailItem icon={faEnvelope} content={creatorEmail || ""} />
        </div>
      </article>
    </section>
  );
};
