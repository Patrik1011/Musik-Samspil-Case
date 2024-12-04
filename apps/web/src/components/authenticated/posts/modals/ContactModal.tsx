import { Dialog } from "@headlessui/react";
import { Button } from "../../../Button.tsx";
import contactIcon from "../../../../assets/images-svg/contact-icon.svg";
import { Headline } from "../../../Headline.tsx";

interface ContactModalProps {
  ensembleName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal = ({
  ensembleName,
  firstName,
  lastName,
  phone,
  isOpen,
  onClose,
  email,
}: ContactModalProps) => {
  return (
    <Dialog
      onClose={onClose}
      open={isOpen}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-transparent-black" aria-hidden="true" />
      <Dialog.Panel className="bg-white p-6 z-50 rounded-[10px] shadow-lg max-w-lg flex flex-col items-center justify-center">
        <img src={contactIcon} alt="music" className="object-contain mb-4" />
        <Dialog.Title>
          <Headline title={`Contact ${ensembleName}`} textColor="text-steel-blue" />
        </Dialog.Title>
        <div>
          <p className="text-medium-gray text-sm mt-1">
            Contact person: {firstName} {lastName}
          </p>
        </div>
        <div className="space-y-2 mt-4 w-full">
          <a
            href={`tel:${phone}`}
            className="block text-base text-center font-bold py-3 px-8 rounded-[10px] text-white bg-steel-blue"
          >
            {phone}
          </a>
          <a
            href={`mailto:${email}`}
            className="block text-base text-center font-bold py-3 px-8 rounded-[10px] text-white bg-steel-blue"
          >
            {email}
          </a>
          <Button
            onClick={onClose}
            className="text-steel-blue shadow-none border border-soft-gray w-full"
            title="Close"
          />
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};
