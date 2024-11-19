import React from "react";

export const MenuIcon = (props: React.ComponentPropsWithoutRef<"svg">) => {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24" {...props}>
      <path
        d="M5 6h14M5 18h14M5 12h14"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
      />
    </svg>
  );
};
