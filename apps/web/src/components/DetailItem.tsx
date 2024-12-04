import {
  FontAwesomeIcon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import React from "react";

interface DetailItemProps {
  icon: FontAwesomeIconProps["icon"];
  content: React.ReactNode;
  className?: string;
  spanClassName?: string;
}

export const DetailItem = ({
  icon,
  content,
  className,
  spanClassName,
}: DetailItemProps) => {
  const isStringContent = typeof content === "string";

  return (
    <div className={`flex items-start ${className}`}>
      <FontAwesomeIcon
        icon={icon}
        className="text-medium-gray mr-3 text-sm self-center"
      />
      {isStringContent ? (
        <span className={`text-medium-gray text-sm ${spanClassName}`}>
          {content}
        </span>
      ) : (
        content
      )}
    </div>
  );
};
