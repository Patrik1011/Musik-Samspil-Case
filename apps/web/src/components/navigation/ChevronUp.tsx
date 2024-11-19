import React from "react";

export const ChevronUpIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path d="M17 14l-5-5-5 5" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
    </svg>
  );
};
