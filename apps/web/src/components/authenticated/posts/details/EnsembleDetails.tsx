import { Divider } from "../../../Divider.tsx";
import { DetailItem } from "../../../DetailItem.tsx";
import { faUser, faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { Headline } from "../../../Headline.tsx";

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
    <div className="bg-white border border-soft-gray p-8 rounded-[10px] shadow-lg h-full">
      <Headline title="Ensemble Details" textColor="text-steel-blue" />
      <div className="space-y-2">
        <p className="text-base font-bold text-steel-blue mt-4">{name}</p>
        <p className="text-medium-gray text-sm">{description}</p>

        <p className="text-medium-gray text-sm">
          Updated on{" "}
          {new Date(updatedAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {isActive ? "Active" : "Inactive"}
        </span>
      </div>
      <Divider className="my-4" />
      <Headline title="Contact Information" textColor="text-steel-blue" />
      <div className="space-y-2 mt-4">
        <DetailItem icon={faUser} content={creator} />
        <DetailItem icon={faPhone} content={creatorPhone} />
        <DetailItem icon={faEnvelope} content={creatorEmail} />
      </div>
    </div>
  );
};
