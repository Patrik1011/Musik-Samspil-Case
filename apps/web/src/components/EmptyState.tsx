import { Button } from "./Button.tsx";
import { Paragraph } from "./Paragraph.tsx";
import noteImage from "../assets/note.png";

interface EmptyStateProps {
  message: string;
  description?: string;
  onClick: () => void;
  imageSrc?: string;
  buttonTitle?: string;
}

export const EmptyState = ({
  message,
  description = `Create a ${message} so you can find, or be found by other musicians.`,
  onClick,
  imageSrc = noteImage,
  buttonTitle = `Create ${message}`,
}: EmptyStateProps) => {
  return (
    <div className="flex flex-col justify-center items-center h-full">
      <img
        src={imageSrc}
        alt={`${message} illustration`}
        className="w-24 h-24"
      />
      <p className="text-center text-steel-blue text-lg font-bold mt-4">
        You don't have any {message} yet
      </p>
      <Paragraph
        content={description}
        className="text-center px-8 mt-2"
        textSizes="text-base"
      />

      <Button
        title={buttonTitle}
        onClick={onClick}
        className="text-white bg-steel-blue mt-8"
      />
    </div>
  );
};
