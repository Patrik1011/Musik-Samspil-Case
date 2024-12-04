import React from "react";

interface ParagraphProps {
  content: string | React.ReactNode;
  className?: string;
  isDate?: boolean;
  date?: string;
}

export const Paragraph = ({
  content,
  className,
  isDate,
  date,
}: ParagraphProps) => {
  let displayedContent = content;

  if (isDate && date) {
    const formattedDate = new Date(date);
    if (!isNaN(formattedDate.getTime())) {
      displayedContent = `${content} ${formattedDate.toLocaleDateString(
        "en-GB",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        },
      )}`;
    } else {
      displayedContent = "Invalid Date";
    }
  }

  return (
    <p className={`text-medium-gray text-sm ${className}`}>
      {displayedContent}
    </p>
  );
};
